"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const roboCriarDespesaFornecedor_1 = __importDefault(require("./robo/roboCriarDespesaFornecedor"));
const roboAtualizarPagamento_1 = __importDefault(require("./robo/roboAtualizarPagamento"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3004;
app.use((0, cors_1.default)({
    credentials: true,
    origin: ['https://localhost:3005', 'https://parceiros.direcaosistemas.com.br']
}));
app.use(express_1.default.json());
app.use(routes_1.default);
app.listen(PORT, () => console.log(`The server is up and running on PORT ${PORT} 🚀`));
// iniciando robos
(0, roboCriarDespesaFornecedor_1.default)();
(0, roboAtualizarPagamento_1.default)();
