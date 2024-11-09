import BomControleClient from './bomControleClient';

export default class FinanceiroService extends BomControleClient {
  constructor(tokenId: string) {
    // Chama o construtor da classe pai (BomControleClient) para inicializar o axios com o token
    super(tokenId);
  }

  // Criar despesa fornecedor
  async criarDespesaFornecedor(data: any) {
    const endpoint = '/Financeiro/CriarDespesaFornecedor';
    try {
      // Usando o método 'post' herdado de BomControleClient
      const response = await this.post<any>({ endpoint, data } as any);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar despesa fornecedor:', error);
      throw error;
    }
  }

  // Obter despesa fornecedor
  async buscarDespesaFornecedor(id: string) {
    const endpoint = `/Financeiro/Obter?idMovimentacaoFinanceiraParcela=${id}`;
    try {
      // Usando o método 'get' herdado de BomControleClient
      return await this.get<any>({ endpoint } as any);
    } catch (error: any) {
      const status = error.response.data.status;
      if (status === 404) {
        return null;
      }
      console.error('Erro ao buscar despesa fornecedor:', error);
      throw error;
    }
  }
}
