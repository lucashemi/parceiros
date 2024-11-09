import * as Yup from 'yup';
import pessoaSchema from './pessoaSchema';

function stringMax(nome: string, maxLength: number) {
    return Yup.string().max(maxLength, `O campo ${nome} pode conter no máximo ${maxLength} caracteres`);
}

const clienteSchema = Yup.object().shape({
    ...pessoaSchema,
    parceiro_id: Yup.number().required("O campo consultor é obrigatório"),
    marca: stringMax("marca", 100).required("O campo marca é obrigatório"),
    logomarca: stringMax("logomarca", 100).optional(),
    mensagem: stringMax("mensagem", 100).optional()
});

export default clienteSchema;
