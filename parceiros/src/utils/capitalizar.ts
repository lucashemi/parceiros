export default function capitalizar(palavra: string) {
    if (!palavra) return ''; // Verifica se a palavra é uma string válida
    return palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
}