const desformatarBRL = (valor: any) => {
    return parseFloat(valor.replace(/[^\d,.]/g, '').replace(',', '.'))
};

export default desformatarBRL;