import validarCNPJ from "./validarCNPJ";
import validarCPF from "./validarCPF";
import validarCelular from "./validarCelular";
import validarEmail from "./validarEmail";
import validarSeEraFormatado from "./validarSeEraFormatado";

const tipoDoPix = (value: any, mascara: boolean = false) => {
    const cemCaracteres = "****************************************************************************************************";

    if (validarCPF(value)) {
        // CPF (11 dígitos numéricos) e verificado q eh cpf
        let resposta = mascara ? "000.000.000-00" : "cpf";
        return resposta;
    } else if (validarCelular(value)) {
        // Se tiver 11 dígitos e nao for cpf, eh celular
        let resposta = mascara ? "(00) 90000-0000" : "celular";
        return resposta;
    } else if (validarCNPJ(value)) {
        // CNPJ (14 dígitos numéricos) e verificado q eh cnpj
        let resposta = mascara ? "00.000.000/0000-00" : "cnpj";
        return resposta;
    } else if (validarSeEraFormatado(value)) {
        let resposta = mascara ? "##############" : "eraFormatado";
        return resposta;
    } else if (validarEmail(value)) {
        // Tem @ eh e-mail 
        let resposta = mascara ? cemCaracteres : "email";
        return resposta;
    } else {
        // Aleatório max 100 caracteres
        let resposta = mascara ? cemCaracteres : "aleatorio";
        return resposta;
    }
}

export default tipoDoPix;