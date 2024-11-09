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
exports.criarOuAlterarSenha = exports.criarUsuario = exports.buscarUsuarios = exports.alterarUsuario = exports.buscarUsuario = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const usuarioSchema_js_1 = __importDefault(require("../schemas/usuarioSchema.js"));
const passwordSchema_js_1 = __importDefault(require("../schemas/passwordSchema.js"));
const buscarUserSchema_js_1 = __importDefault(require("../schemas/buscarUserSchema.js"));
dotenv_1.default.config();
const criarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, email, perfil, setor, token_bc } = req.body;
        yield usuarioSchema_js_1.default.validate(req.body);
        const response = yield (0, database_js_1.default)("parceiros_email").insert({ email });
        const email_id = response[0];
        yield (0, database_js_1.default)("parceiros_usuario").insert({ nome, email_id, perfil, setor, token_bc });
        return res.status(201).json();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        else if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Usúario ou parceiro já existe no sistema.', path: "email" });
        }
        else {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
        }
    }
});
exports.criarUsuario = criarUsuario;
const criarOuAlterarSenha = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { password } = req.body;
        const data = req.data;
        yield passwordSchema_js_1.default.validate(req.body);
        const senhaHash = yield bcrypt_1.default.hash(password, 10);
        yield (0, database_js_1.default)("parceiros_usuario").where("id", "=", data.id).update({
            password: senhaHash
        });
        return res.status(200).send();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.criarOuAlterarSenha = criarOuAlterarSenha;
const buscarUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pagina, query, perfil } = req.query;
        const registrosPorPagina = 8;
        yield buscarUserSchema_js_1.default.validate(req.query);
        let usuarios;
        let totalPaginas = 0;
        const queryBuilder = (0, database_js_1.default)("parceiros_usuario as u")
            .select("u.id", "u.nome", "e.email", "u.perfil", "u.setor", "u.ativo", "u.token_bc")
            .join("parceiros_email as e", "u.email_id", "e.id");
        const countBuilder = (0, database_js_1.default)("parceiros_usuario");
        if (query) {
            queryBuilder.where("nome", "like", `%${query}%`);
            countBuilder.where("nome", "like", `%${query}%`);
        }
        if (perfil) {
            queryBuilder.where("perfil", "=", perfil);
            countBuilder.where("perfil", "=", perfil);
        }
        const { totalUsuarios } = yield countBuilder
            .count('id as totalUsuarios')
            .first();
        if (totalUsuarios) {
            totalPaginas = Math.ceil(totalUsuarios / registrosPorPagina);
        }
        if (pagina) {
            queryBuilder.limit(registrosPorPagina);
        }
        if (!query && pagina) {
            queryBuilder.offset((pagina - 1) * registrosPorPagina);
        }
        usuarios = yield queryBuilder;
        return res.status(200).json({ usuarios: usuarios, totalPaginas: totalPaginas });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.buscarUsuarios = buscarUsuarios;
const buscarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const queryBuilder = (0, database_js_1.default)("parceiros_usuario as u")
            .select("u.nome", "e.email", "u.perfil", "u.setor", "u.ativo", "u.token_bc")
            .join("parceiros_email as e", "u.email_id", "e.id")
            .where("u.id", "=", id);
        const user = yield queryBuilder;
        return res.status(200).json({ user: user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.buscarUsuario = buscarUsuario;
const alterarUsuario = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, email, perfil, setor, ativo, token_bc } = req.body;
        const id = req.params.id;
        yield usuarioSchema_js_1.default.validate(req.body);
        if (!id) {
            return res.status(400).json({ message: "O campo id é obrigatório" });
        }
        const response = yield (0, database_js_1.default)("parceiros_usuario as u").select("pe.id", "pe.email").where("u.id", "=", id).join("parceiros_email as pe", "u.email_id", "pe.id").first();
        if (response.email != email) {
            yield (0, database_js_1.default)("parceiros_email").where('id', '=', response.id).update({ email });
        }
        yield (0, database_js_1.default)("parceiros_usuario").where('id', '=', id).update({ id, nome, perfil, setor, ativo, token_bc });
        return res.status(200).send();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        else if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Usúario já existe no sistema.', path: "email" });
        }
        else {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
        }
    }
});
exports.alterarUsuario = alterarUsuario;
