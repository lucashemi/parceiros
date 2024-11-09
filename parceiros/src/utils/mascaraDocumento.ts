const mascaraDocumento = (cnpjOuCPF: string) => {
    const cnpjOuCpfNumerico = cnpjOuCPF.replace(/\D/g, '');

    const ehCpf = cnpjOuCpfNumerico.length === 11;
    const ehCnpj = cnpjOuCpfNumerico.length === 14;

    if (ehCnpj) {
        return cnpjOuCpfNumerico.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    } else if (ehCpf) {
        return cnpjOuCpfNumerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    } else {
        return null
    }
}

export default mascaraDocumento;