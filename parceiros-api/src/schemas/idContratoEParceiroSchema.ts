import * as Yup from 'yup';

const idContratoEParceiroSchema = Yup.object().shape({
    parceiro_id: Yup.number().required("O campo id é obrigatório"),
    contrato_id: Yup.number().optional(),
});

export default idContratoEParceiroSchema;
