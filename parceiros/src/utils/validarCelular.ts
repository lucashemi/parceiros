const validarCelular = (numero: string): boolean => {
    // Verifica se tem valor
    if (!numero) {
        return false
    }
    
    return (numero.length === 11 && numero.match(/^\d{2}9\d{8}$/)) ? true : false;
}

export default validarCelular;