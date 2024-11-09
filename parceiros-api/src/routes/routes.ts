import express from "express";
import { alterarUsuario, buscarUsuarios, criarUsuario, criarOuAlterarSenha, buscarUsuario } from "../controllers/usuario";
import { autenticar, autenticarGoogle, logout, token } from "../controllers/login";
import { verificarToken } from "../middlewares/authentication";
import { alterarParceiro, buscarParceiro, buscarParceiros, criarParceiro, criarSenhaParceiro } from "../controllers/parceiro";
import { buscarContratos, criarContrato, deletarContratos } from "../controllers/contrato";
import { buscarClientes, criarCliente, relatorioClientes, relatorioPagamentos } from "../controllers/cliente";

const router = express.Router();

// auth.ts
router.post("/auth-google", autenticarGoogle);
router.post("/auth", autenticar);
router.post("/token", token);
router.post("/logout", logout);

// usuario.ts
router.post("/usuario", verificarToken, criarUsuario);
router.post("/senha", verificarToken, criarOuAlterarSenha)
router.get("/usuario", verificarToken, buscarUsuarios);
router.get("/usuario/:id", verificarToken, buscarUsuario);
router.put("/usuario/:id", verificarToken, alterarUsuario);

// parceiro.ts
router.post("/parceiro", verificarToken, criarParceiro);
router.post("/senhaParceiro", verificarToken, criarSenhaParceiro)
router.get("/parceiro", verificarToken, buscarParceiros);
router.get("/parceiro/:id", verificarToken, buscarParceiro);
router.put("/parceiro/:id", verificarToken, alterarParceiro);

// contrato.ts
router.post("/contrato/:parceiro_id", verificarToken, criarContrato);
router.get("/contrato/:parceiro_id", verificarToken, buscarContratos);
router.delete("/contrato/:parceiro_id/:contrato_id", verificarToken, deletarContratos);

// cliente.ts
router.post("/cliente", verificarToken, criarCliente);
router.get("/cliente/:parceiro_id?", verificarToken, buscarClientes);
router.get("/relatorios/:parceiro_id?", verificarToken, relatorioClientes);
router.get("/relatorios-pagamentos", verificarToken, relatorioPagamentos);

export default router;