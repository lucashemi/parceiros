import * as Yup from 'yup';
import Perfil from '../enums/Perfil';
import Setor from '../enums/Setor';

function stringMax(nome: string, maxLength: number) {
    return Yup.string().max(maxLength, `O campo ${nome} pode conter no máximo ${maxLength} caracteres`);
}

const usuarioSchema = Yup.object().shape({
    nome: stringMax("nome", 100).trim().required("O campo nome é obrigatório"),
    email: stringMax("e-mail", 100).email('Formato de e-mail inválido').required('O campo e-mail é obrigatório'),
    perfil: Yup.string().oneOf(Object.values(Perfil), "Perfil inválido").required("O campo perfil é obrigatório"),
    setor: Yup.string().oneOf(Object.values(Setor), "Setor inválido").required("O campo setor é obrigatório"),
    ativo: Yup.boolean().nullable(),
    token_bc: stringMax("token_bc", 250).required("O campo do token do bom controle é obrigatório"),
});

export default usuarioSchema;
