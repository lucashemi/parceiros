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
const Perfil_1 = __importDefault(require("../enums/Perfil"));
const Setor_1 = __importDefault(require("../enums/Setor"));
function stringMax(nome, maxLength) {
    return Yup.string().max(maxLength, `O campo ${nome} pode conter no máximo ${maxLength} caracteres`);
}
const usuarioSchema = Yup.object().shape({
    nome: stringMax("nome", 100).trim().required("O campo nome é obrigatório"),
    email: stringMax("e-mail", 100).email('Formato de e-mail inválido').required('O campo e-mail é obrigatório'),
    perfil: Yup.string().oneOf(Object.values(Perfil_1.default), "Perfil inválido").required("O campo perfil é obrigatório"),
    setor: Yup.string().oneOf(Object.values(Setor_1.default), "Setor inválido").required("O campo setor é obrigatório"),
    ativo: Yup.boolean().nullable(),
    token_bc: stringMax("token_bc", 250).required("O campo do token do bom controle é obrigatório"),
});
exports.default = usuarioSchema;
