const mascaraTelefone = (telefone: string) => {
  // Remove todos os caracteres não numéricos
  const telefoneNumerico = telefone.replace(/\D/g, '');

  // Verifica se tem nono digito (11 dígitos) ou nao (10 dígitos)
  const temNonoDigito = telefoneNumerico.length === 11;
  const naoTemNonoDigito = telefoneNumerico.length === 10;

  if (temNonoDigito) {
    return telefoneNumerico.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  } else if (naoTemNonoDigito) {
    return telefoneNumerico.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    return null;
  }
}

export default mascaraTelefone;