import * as Yup from 'yup';

const loginGoogleSchema = Yup.object().shape({
    email: Yup.string().email('Formato de e-mail inválido').required('O campo e-mail é obrigatório'),
});

export default loginGoogleSchema;
