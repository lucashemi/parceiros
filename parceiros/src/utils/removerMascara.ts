const removerMascara = (texto: string | undefined) => {
    return texto ? texto.replace(/[\(\).\/\s-]/g, '') : '';
}

export default removerMascara;