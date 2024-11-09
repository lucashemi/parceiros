import BomControleClient from './bomControleClient';

export default class OportunidadeService extends BomControleClient {
  // Construtor que recebe o tokenId
  constructor(tokenId: string) {
    super(tokenId);
  }

  // Criar oportunidade
  async criarOportunidade(data: any) {
    const endpoint = '/Oportunidade/CriarOportunidade';
    try {
      // Usando o método 'post' herdado de BomControleClient
      const response = await this.post<any>({ endpoint, data } as any);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar oportunidade:', error);
      throw error;
    }
  }
}
