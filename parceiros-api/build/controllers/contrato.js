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
exports.deletarContratos = exports.buscarContratos = exports.criarContrato = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const dataUtils_js_1 = require("../utils/dataUtils.js");
const criarContratoSchema_js_1 = __importDefault(require("../schemas/criarContratoSchema.js"));
const idContratoEParceiroSchema_js_1 = __importDefault(require("../schemas/idContratoEParceiroSchema.js"));
dotenv_1.default.config();
const criarContrato = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, url } = req.body;
        const parceiro_id = req.params.parceiro_id;
        yield criarContratoSchema_js_1.default.validate(req.body);
        yield idContratoEParceiroSchema_js_1.default.validate(req.params);
        const data = {
            data: (0, dataUtils_js_1.dataAtual)(),
            nome,
            url,
            parceiro_id
        };
        yield (0, database_js_1.default)("parceiros_contrato").insert(data);
        return res.status(201).send();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.criarContrato = criarContrato;
const buscarContratos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parceiro_id = req.params.parceiro_id;
        yield idContratoEParceiroSchema_js_1.default.validate(req.params);
        const contratos = yield (0, database_js_1.default)("parceiros_contrato as pc").select("pc.id", "pc.data", "pc.nome", "pc.url").where("parceiro_id", parceiro_id);
        return res.status(200).json({ contratos: contratos });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.buscarContratos = buscarContratos;
const deletarContratos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parceiro_id = req.params.parceiro_id;
        const contrato_id = req.params.contrato_id;
        yield idContratoEParceiroSchema_js_1.default.validate(req.params);
        yield (0, database_js_1.default)("parceiros_contrato as pc").where("parceiro_id", parceiro_id).where("id", contrato_id).del();
        return res.status(200).json();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.deletarContratos = deletarContratos;
