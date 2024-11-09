const mascaraCep = (cep: string) => {
    const cepNumerico = cep.replace(/\D/g, '');

    if (cepNumerico.length !== 8) {
        return null;
    }

    return cepNumerico.replace(/(\d{5})(\d{3})/, '$1-$2');
}

export default mascaraCep;