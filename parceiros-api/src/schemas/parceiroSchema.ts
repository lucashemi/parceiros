import * as Yup from 'yup';
import TaxaTipo from '../enums/TaxaTipo';
import pessoaSchema from './pessoaSchema';

const parceiroSchema = Yup.object().shape({
    ...pessoaSchema,
    ativo: Yup.boolean().nullable(),
    app: Yup.boolean().nullable(),
    taxa_tipo: Yup.string().oneOf(Object.values(TaxaTipo), "O tipo de taxa é inválido"),
    taxa_valor: Yup.number(),
    consultor_id: Yup.number().required("O campo consultor é obrigatório"),
    pix: Yup.string().max(100, "O campo pix pode ter no máximo 100 caracteres"),
    titular: Yup.string().max(100, "O campo titular pode ter no máximo 100 caracteres"),
    tipo_pix: Yup.string().max(20, "O campo tipo do pix pode ter no máximo 20 caracteres"),
});

export default parceiroSchema;
