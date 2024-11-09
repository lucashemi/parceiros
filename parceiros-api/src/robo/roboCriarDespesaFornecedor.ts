import dbBC from "../database/databaseBC";
import db from "../database/database";
import FornecedorService from "../services/fornecedorService";
import FinanceiroService from "../services/financeiroService";
import delay from "../utils/delay";
import sendEmail from "../utils/sendEmail";

export default async function roboCriarDespesaFornecedor() {
    console.log('Iniciando Robo Criar Despesa Fornecedor');

    // pegar opp pagas no bd do joao
    const oportunidadesPagas = await dbBC("conquistas_robo")
        .select('id', 'nome_lead')
        .where({ status_quitado: 1 })
        .andWhere({ coletado_parceiros: 0 });

    // se n encontrar nenhuma nova retornar
    if (oportunidadesPagas.length == 0) {
        console.log('Nenhuma oportunidade encontrada.');
        return;
    }

    console.log('Quantidade de novas oportunidades pagas:', oportunidadesPagas.length);

    // pra cada nova venda realizar a atualizacao dos dados
    for (const oportunidade of oportunidadesPagas) {
        try {

            // alterar status da indicacao para venda realizada
            const response = await db("parceiros_cliente")
                .where({ id_lead: oportunidade.id })
                .update({ status: "Venda Realizada" });

            // alterar status da venda no bd do joao para coletada
            await dbBC("conquistas_robo")
                .where({ id: oportunidade.id })
                .update({ coletado_parceiros: 1 });

            // se for parceiro criar despesa com fornecedor
            if (response == 1) {
                // buscar parceiro no bd
                const parceiro = await db("parceiros_cliente")
                    .join('parceiros_parceiro', 'parceiros_parceiro.id', 'parceiros_cliente.parceiro_id')
                    .join('parceiros_endereco', 'parceiros_endereco.id', 'parceiros_parceiro.endereco_id')
                    .join('parceiros_email', 'parceiros_email.id', 'parceiros_parceiro.email_id')
                    .select(
                        'parceiros_parceiro.id as parceiro_id',
                        'parceiros_parceiro.*',
                        'parceiros_endereco.id as endereco_id',
                        'parceiros_endereco.*',
                        'parceiros_email.id as email_id',
                        'parceiros_email.*'
                    )
                    .where('parceiros_cliente.id_lead', oportunidade.id)
                    .first();

                const parceiroEhPj = parceiro.documento.length == 14;
                // verificar se existe fornecedor no bc senao criar
                const fornecedorService = new FornecedorService(process.env.TOKEN_ID || ""); // token lucas
                const parceiroBC = await fornecedorService.buscarFornecedor(parceiro.documento);

                let idFornecedor = null;

                if (parceiroBC.length == 0) {
                    // criar fornecedor
                    const dadosFornecedor = {
                        ...(parceiroEhPj ? {
                            "PessoaJuridica": {
                                "Documento": parceiro.documento,
                                "NomeFantasia": parceiro.razao_social,
                                "RazaoSocial": parceiro.razao_social,
                            }
                        } : {
                            "PessoaFisica": {
                                "Documento": parceiro.documento,
                                "Nome": parceiro.razao_social,
                            }
                        }),
                        "Endereco": {
                            "Logradouro": parceiro.logradouro,
                            "Numero": parceiro.numero,
                            "Complemento": parceiro.complemento,
                            "Bairro": parceiro.bairro,
                            "Cep": parceiro.cep,
                            "Cidade": parceiro.municipio,
                            "Uf": parceiro.uf
                        },
                        "Contatos": [
                            {
                                "Nome": parceiro.nome,
                                "Email": parceiro.email,
                                "Telefone": parceiro.tel1,
                            }
                        ]
                    }

                    await delay(60);

                    idFornecedor = await fornecedorService.criarFornecedor(dadosFornecedor);
                    
                    // Ao criar um fornecedor via API ele retorna um id que não é o id do fornecedor, na documentação da API diz que retornaria o id do mesmo, poderiam arrumar isso?
                    // Workaround pra passar o id do fornecedor para o idFornecedor
                    const fornecedorCriado = await fornecedorService.buscarFornecedor(parceiro.documento);
                    idFornecedor = fornecedorCriado[0].Id;
                } else {
                    idFornecedor = parceiroBC[0].Id;
                }

                // criar despesa fornecedor no bc
                const financeiroService = new FinanceiroService(process.env.TOKEN_ID || ""); // token lucas

                // gera outros dados necessarios para criar despesa

                // datas
                const dataAtual = new Date();
                const dataMais3Dias = new Date(dataAtual);
                dataMais3Dias.setDate(dataAtual.getDate() + 3);

                const dataAtualFormatada = dataAtual.toISOString().split('T')[0];
                const dataMais3DiasFormatada = dataMais3Dias.toISOString().split('T')[0];

                // valor
                let valorParticipacao;

                const valorTotalDaVenda = await dbBC("conquistas_robo")
                    .select("valor")
                    .where({ id: oportunidade.id })
                    .first();

                if (parceiro.taxa_tipo == "Fixa") {
                    valorParticipacao = parceiro.taxa_valor;
                } else {
                    valorParticipacao = (valorTotalDaVenda?.valor || 0) * (parceiro.taxa_valor / 100);
                }

                const dadosDespesaFornecedor = {
                    "IdFornecedor": idFornecedor,
                    "IdContaFinanceira": 1, // banco do brasil 5
                    "IdCategoriaFinanceira": 62, // parcerias
                    "IdDepartamento": 2, // comercial novos negocios
                    "FormaPagamento": {
                        "Outros": {
                            "Nome": "Pix"
                        },
                    },
                    "PrimeiroVencimento": dataMais3DiasFormatada + " 00:00:00", // 3 dias da data atual
                    "DataCompetencia": dataAtualFormatada + " 00:00:00", // mes atual
                    "QuantidadeParcelas": 1,
                    "Valor": valorParticipacao // valor ja calculado
                }

                await delay(60);

                const despesaFornecedorCriada = await financeiroService.criarDespesaFornecedor(dadosDespesaFornecedor);

                // gravar id movimentacao parcela no bd
                await db("parceiros_cliente")
                    .where("id_lead", oportunidade.id)
                    .update({
                        id_parcela_bc: despesaFornecedorCriada.IdMovimentacaoFinanceiraParcela,
                        valor_participacao: valorParticipacao
                    });

                // enviar email para financeiro
                await sendEmail(parceiro, oportunidade, valorTotalDaVenda?.valor || 0, valorParticipacao, dataMais3Dias);

                console.log(`Foi criada despesa fornecedor para oportunidade ${oportunidade.id}!`);    
            }

            console.log(`Oportunidade ${oportunidade.id} atualizada com sucesso.`);
        } catch (error) {
            console.error(error);
        }
    }


    console.log('Finalizando Robo Criar Despesa Fornecedor');

    setTimeout(roboCriarDespesaFornecedor, 60 * 60 * 1000);
}