import * as Yup from 'yup';
import Perfil from '../enums/Perfil';

const buscarUserSchema = Yup.object().shape({
    pagina: Yup.number()
        .required("Número da página é obrigatório")
        .integer('Número da página deve ser um inteiro')
        .positive('Número da página deve ser positivo'),
    query: Yup.string().max(100, "A busca deve conter no máximo 100 caracteres").optional(),
    perfil: Yup.string().optional().oneOf(Object.values(Perfil), "Perfil inválido")
});

export default buscarUserSchema;
