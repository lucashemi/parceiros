import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
    email: Yup.string().email('Formato de e-mail inválido').required('O campo e-mail é obrigatório'),
    password: Yup.string().required('O campo senha é obrigatório'),
});

export default loginSchema;
