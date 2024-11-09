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
exports.logout = exports.token = exports.autenticarGoogle = exports.autenticar = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const loginSchema_js_1 = __importDefault(require("../schemas/loginSchema.js"));
const loginGoogleSchema_js_1 = __importDefault(require("../schemas/loginGoogleSchema.js"));
dotenv_1.default.config();
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default';
const accessTokenExp = '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default';
const refreshTokenExp = '7 days';
const autenticarGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        yield loginGoogleSchema_js_1.default.validate(req.body);
        let user = yield (0, database_js_1.default)("parceiros_usuario as u")
            .join("parceiros_email as e", "u.email_id", "=", "e.id")
            .select("u.*", "e.email")
            .where("e.email", email)
            .first();
        let tipo = "usuario";
        if (!user) {
            user = yield (0, database_js_1.default)("parceiros_parceiro as p")
                .join("parceiros_email as e", "p.email_id", "=", "e.id")
                .join("parceiros_endereco as en", "p.endereco_id", "=", "en.id")
                .select("p.*", "e.email", database_js_1.default.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco"))
                .where("e.email", email)
                .first();
            tipo = "parceiro";
        }
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }
        if (user && !user.ativo) {
            return res.status(401).json({ message: "Usuário desativado!" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, tipo: tipo }, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExp });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, tipo: tipo }, REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExp });
        yield (0, database_js_1.default)("parceiros_token").insert({ token: refreshToken, user_id: user.id, user_type: tipo });
        const primeiroAcesso = user.password ? false : true;
        const { password } = user, usuarioSemSenha = __rest(user, ["password"]);
        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, user: usuarioSemSenha, primeiroAcesso: primeiroAcesso });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.autenticarGoogle = autenticarGoogle;
const autenticar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        yield loginSchema_js_1.default.validate(req.body);
        let user = yield (0, database_js_1.default)("parceiros_usuario as u")
            .join("parceiros_email as e", "u.email_id", "=", "e.id")
            .select("u.*", "e.email")
            .where("e.email", email)
            .andWhere("u.ativo", 1)
            .andWhere("u.perfil", "!=", "Consultor")
            .first();
        let tipo = "usuario";
        if (!user) {
            user = yield (0, database_js_1.default)("parceiros_parceiro as p")
                .join("parceiros_email as e", "p.email_id", "=", "e.id")
                .join("parceiros_endereco as en", "p.endereco_id", "=", "en.id")
                .select("p.*", "e.email", database_js_1.default.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco"))
                .where("e.email", email)
                .andWhere("p.ativo", 1)
                .first();
            tipo = "parceiro";
        }
        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado!", path: "email" });
        }
        if (user && !user.ativo) {
            return res.status(401).json({ message: "Usuário desativado!", path: "email" });
        }
        const { password: dbPassword } = user, usuarioSemSenha = __rest(user, ["password"]);
        if (!dbPassword) {
            return res.status(401).json({ message: "Usuário não possui uma senha cadastrada!", path: "password" });
        }
        const senhaCorreta = yield bcrypt_1.default.compare(password, dbPassword);
        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha incorreta!", path: "password" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user.id, tipo: tipo }, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExp });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user.id, tipo: tipo }, REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExp });
        yield (0, database_js_1.default)("parceiros_token").insert({ token: refreshToken, user_id: user.id, user_type: tipo });
        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, user: usuarioSemSenha });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.autenticar = autenticar;
const token = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body;
        if (!token)
            return res.sendStatus(401);
        const storedToken = yield (0, database_js_1.default)('parceiros_token').where({ token }).first();
        if (!storedToken)
            return res.sendStatus(403);
        jsonwebtoken_1.default.verify(token, REFRESH_TOKEN_SECRET, (err, user) => __awaiter(void 0, void 0, void 0, function* () {
            if (err)
                return res.sendStatus(403);
            const accessToken = jsonwebtoken_1.default.sign({ id: user.id, tipo: user.tipo }, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExp });
            let usuario;
            if (user.tipo == 'usuario') {
                usuario = yield (0, database_js_1.default)("parceiros_usuario as u")
                    .join("parceiros_email as e", "u.email_id", "=", "e.id")
                    .select("u.*", "e.email")
                    .where("u.id", user.id)
                    .first();
            }
            else {
                usuario = yield (0, database_js_1.default)("parceiros_parceiro as p")
                    .join("parceiros_email as e", "p.email_id", "=", "e.id")
                    .join("parceiros_endereco as en", "p.endereco_id", "=", "en.id")
                    .select("p.*", "e.email", database_js_1.default.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco"))
                    .where("p.id", user.id)
                    .first();
            }
            res.status(200).json({ accessToken, user: usuario });
        }));
    }
    catch (error) {
    }
});
exports.token = token;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.body;
    yield (0, database_js_1.default)('parceiros_token').where({ token }).del();
    res.sendStatus(204);
});
exports.logout = logout;
