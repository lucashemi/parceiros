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
const bitrix_1 = require("@2bad/bitrix");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bitrix24 = (0, bitrix_1.Bitrix)(`https://direcaomarcas.bitrix24.com.br/rest/9949/${process.env.BITRIX_KEY}`);
const criarLead = (cliente) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { razao_social: nome, documento, tel1: telefone, mensagem, email, marca, endereco } = cliente;
        const idUsuarioResponsavel = 7245; // Aut. Leads (Geral)
        const fasePipeline = "UC_N2HVB8"; // Fase "Inicio" do Pipeline de Leads
        const fonte = "UC_TUYDHK"; // Indicação - Parceiro
        const origem = "6381"; // Parceiros
        const ehPj = documento.length === 14; // 11 cpf - 14 cnpj
        const pessoaFisica = "625";
        const pessoaJuridica = "627";
        const formatarCPF = (cpf) => cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
        const formatarCNPJ = (cnpj) => cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
        const formatarCelular = (celular) => celular.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
        const formatarCEP = (cep) => cep.replace(/(\d{5})(\d{3})/, "$1-$2");
        const batchResponse = yield bitrix24.batch([
            {
                method: bitrix_1.Method.CRM_LEAD_ADD,
                params: {
                    fields: {
                        NAME: nome ? nome.trim() : null,
                        STATUS_ID: fasePipeline,
                        OPENED: "Y",
                        ASSIGNED_BY_ID: idUsuarioResponsavel,
                        PHONE: [{ "VALUE_TYPE": "WORK", "VALUE": `${telefone ? telefone.trim() : null}`, }],
                        COMMENTS: mensagem ? mensagem.trim() : null,
                        SOURCE_ID: fonte ? fonte.trim() : null,
                        EMAIL: [{ "VALUE_TYPE": "WORK", "VALUE": `${email ? email.trim() : null}`, }],
                        UF_CRM_1648652053: marca ? marca.trim() : undefined,
                        UF_CRM_1712946657368: "Brasil", // pais ? pais.trim() : undefined,
                        UF_CRM_1718990822: telefone ? formatarCelular(telefone) : undefined,
                        UF_CRM_1718973002: endereco.cep ? formatarCEP(endereco.cep) : undefined,
                        UF_CRM_1718972885: endereco.logradouro ? endereco.logradouro : undefined,
                        UF_CRM_1718972913: endereco.numero ? endereco.numero : undefined,
                        UF_CRM_1718973876: endereco.complemento ? endereco.complemento : undefined,
                        UF_CRM_1718972936: endereco.bairro ? endereco.bairro : undefined,
                        UF_CRM_1718972951: endereco.uf ? endereco.uf : undefined,
                        UF_CRM_1718972965: endereco.municipio ? endereco.municipio : undefined,
                        UF_CRM_1658249455024: origem ? origem : undefined,
                        UF_CRM_1665425735046: !ehPj ? nome : undefined, // Nome do Contato (##)
                        UF_CRM_1718990837: ehPj ? nome : undefined, // Nome da Empresa COMPANY_TITLE
                        UF_CRM_1649943296874: ehPj ? pessoaJuridica : pessoaFisica, // Tipo de Cliente
                        UF_CRM_1648652083: ehPj ? formatarCNPJ(documento) : undefined, // CNPJ
                        UF_CRM_1648652097: !ehPj ? formatarCPF(documento) : undefined, // CPF
                    },
                    params: {
                        REGISTER_SONET_EVENT: "Y",
                    }
                },
            },
        ]);
        const id_lead = batchResponse.result.result[0];
        return id_lead;
    }
    catch (error) {
        console.error(error);
        throw error;
    }
});
exports.default = criarLead;
