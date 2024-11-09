"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const databaseBC_1 = __importDefault(require("../database/databaseBC"));
const database_1 = __importDefault(require("../database/database"));
const fornecedorService_1 = __importDefault(require("../services/fornecedorService"));
const financeiroService_1 = __importDefault(require("../services/financeiroService"));
const delay_1 = __importDefault(require("../utils/delay"));
function roboCriarDespesaFornecedor() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Iniciando Robo Criar Despesa Fornecedor');
        // pegar opp pagas no bd do joao
        const oportunidadesPagas = yield (0, databaseBC_1.default)("conquistas_robo")
            .select('id')
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
                const response = yield (0, database_1.default)("parceiros_cliente")
                    .where({ id_lead: oportunidade.id })
                    .update({ status: "Venda Realizada" });
                // alterar status da venda no bd do joao para coletada
                yield (0, databaseBC_1.default)("conquistas_robo")
                    .where({ id: oportunidade.id })
                    .update({ coletado_parceiros: 1 });
                // se for parceiro criar despesa com fornecedor
                if (response == 1) {
                    // buscar parceiro no bd
                    const parceiro = yield (0, database_1.default)("parceiros_cliente")
                        .join('parceiros_parceiro', 'parceiros_parceiro.id', 'parceiros_cliente.parceiro_id')
                        .join('parceiros_endereco', 'parceiros_endereco.id', 'parceiros_parceiro.endereco_id')
                        .join('parceiros_email', 'parceiros_email.id', 'parceiros_parceiro.email_id')
                        .select('parceiros_parceiro.id as parceiro_id', 'parceiros_parceiro.*', 'parceiros_endereco.id as endereco_id', 'parceiros_endereco.*', 'parceiros_email.id as email_id', 'parceiros_email.*')
                        .where('parceiros_cliente.id_lead', oportunidade.id)
                        .first();
                    const parceiroEhPj = parceiro.documento.length == 14;
                    // verificar se existe fornecedor no bc senao criar
                    const fornecedorService = new fornecedorService_1.default(process.env.TOKEN_ID || ""); // token lucas
                    const parceiroBC = yield fornecedorService.buscarFornecedor(parceiro.documento);
                    let idFornecedor = null;
                    if (parceiroBC.length == 0) {
                        // criar fornecedor
                        const dadosFornecedor = Object.assign(Object.assign({}, (parceiroEhPj ? {
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
                        })), { "Endereco": {
                                "Logradouro": parceiro.logradouro,
                                "Numero": parceiro.numero,
                                "Complemento": parceiro.complemento,
                                "Bairro": parceiro.bairro,
                                "Cep": parceiro.cep,
                                "Cidade": parceiro.municipio,
                                "Uf": parceiro.uf
                            }, "Contatos": [
                                {
                                    "Nome": parceiro.nome,
                                    "Email": parceiro.email,
                                    "Telefone": parceiro.tel1,
                                }
                            ] });
                        yield (0, delay_1.default)(60);
                        idFornecedor = yield fornecedorService.criarFornecedor(dadosFornecedor);
                        // Ao criar um fornecedor via API ele retorna um id que não é o id do fornecedor, na documentação da API diz que retornaria o id do mesmo, poderiam arrumar isso?
                        // Workaround pra passar o id do fornecedor para o idFornecedor
                        const fornecedorCriado = yield fornecedorService.buscarFornecedor(parceiro.documento);
                        idFornecedor = fornecedorCriado[0].Id;
                    }
                    else {
                        idFornecedor = parceiroBC[0].Id;
                    }
                    // criar despesa fornecedor no bc
                    const financeiroService = new financeiroService_1.default(process.env.TOKEN_ID || ""); // token lucas
                    // gera outros dados necessarios para criar despesa
                    // datas
                    const dataAtual = new Date();
                    const dataMais3Dias = new Date(dataAtual);
                    dataMais3Dias.setDate(dataAtual.getDate() + 3);
                    const dataAtualFormatada = dataAtual.toISOString().split('T')[0];
                    const dataMais3DiasFormatada = dataMais3Dias.toISOString().split('T')[0];
                    // valor
                    let valor;
                    if (parceiro.taxa_tipo == "Fixa") {
                        valor = parceiro.taxa_valor;
                    }
                    else {
                        const valorTotalDaVenda = yield (0, databaseBC_1.default)("conquistas_robo")
                            .select("valor")
                            .where({ id: oportunidade.id })
                            .first();
                        valor = ((valorTotalDaVenda === null || valorTotalDaVenda === void 0 ? void 0 : valorTotalDaVenda.valor) || 0) * (parceiro.taxa_valor / 100);
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
                        "PrimeiroVencimento": dataMais3DiasFormatada + " 00:00:00", // 14 dias da data atual
                        "DataCompetencia": dataAtualFormatada + " 00:00:00", // mes atual
                        "QuantidadeParcelas": 1,
                        "Valor": valor // valor ja calculado
                    };
                    yield (0, delay_1.default)(60);
                    const despesaFornecedorCriada = yield financeiroService.criarDespesaFornecedor(dadosDespesaFornecedor);
                    // gravar id movimentacao parcela no bd
                    yield (0, database_1.default)("parceiros_cliente")
                        .where("id_lead", oportunidade.id)
                        .update({ id_parcela_bc: despesaFornecedorCriada.IdMovimentacaoFinanceiraParcela });
                    console.log(`Foi criada despesa fornecedor para oportunidade ${oportunidade.id}!`);
                }
                console.log(`Oportunidade ${oportunidade.id} atualizada com sucesso.`);
            }
            catch (error) {
                console.error(error);
            }
        }
        console.log('Finalizando Robo Criar Despesa Fornecedor');
        setTimeout(roboCriarDespesaFornecedor, 60 * 60 * 1000);
    });
}
exports.default = roboCriarDespesaFornecedor;
