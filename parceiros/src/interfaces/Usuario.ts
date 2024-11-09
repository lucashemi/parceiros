interface Usuario {
    id?: number;
    nome: string;
    email: string;
    perfil: string;
    setor: string;
    ativo: boolean | number;
    token_bc?: string;
};

export default Usuario;