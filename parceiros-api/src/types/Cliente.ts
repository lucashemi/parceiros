import Endereco from "./Endereco";

type Cliente = {
    id?: number;
    razao_social: string;
    documento: string;
    nome: string;
    marca: string;
    logomarca?: File | null;
    email: string;
    tel1: string;
    tel2?: string;
    endereco_id: number;
    parceiro_id: number;
    data_indicacao: string;
    mensagem?: string;
    endereco: Endereco;
    status?: string;
    status_pagamento?: string,
    valor_participacao?: string,
    data_pagamento?: string,
    link_comprovante?: string
}

export default Cliente;