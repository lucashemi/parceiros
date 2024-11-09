import StatusIndicacao from "../enums/StatusIndicacao";
import Endereco from "./Endereco";

interface Cliente {
    id?: number;
    razao_social: string;
    documento: string;
    nome: string;
    marca: string;
    logomarca: any;
    email: string;
    tel1: string;
    tel2: string;
    endereco: Endereco;
    parceiro_id: number | undefined;
    data_indicacao: string;
    mensagem: string;
    status: StatusIndicacao;
    status_pagamento: string;
    valor_participacao: number;
    data_pagamento: string;
    link_comprovante: string;
};

export default Cliente;