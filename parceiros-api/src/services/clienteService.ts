import BomControleClient from './bomControleClient';

export default class ClienteService extends BomControleClient {
  constructor(tokenId: string) {
    // Chama o construtor da classe pai (BomControleClient) para inicializar o axios com o token
    super(tokenId);
  }

  // Buscar cliente
  async buscarCliente(documento: string) {
    const endpoint = `/Cliente/Pesquisar?pesquisa=${documento}`;
    try {
      // Usando o método 'get' herdado de BomControleClient
      return await this.get<any>({ endpoint } as any);
    } catch (error: any) {
      const status = error.response.data.status;
      if (status === 404) {
        return null;
      }
      console.error('Erro ao buscar cliente:', error);
      throw error;
    }
  }

  // Criar cliente
  async criarCliente(data: any) {
    const endpoint = '/Cliente/Criar';
    try {
      // Usando o método 'post' herdado de BomControleClient
      const response = await this.post<any>({ endpoint, data } as any);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      throw error;
    }
  }
}
