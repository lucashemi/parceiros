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
const database_js_1 = __importDefault(require("../database/database.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const clienteService_js_1 = __importDefault(require("../services/clienteService.js"));
const oportunidadeService_js_1 = __importDefault(require("../services/oportunidadeService.js"));
dotenv_1.default.config();
const criarLeadBc = (cliente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, razao_social: nomeDaEmpresa, documento, tel1: telefone, mensagem, email, marca, endereco, parceiro_id } = cliente;
        const ehPj = documento.length === 14;
        const dadosDoCliente = Object.assign({ "Endereco": {
                "Logradouro": endereco.logradouro,
                "Numero": endereco.numero,
                "Complemento": endereco.complemento,
                "Cep": endereco.cep,
                "Cidade": endereco.municipio,
                "Uf": endereco.uf
            }, "Contatos": [
                {
                    "Nome": nome,
                    "Email": email,
                    "Telefone": telefone,
                }
            ] }, (ehPj ? {
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
        }));
        // criar o cliente
        const clienteService = new clienteService_js_1.default(process.env.TOKEN_ID || ""); // token lucas
        yield clienteService.criarCliente(dadosDoCliente);
        const { consultor_id, razao_social: nomeParceiro, documento: documentoParceiro } = yield database_js_1.default.select("consultor_id", "razao_social", "documento").from("parceiros_parceiro").where({ id: parceiro_id }).first();
        const { nomeConsultor, token_bc } = yield database_js_1.default.select("nome", "token_bc").from("parceiros_usuario").where({ id: consultor_id }).first();
        // criar oportunidade no bom controle
        const oportunidadeService = new oportunidadeService_js_1.default(token_bc || ""); // pegar token do consultor
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
        };
        const idDaOportunidade = yield oportunidadeService.criarOportunidade(dadosDaOportunidade);
        console.log(idDaOportunidade);
        return idDaOportunidade;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.default = criarLeadBc;
