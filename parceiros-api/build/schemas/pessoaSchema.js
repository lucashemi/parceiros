"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Yup = __importStar(require("yup"));
const enderecoSchema_1 = __importDefault(require("./enderecoSchema"));
const validarCPF_1 = __importDefault(require("../utils/validarCPF"));
const validarCNPJ_1 = __importDefault(require("../utils/validarCNPJ"));
// Metodo para validar documento
Yup.addMethod(Yup.string, 'documento', function (message) {
    return this.test('documento', message, function (value) {
        const { path, createError } = this;
        return value.length === 11 ? (0, validarCPF_1.default)(value) : (0, validarCNPJ_1.default)(value) || createError({ path, message: message || 'CPF/CNPJ inválido' });
    });
});
function stringMax(nome, maxLength) {
    return Yup.string().max(maxLength, `O campo ${nome} pode conter no máximo ${maxLength} caracteres`);
}
const pessoaSchema = {
    documento: Yup.string().documento("CPF/CNPJ inválido").required("O campo documento CPF/CNPJ é obrigatório"),
    razao_social: stringMax("razão social", 100).required("O campo razão social é obrigatório"),
    nome: stringMax("nome", 100).required("O campo nome é obrigatório"),
    email: stringMax("e-mail", 100).email('Formato de e-mail inválido').required('O campo e-mail é obrigatório'),
    tel1: stringMax("telefone 1", 11).required("O campo telefone 1 é obrigatório"),
    tel2: stringMax("telefone 2", 11),
    endereco: enderecoSchema_1.default,
};
exports.default = pessoaSchema;
