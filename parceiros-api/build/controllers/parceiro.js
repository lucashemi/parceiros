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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.criarSenhaParceiro = exports.alterarParceiro = exports.buscarParceiro = exports.buscarParceiros = exports.criarParceiro = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passwordSchema_js_1 = __importDefault(require("../schemas/passwordSchema.js"));
const buscarUserSchema_js_1 = __importDefault(require("../schemas/buscarUserSchema.js"));
const parceiroSchema_js_1 = __importDefault(require("../schemas/parceiroSchema.js"));
dotenv_1.default.config();
const criarParceiro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documento, razao_social, nome, ativo, tel1, tel2, email, consultor_id, endereco } = req.body;
        yield parceiroSchema_js_1.default.validate(req.body);
        const response = yield (0, database_js_1.default)("parceiros_endereco").insert(endereco);
        const endereco_id = response[0];
        const response_email = yield (0, database_js_1.default)("parceiros_email").insert({ email });
        const email_id = response_email[0];
        yield (0, database_js_1.default)("parceiros_parceiro").insert({ documento, razao_social, nome, email_id, ativo, tel1, tel2: tel2 || null, endereco_id, consultor_id });
        return res.status(201).send();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            const path = error.sqlMessage.includes("parceiros_parceiro.parceiro_unique_1") ? "documento" : "email";
            return res.status(400).json({ message: 'Parceiro já existe no sistema.', path: path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.criarParceiro = criarParceiro;
const buscarParceiros = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { pagina, query } = req.query;
        const registrosPorPagina = 8;
        yield buscarUserSchema_js_1.default.validate(req.query);
        let parceiros;
        let totalPaginas = 0;
        const queryBuilder = (0, database_js_1.default)("parceiros_parceiro as p")
            .select("p.id", "p.razao_social", "p.documento", "p.nome", "pe.email", "p.tel1", "p.tel2", "p.ativo", "p.app", "p.consultor_id", "p.taxa_tipo", "p.taxa_valor", "p.pix", "p.titular", "p.tipo_pix", database_js_1.default.raw("JSON_OBJECT('id', e.id, 'cep', e.cep, 'logradouro', e.logradouro, 'numero', e.numero, 'complemento', e.complemento, 'bairro', e.bairro, 'uf', e.uf, 'municipio', e.municipio) as endereco"))
            .join("parceiros_endereco as e", "p.endereco_id", "e.id")
            .join("parceiros_email as pe", "p.email_id", "pe.id");
        const countBuilder = (0, database_js_1.default)("parceiros_parceiro");
        if (query) {
            queryBuilder.where("razao_social", "like", `%${query}%`);
            countBuilder.where("razao_social", "like", `%${query}%`);
        }
        const { totalParceiros } = yield countBuilder
            .count('id as totalParceiros')
            .first();
        if (totalParceiros) {
            totalPaginas = Math.ceil(totalParceiros / registrosPorPagina);
        }
        if (pagina) {
            queryBuilder.limit(registrosPorPagina);
        }
        if (!query && pagina) {
            queryBuilder.offset((pagina - 1) * registrosPorPagina);
        }
        parceiros = yield queryBuilder;
        return res.status(200).json({ parceiros: parceiros, totalPaginas: totalPaginas });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.buscarParceiros = buscarParceiros;
const buscarParceiro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const queryBuilder = (0, database_js_1.default)("parceiros_parceiro as p")
            .select("p.id", "p.razao_social", "p.documento", "p.nome", "pe.email", "p.tel1", "p.tel2", "p.ativo", "p.app", "p.consultor_id", "p.taxa_tipo", "p.taxa_valor", "p.pix", "p.titular", "p.tipo_pix", database_js_1.default.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco"))
            .join("parceiros_endereco as en", "p.endereco_id", "en.id")
            .join("parceiros_email as pe", "p.email_id", "e.id")
            .where("p.id", "=", id);
        const user = yield queryBuilder;
        return res.status(200).json({ user: user });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.buscarParceiro = buscarParceiro;
const alterarParceiro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documento, razao_social, nome, ativo, app, taxa_tipo, taxa_valor, tel1, tel2, email, consultor_id, endereco, pix, titular, tipo_pix } = req.body;
        const id = req.params.id;
        yield parceiroSchema_js_1.default.validate(req.body);
        const { id: endereco_id } = endereco, novoEndereco = __rest(endereco, ["id"]);
        yield (0, database_js_1.default)("parceiros_endereco").where('id', '=', endereco_id).update(novoEndereco);
        const response = yield (0, database_js_1.default)("parceiros_parceiro as p").select("pe.id", "pe.email").where("p.id", "=", id).join("parceiros_email as pe", "p.email_id", "pe.id").first();
        if (response.email != email) {
            yield (0, database_js_1.default)("parceiros_email").where('id', '=', response.id).update({ email });
        }
        yield (0, database_js_1.default)("parceiros_parceiro")
            .where('id', '=', id)
            .update({
            documento,
            razao_social,
            nome, ativo,
            app,
            taxa_tipo,
            taxa_valor,
            tel1,
            tel2: tel2 || null,
            endereco_id,
            consultor_id,
            pix,
            titular,
            tipo_pix
        });
        return res.status(200).send();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Parceiro já existe no sistema.', path: "email" });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.alterarParceiro = alterarParceiro;
const criarSenhaParceiro = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senhaAtual, password } = req.body;
        const data = req.data;
        yield passwordSchema_js_1.default.validate(req.body);
        if (senhaAtual) {
            const parceiro = yield (0, database_js_1.default)("parceiros_parceiro").select("password").where("id", "=", data.id).first();
            const senhaCorreta = yield bcrypt_1.default.compare(senhaAtual, parceiro.password);
            if (!senhaCorreta) {
                return res.status(400).json({ message: "A senha atual informada é incorreta!", path: "senhaAtual" });
            }
        }
        const senhaHash = yield bcrypt_1.default.hash(password, 10);
        yield (0, database_js_1.default)("parceiros_parceiro").where("id", "=", data.id).update({
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
exports.criarSenhaParceiro = criarSenhaParceiro;
