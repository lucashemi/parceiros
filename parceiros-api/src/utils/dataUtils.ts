export function formatarData(data: Date) {
    const dia = ('0' + data.getDate()).slice(-2);
    const mes = ('0' + (data.getMonth() + 1)).slice(-2);
    const ano = data.getFullYear();
    
    return `${dia}/${mes}/${ano}`;

}

function formatDate(date: Date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    
    return `${year}-${month}-${day}`;
}

export function dataAtual() {
    const dataAtual = new Date();
    return formatDate(dataAtual);
}