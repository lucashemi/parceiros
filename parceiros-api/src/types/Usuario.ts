import Perfil from "../enums/Perfil";
import Setor from "../enums/Setor";

type Usuario = {
    id: number;
    nome: string;
    email: string;
    email_id?: number;
    password?: string;
    perfil: Perfil;
    setor: Setor;
    ativo: boolean;
    token_bc: string;
}

export default Usuario;