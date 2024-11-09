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
const TaxaTipo_1 = __importDefault(require("../enums/TaxaTipo"));
const pessoaSchema_1 = __importDefault(require("./pessoaSchema"));
const parceiroSchema = Yup.object().shape(Object.assign(Object.assign({}, pessoaSchema_1.default), { ativo: Yup.boolean().nullable(), app: Yup.boolean().nullable(), taxa_tipo: Yup.string().oneOf(Object.values(TaxaTipo_1.default), "O tipo de taxa é inválido"), taxa_valor: Yup.number(), consultor_id: Yup.number().required("O campo consultor é obrigatório"), pix: Yup.string().max(100, "O campo pix pode ter no máximo 100 caracteres"), titular: Yup.string().max(100, "O campo titular pode ter no máximo 100 caracteres"), tipo_pix: Yup.string().max(20, "O campo tipo do pix pode ter no máximo 20 caracteres") }));
exports.default = parceiroSchema;
