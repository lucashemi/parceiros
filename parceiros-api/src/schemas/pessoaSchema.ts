import * as Yup from 'yup';
import enderecoSchema from './enderecoSchema';
import { StringSchema } from 'yup';
import validarCPF from '../utils/validarCPF';
import validarCNPJ from '../utils/validarCNPJ';

declare module 'yup' {
    interface StringSchema {
        documento(message?: string): StringSchema;
    }
}

// Metodo para validar documento
Yup.addMethod(Yup.string, 'documento', function (message) {
    return this.test('documento', message, function (value: any) {
        const { path, createError } = this;
        return value.length === 11 ? validarCPF(value) : validarCNPJ(value) || createError({ path, message: message || 'CPF/CNPJ inválido' });
    });
});

function stringMax(nome: string, maxLength: number) {
    return Yup.string().max(maxLength, `O campo ${nome} pode conter no máximo ${maxLength} caracteres`);
}

const pessoaSchema = {
    documento: Yup.string().documento("CPF/CNPJ inválido").required("O campo documento CPF/CNPJ é obrigatório"),
    razao_social: stringMax("razão social", 100).required("O campo razão social é obrigatório"),
    nome: stringMax("nome", 100).required("O campo nome é obrigatório"),
    email: stringMax("e-mail", 100).email('Formato de e-mail inválido').required('O campo e-mail é obrigatório'),
    tel1: stringMax("telefone 1", 11).required("O campo telefone 1 é obrigatório"),
    tel2: stringMax("telefone 2", 11),
    endereco: enderecoSchema,
}

export default pessoaSchema;