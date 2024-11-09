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
exports.relatorioPagamentos = exports.relatorioClientes = exports.buscarClientes = exports.criarCliente = void 0;
const database_js_1 = __importDefault(require("../database/database.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const dataUtils_js_1 = require("../utils/dataUtils.js");
const clienteSchema_js_1 = __importDefault(require("../schemas/clienteSchema.js"));
const buscarUserSchema_js_1 = __importDefault(require("../schemas/buscarUserSchema.js"));
const criarLeadBc_js_1 = __importDefault(require("../utils/criarLeadBc.js"));
dotenv_1.default.config();
const criarCliente = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { documento, razao_social, nome, email, tel1, tel2, parceiro_id, endereco, marca, logomarca: link_logomarca, mensagem } = req.body;
        yield clienteSchema_js_1.default.validate(req.body);
        const response = yield (0, database_js_1.default)("parceiros_endereco").insert(endereco);
        const endereco_id = response[0];
        const result = yield (0, database_js_1.default)("parceiros_cliente").insert({
            documento,
            razao_social,
            nome,
            email,
            tel1,
            tel2: tel2 || null,
            endereco_id,
            parceiro_id,
            marca,
            link_logomarca: link_logomarca || null,
            mensagem: mensagem || null,
            data_indicacao: (0, dataUtils_js_1.dataAtual)()
        });
        const insertedId = result[0];
        // cria lead no bitrix
        const idDaOportunidade = yield (0, criarLeadBc_js_1.default)(req.body);
        // gravar ida da op q foi criada no bc
        yield (0, database_js_1.default)("parceiros_cliente").where('id', insertedId).update({ id_lead: idDaOportunidade });
        return res.status(201).send();
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Cliente já existe no sistema.', path: "documento" });
        }
        else {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
        }
    }
});
exports.criarCliente = criarCliente;
const buscarClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parceiro_id = req.params.parceiro_id;
        const { pagina, status, status_pagamento, ordem } = req.query;
        const registrosPorPagina = 8;
        yield buscarUserSchema_js_1.default.validate(req.query);
        let clientes;
        let totalPaginas = 0;
        const queryBuilder = (0, database_js_1.default)("parceiros_cliente as c")
            .select("c.id", "c.razao_social", "c.documento", "c.nome", "c.marca", "c.link_logomarca", "c.email", "c.tel1", "c.tel2", "c.parceiro_id", "c.data_indicacao", "c.mensagem", "c.status", "c.status_pagamento", "c.valor_participacao", "c.data_pagamento", "c.link_comprovante", "p.razao_social as parceiro_razao_social", "u.nome as consultor_nome", database_js_1.default.raw("JSON_OBJECT('id', e.id, 'cep', e.cep, 'logradouro', e.logradouro, 'numero', e.numero, 'complemento', e.complemento, 'bairro', e.bairro, 'uf', e.uf, 'municipio', e.municipio) as endereco"))
            .join("parceiros_endereco as e", "c.endereco_id", "e.id")
            .join("parceiros_parceiro as p", "c.parceiro_id", "p.id")
            .join("parceiros_usuario as u", "p.consultor_id", "u.id");
        const countBuilder = (0, database_js_1.default)("parceiros_cliente");
        if (parceiro_id) {
            queryBuilder.where("parceiro_id", "=", parceiro_id);
            countBuilder.where("parceiro_id", "=", parceiro_id);
        }
        if (status) {
            queryBuilder.where("status", "like", `%${status}%`);
            countBuilder.where("status", "like", `%${status}%`);
        }
        if (status_pagamento) {
            queryBuilder.where("status_pagamento", "like", `${status_pagamento}`);
            countBuilder.where("status_pagamento", "like", `${status_pagamento}`);
        }
        queryBuilder.orderBy('c.data_indicacao', ordem);
        queryBuilder.orderBy('id', ordem);
        const { totalClientes } = yield countBuilder
            .count('id as totalClientes')
            .first();
        if (totalClientes) {
            totalPaginas = Math.ceil(totalClientes / registrosPorPagina);
        }
        if (pagina) {
            queryBuilder.limit(registrosPorPagina);
        }
        if (!status && pagina) {
            queryBuilder.offset((pagina - 1) * registrosPorPagina);
        }
        clientes = yield queryBuilder;
        return res.status(200).json({ clientes: clientes, totalPaginas: totalPaginas });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.buscarClientes = buscarClientes;
const relatorioClientes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parceiro_id = req.params.parceiro_id;
        const { inicio = (0, dataUtils_js_1.dataAtual)(), fim = (0, dataUtils_js_1.dataAtual)(), status, status_pagamento } = req.query;
        const queryBuilder = (0, database_js_1.default)("direcao.parceiros_cliente as pc")
            .select("pc.data_indicacao as name", database_js_1.default.raw("COUNT(pc.id) as total_indicacoes"))
            .whereBetween("pc.data_indicacao", [inicio, fim]);
        if (parceiro_id) {
            queryBuilder.where("pc.parceiro_id", "=", parceiro_id);
        }
        if (status) {
            queryBuilder.where("pc.status", "LIKE", `%${status}%`);
        }
        if (status_pagamento) {
            queryBuilder.where("pc.status_pagamento", "LIKE", `${status_pagamento}`);
        }
        queryBuilder
            .groupBy("pc.data_indicacao")
            .orderBy("pc.data_indicacao");
        const clientes = yield queryBuilder;
        const clientesFormatados = clientes.map(row => (Object.assign(Object.assign({}, row), { name: (0, dataUtils_js_1.formatarData)(new Date(row.name)) })));
        return res.status(200).json({ clientes: clientesFormatados });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.relatorioClientes = relatorioClientes;
const relatorioPagamentos = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, status_pagamento } = req.query;
        const queryBuilder = (0, database_js_1.default)("direcao.parceiros_cliente as pc")
            .select("p.razao_social as name", database_js_1.default.raw("COUNT(pc.id) as total_indicacoes"))
            .join("direcao.parceiros_parceiro as p", "pc.parceiro_id", "p.id");
        if (status) {
            queryBuilder.where("pc.status", "LIKE", `%${status}%`);
        }
        if (status_pagamento) {
            queryBuilder.where("pc.status_pagamento", "LIKE", `${status_pagamento}`);
        }
        queryBuilder
            .groupBy("p.razao_social")
            .orderBy("total_indicacoes", "desc");
        const clientes = yield queryBuilder;
        return res.status(200).json({ clientes });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
});
exports.relatorioPagamentos = relatorioPagamentos;
