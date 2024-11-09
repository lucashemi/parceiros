const formatarBRL = (valor: any) => {
    const valorFormatado = valor.replace(/\D/g, '') / 100 as any;
    return parseFloat(valorFormatado).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    });
};

export default formatarBRL;