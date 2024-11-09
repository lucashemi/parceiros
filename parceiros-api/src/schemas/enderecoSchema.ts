import * as Yup from 'yup';
import UF from '../enums/UF';

const enderecoSchema = Yup.object().shape({
    cep: Yup.string().length(8, "O campo cep deve ter 8 caracteres").required("O campo cep é obrigatório"),
    logradouro: Yup.string().max(100, "O campo logradouro deve ter no máximo 100 caracteres").required("O campo logradouro é obrigatório"),
    numero: Yup.string().max(4, "O campo numero deve ter no máximo 4 digitos").required("O campo número é obrigatório"),
    complemento: Yup.string().max(45, "O campo complemento deve ter no máximo 45 caracteres"),
    bairro: Yup.string().max(45, "O campo bairro deve ter no máximo 45 caracteres").required("O campo bairro é obrigatório"),
    municipio: Yup.string().max(45, "O campo municipio deve ter no máximo 45 caracteres").required("O campo municipio é obrigatório"),
    uf: Yup.string().oneOf(Object.values(UF), "O campo UF deve ter uma unidade federativa válida").required("O campo UF é obrigatório"),
});

export default enderecoSchema;