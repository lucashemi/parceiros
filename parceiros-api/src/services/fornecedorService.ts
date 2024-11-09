import BomControleClient from './bomControleClient';

export default class FornecedorService extends BomControleClient {
  constructor(tokenId: string) {
    // Chama o construtor da classe pai (BomControleClient) para inicializar o axios com o token
    super(tokenId);
  }
  // Buscar fornecedor
  async buscarFornecedor(documento: string) {
    const endpoint = `/Fornecedor/Pesquisar?pesquisa=${documento}`;
    try {
      // Usando o método 'get' herdado de BomControleClient
      return await this.get<any>({ endpoint } as any);
    } catch (error: any) {
      const status = error.response.data.status;
      if (status === 404) {
        return null;
      }
      console.error('Erro ao buscar fornecedor:', error);
      throw error;
    }
  }

  // Criar fornecedor
  async criarFornecedor(data: any) {
    const endpoint = '/Fornecedor/Criar';
    try {
      // Usando o método 'post' herdado de BomControleClient
      const response = await this.post<any>({ endpoint, data } as any);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar fornecedor:', error);
      throw error;
    }
  }
}
