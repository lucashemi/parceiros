"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usuario_1 = require("../controllers/usuario");
const login_1 = require("../controllers/login");
const authentication_1 = require("../middlewares/authentication");
const parceiro_1 = require("../controllers/parceiro");
const contrato_1 = require("../controllers/contrato");
const cliente_1 = require("../controllers/cliente");
const router = express_1.default.Router();
// auth.ts
router.post("/auth-google", login_1.autenticarGoogle);
router.post("/auth", login_1.autenticar);
router.post("/token", login_1.token);
router.post("/logout", login_1.logout);
// usuario.ts
router.post("/usuario", authentication_1.verificarToken, usuario_1.criarUsuario);
router.post("/senha", authentication_1.verificarToken, usuario_1.criarOuAlterarSenha);
router.get("/usuario", authentication_1.verificarToken, usuario_1.buscarUsuarios);
router.get("/usuario/:id", authentication_1.verificarToken, usuario_1.buscarUsuario);
router.put("/usuario/:id", authentication_1.verificarToken, usuario_1.alterarUsuario);
// parceiro.ts
router.post("/parceiro", authentication_1.verificarToken, parceiro_1.criarParceiro);
router.post("/senhaParceiro", authentication_1.verificarToken, parceiro_1.criarSenhaParceiro);
router.get("/parceiro", authentication_1.verificarToken, parceiro_1.buscarParceiros);
router.get("/parceiro/:id", authentication_1.verificarToken, parceiro_1.buscarParceiro);
router.put("/parceiro/:id", authentication_1.verificarToken, parceiro_1.alterarParceiro);
// contrato.ts
router.post("/contrato/:parceiro_id", authentication_1.verificarToken, contrato_1.criarContrato);
router.get("/contrato/:parceiro_id", authentication_1.verificarToken, contrato_1.buscarContratos);
router.delete("/contrato/:parceiro_id/:contrato_id", authentication_1.verificarToken, contrato_1.deletarContratos);
// cliente.ts
router.post("/cliente", authentication_1.verificarToken, cliente_1.criarCliente);
router.get("/cliente/:parceiro_id?", authentication_1.verificarToken, cliente_1.buscarClientes);
router.get("/relatorios/:parceiro_id?", authentication_1.verificarToken, cliente_1.relatorioClientes);
router.get("/relatorios-pagamentos", authentication_1.verificarToken, cliente_1.relatorioPagamentos);
exports.default = router;
