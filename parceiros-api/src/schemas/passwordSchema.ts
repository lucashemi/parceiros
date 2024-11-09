import * as Yup from 'yup';

const passwordSchema = Yup.object().shape({
    senhaAtual: Yup.string(),
    password: Yup.string()
        .required('O campo senha é obrigatório')
        .matches(/[a-z]/, 'A senha deve conter pelo menos uma letra minúscula')
        .matches(/[A-Z]/, 'A senha deve conter pelo menos uma letra maiúscula')
        .matches(/[0-9]/, 'A senha deve conter pelo menos um dígito')
        .matches(/[!@#$%^&*(),.?":{}|<>]/, 'A senha deve conter pelo menos um caractere especial')
        .min(8, 'A senha deve ter pelo menos 8 caracteres')
        .max(100, 'A senha deve ter no máximo 100 caracteres')
});

export default passwordSchema;
