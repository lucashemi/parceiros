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
exports.verificarToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_js_1 = __importDefault(require("../database/database.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default';
const verificarToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado!' });
    }
    try {
        const token = authorization.split(' ')[1];
        const data = jsonwebtoken_1.default.verify(token, ACCESS_TOKEN_SECRET);
        const tabela = data.tipo == 'usuario' ? "parceiros_usuario" : "parceiros_parceiro";
        const usuario = yield (0, database_js_1.default)(tabela).where("id", data.id);
        if (!usuario) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }
        req.data = data;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: 'Acesso expirado!' });
        }
        console.error(error);
        return res.status(500).json({ message: 'Erro interno no servidor!' });
    }
});
exports.verificarToken = verificarToken;
