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
const database_1 = __importDefault(require("../database/database"));
const financeiroService_1 = __importDefault(require("../services/financeiroService"));
const delay_1 = __importDefault(require("../utils/delay"));
function roboAtualizarPagamento() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Iniciando Robo Atualizar Pagamento');
        const participacoesNaoPagas = yield (0, database_1.default)("parceiros_cliente")
            .select("*")
            .where({ status: "Venda Realizada" })
            .andWhere({ status_pagamento: "Não Pago" })
            .andWhere("id_parcela_bc", "!=", "null");
        for (const participacao of participacoesNaoPagas) {
            // verificar se participacao foi paga no bc
            const financeiroService = new financeiroService_1.default(process.env.TOKEN_ID || "");
            const data = yield financeiroService.buscarDespesaFornecedor(participacao.id_parcela_bc);
            if (data.DataQuitacao != null) {
                yield (0, database_1.default)("parceiros_cliente")
                    .where({ id: participacao.id })
                    .update({ status_pagamento: "Pago" });
            }
            yield (0, delay_1.default)(60);
        }
        console.log('Finalizando Robo Atualizar Pagamento');
        setTimeout(roboAtualizarPagamento, 60 * 60 * 1000);
    });
}
exports.default = roboAtualizarPagamento;
