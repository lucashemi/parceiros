import knex from '../database/database.js';
import dotenv from "dotenv";
import Cliente from '../types/Cliente.js';
import ClienteService from '../services/clienteService.js';
import OportunidadeService from '../services/oportunidadeService.js';

dotenv.config();

const criarLeadBc = async (cliente: Cliente): Promise<any> => {
    try {
        const { nome, razao_social: nomeDaEmpresa, documento, tel1: telefone, mensagem, email, marca, endereco, parceiro_id } = cliente;

        const ehPj = documento.length === 14;

        const dadosDoCliente = {
            "Endereco": {
                "Logradouro": endereco.logradouro,
                "Numero": endereco.numero,
                "Complemento": endereco.complemento,
                "Cep": endereco.cep,
                "Cidade": endereco.municipio,
                "Uf": endereco.uf
            },
            "Contatos": [
                {
                    "Nome": nome,
                    "Email": email,
                    "Telefone": telefone,
                }
            ],
            ...(ehPj ? {
                "PessoaJuridica": {
                    "Documento": documento,
                    "NomeFantasia": nomeDaEmpresa,
                    "RazaoSocial": nomeDaEmpresa,
                }
            } : {
                "PessoaFisica": {
                    "Documento": documento,
                    "Nome": nome,
                }
            })
        }

        // criar o cliente
        const clienteService = new ClienteService(process.env.TOKEN_ID || ""); // token lucas
        await clienteService.criarCliente(dadosDoCliente);

        const { consultor_id, razao_social: nomeParceiro, documento: documentoParceiro } = await knex.select("consultor_id", "razao_social", "documento").from("parceiros_parceiro").where({ id: parceiro_id }).first();
        const { nomeConsultor, token_bc } = await knex.select("nome", "token_bc").from("parceiros_usuario").where({ id: consultor_id }).first();

        // criar oportunidade no bom controle
        const oportunidadeService = new OportunidadeService(token_bc || ""); // pegar token do consultor

        const dadosDaOportunidade = {
            "TituloOportunidade": nomeDaEmpresa,
            "ValorOportunidade": 0,
            "NomeLead": nomeDaEmpresa,
            "DocumentoLead": documento,
            "Campos": [
                {
                    "IdCampoFormulario": 1,
                    "Conteudo": nomeParceiro // nome do parceiro
                },
                {
                    "IdCampoFormulario": 2,
                    "Conteudo": documentoParceiro // documento do parceiro
                },
                {
                    "IdCampoFormulario": 52,
                    "Conteudo": nomeConsultor // nome do consultor
                }
            ]
        }

        const idDaOportunidade = await oportunidadeService.criarOportunidade(dadosDaOportunidade);

        console.log(idDaOportunidade)
        return idDaOportunidade;
    } catch (error: any) {
        console.error(error);
        throw error;
    }
}

export default criarLeadBc;