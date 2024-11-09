const validarCPF = (cpf: string): boolean => {
    // Verifica se tem valor
    if (!cpf) {
        return false
    }

    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]+/g, '');

    // Verifica se o CPF tem 11 dígitos
    if (cpf.length !== 11) return false;

    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;

    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    let primeiroDigitoVerificador = resto >= 10 ? 0 : resto;

    // Verificação do primeiro dígito
    if (primeiroDigitoVerificador !== parseInt(cpf.charAt(9))) return false;

    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    let segundoDigitoVerificador = resto >= 10 ? 0 : resto;

    // Verificação do segundo dígito
    if (segundoDigitoVerificador !== parseInt(cpf.charAt(10))) return false;

    return true;
}

export default validarCPF;