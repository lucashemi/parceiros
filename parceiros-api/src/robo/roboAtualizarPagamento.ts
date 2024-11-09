import db from "../database/database";
import FinanceiroService from "../services/financeiroService";
import delay from "../utils/delay";

export default async function roboAtualizarPagamento() {
    console.log('Iniciando Robo Atualizar Pagamento');

    const participacoesNaoPagas = await db("parceiros_cliente")
        .select("*")
        .where({ status: "Venda Realizada" })
        .andWhere({ status_pagamento: "Não Pago" })
        .andWhere("id_parcela_bc", "!=", "null");

    for (const participacao of participacoesNaoPagas) {
        // verificar se participacao foi paga no bc
        const financeiroService = new FinanceiroService(process.env.TOKEN_ID || "");

        const data = await financeiroService.buscarDespesaFornecedor(participacao.id_parcela_bc);

        if (data.DataQuitacao != null) {
            await db("parceiros_cliente")
                .where({ id: participacao.id })
                .update({
                    status_pagamento: "Pago",
                    data_pagamento: new Date().toLocaleString('pt-BR', { dateStyle: 'short' }),
                });
        }

        await delay(60);
    }

    console.log('Finalizando Robo Atualizar Pagamento');

    setTimeout(roboAtualizarPagamento, 60 * 60 * 1000);
}