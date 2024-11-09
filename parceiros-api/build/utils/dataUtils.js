"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataAtual = exports.formatarData = void 0;
function formatarData(data) {
    const dia = ('0' + data.getDate()).slice(-2);
    const mes = ('0' + (data.getMonth() + 1)).slice(-2);
    const ano = data.getFullYear();
    return `${dia}/${mes}/${ano}`;
}
exports.formatarData = formatarData;
function formatDate(date) {
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}
function dataAtual() {
    const dataAtual = new Date();
    return formatDate(dataAtual);
}
exports.dataAtual = dataAtual;
