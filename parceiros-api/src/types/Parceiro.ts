type Parceiro = {
    id: number;
    razao_social: string;
    documento: string;
    nome: string;
    email: string;
    email_id?: number;
    tel1: string;
    tel2?: string;
    ativo: boolean;
    endereco_id: number;
    consultor_id: number;
    app: boolean;
    taxa_tipo: string;
    taxa_valor: number;
    password?: string;
    pix: string;
    titular: string;
    tipo_pix: string;
}

export default Parceiro;