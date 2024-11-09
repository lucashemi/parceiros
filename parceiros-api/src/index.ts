import express from "express";
import routes from "./routes/routes";
import dotenv from "dotenv";
import cors from "cors";
import roboCriarDespesaFornecedor from "./robo/roboCriarDespesaFornecedor";
import roboAtualizarPagamento from "./robo/roboAtualizarPagamento";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors({
  credentials: true,
  origin: ['https://localhost:3005', 'https://parceiros.direcaosistemas.com.br']
}));
app.use(express.json());
app.use(routes);

app.listen(PORT, () =>
  console.log(`The server is up and running on PORT ${PORT} 🚀`)
);

// iniciando robos
roboCriarDespesaFornecedor();
roboAtualizarPagamento();