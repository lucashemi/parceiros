import Parceiro from "../interfaces/Parceiro";
import enderecoPadrao from "./enderecoPadrao";

const parceiroPadrao: Parceiro = {
    id: 0,
    razao_social: '',
    documento: '',
    nome: '',
    email: '',
    tel1: '',
    tel2: '',
    ativo: 1,
    app: 1,
    endereco: { ...enderecoPadrao },
    consultor_id: 0,
    taxa_tipo: "Fixa",
    taxa_valor: 100.00,
    pix: '',
    titular: '',
    tipo_pix: ''
}

export default parceiroPadrao;