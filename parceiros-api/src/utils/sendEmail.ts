import axios from "axios";

export default async function sendEmail(parceiro: any, oportunidade: any, valorTotalDaVenda: any, valorParticipacao: any, dataDeVencimento: any) {
    
    const valorTotalDaVendaFormatada = valorTotalDaVenda.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const valorParticipacaoFormatado = valorParticipacao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    const dataDeVencimentoFormatada = dataDeVencimento.toLocaleString('pt-BR', { dateStyle: 'short' });

    // formata os dados do parceiro
    const dadosParceiro = {
        nome_parceiro: parceiro.razao_social,
        nome_cliente: oportunidade.nome_lead,
        oportunidade_id: oportunidade.id,
        valor_total: valorTotalDaVendaFormatada,
        valor_participacao: valorParticipacaoFormatado,
        chave_pix: parceiro.pix,
        tipo_pix: parceiro.tipo_pix,
        titular_pix: parceiro.titular,
        data_de_vencimento: dataDeVencimentoFormatada,
    }

    try {
        const response = await axios.post('https://direcaomarcas.com.br/email/parceiros.php', dadosParceiro)
        
        // Verifica o status da resposta
        if (response.status !== 200) {
            throw new Error('Falha no envio dos dados');
        }

        console.log("Email enviado com sucesso!");

    } catch (error: any) {
        console.error("Ocorreu um erro ao enviar o e-mail: " + error.message);
    }
}