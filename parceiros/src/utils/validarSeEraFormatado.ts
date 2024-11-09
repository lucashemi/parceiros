const validarSeEraFormatado = (numero: string): boolean => {
    const regexCelular = /^\(\d{2}\) 9\d{4}-\d{3}(\d{2})?$/;
    const regexCPF = /^\d{3}\.\d{3}\.\d{3}-\d{1}(\d{2})?$/;
    const regexCNPJ = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{1}(\d{2})?$/;

    if (regexCelular.test(numero) || regexCPF.test(numero) || regexCNPJ.test(numero)) {
        return true;
    }

    return false;
}

export default validarSeEraFormatado;