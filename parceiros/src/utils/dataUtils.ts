export function formatarData(data: string) {
    const dataObj = new Date(data);
    
    const dia = dataObj.getUTCDate().toString().padStart(2, '0');
    const mes = (dataObj.getUTCMonth() + 1).toString().padStart(2, '0');
    const ano = dataObj.getUTCFullYear();

    return `${dia}/${mes}/${ano}`;
}

export function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() retorna o mês de 0 a 11
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}

export function dataAtual(): string {
    const currentDate = new Date();
    return formatDate(currentDate);
}

export function dataMesPassado(): string {
    const oneMonthAgoDate = new Date();
    oneMonthAgoDate.setDate(oneMonthAgoDate.getDate() - 30);
    return formatDate(oneMonthAgoDate);
}
