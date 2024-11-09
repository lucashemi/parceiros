import * as Yup from 'yup';

const criarContratoSchema = Yup.object().shape({
    nome: Yup.string().required('O campo nome é obrigatório'),
    url: Yup.string().required('O campo url é obrigatório'),
});

export default criarContratoSchema;
