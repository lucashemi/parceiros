import Endereco from "./Endereco";

interface Parceiro {
    id?: number;
    razao_social: string;
    documento: string;
    nome: string;
    email: string;
    tel1: string;
    tel2: string;
    ativo: boolean | number;
    app: boolean | number;
    endereco: Endereco;
    consultor_id: number;
    taxa_tipo: string;
    taxa_valor: number | string;
    password?: string;
    pix: string;
    titular: string;
    tipo_pix: string;
};

export default Parceiro;