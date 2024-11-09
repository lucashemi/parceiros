import StatusIndicacao from "../enums/StatusIndicacao";
import StatusPagamento from "../enums/StatusPagamento";
import Cliente from "../interfaces/Cliente";
import enderecoPadrao from "./enderecoPadrao";

const clientePadrao: Cliente = {
    id: 0,
    razao_social: '',
    documento: '',
    nome: '',
    marca: '',
    logomarca: null,
    email: '',
    tel1: '',
    tel2: '',
    endereco: { ...enderecoPadrao },
    parceiro_id: 0,
    data_indicacao: '',
    mensagem: '',
    status: StatusIndicacao.EmNegociacao,
    status_pagamento: StatusPagamento.NaoPago,
    valor_participacao: 0,
    data_pagamento: '',
    link_comprovante: '',
}

export default clientePadrao;