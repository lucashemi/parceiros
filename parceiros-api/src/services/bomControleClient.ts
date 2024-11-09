import axios, { AxiosInstance } from 'axios';
import dotenv from 'dotenv';
import { RequestOptions } from 'https';
import delay from '../utils/delay';

dotenv.config();

class BomControleClient {
  private axiosInstance!: AxiosInstance;
  private tokenId: string; //process.env.TOKEN_ID!
  private baseUrl = 'https://apinewintegracao.bomcontrole.com.br/integracao';

  constructor(tokenId: string) {
    this.tokenId = tokenId;
    this.init();
  }

  // Inicializar Axios com config padrão
  private init() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `ApiKey ${this.tokenId}`
      },
    });
  }

  // Get generico
  async get<T>(options: RequestOptions): Promise<T> {
    const { endpoint } = options as any;
    try {
      const response = await this.axiosInstance.get<T>(endpoint);
      return response.data;
    } catch (error: any) {
      if (error?.response && error?.response?.status === 429) {
        console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
        await delay(60);
        return this.get(options);
      } else {
        throw error;
      }
    }
  }

  // Post generico
  async post<T>(options: RequestOptions): Promise<T> {
    const { endpoint, data } = options as any;
    try {
      const response = await this.axiosInstance.post<T>(endpoint, data);
      return response as any;
    } catch (error: any) {
      if (error?.response && error?.response?.status === 429) {
        console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
        await delay(60);
        return this.post(options);
      } else {
        throw error;
      }
    }
  }

  // Put generico
  async put<T>(options: RequestOptions): Promise<T> {
    const { endpoint, data } = options as any;
    try {
      const response = await this.axiosInstance.put<T>(endpoint, data);
      return response.data;
    } catch (error: any) {
      if (error?.response && error?.response?.status === 429) {
        console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
        await delay(60);
        return this.put(options);
      } else {
        throw error;
      }
    }
  }

  // Delete generico
  async delete<T>(options: RequestOptions): Promise<T> {
    const { endpoint } = options as any;
    try {
      const response = await this.axiosInstance.delete<T>(endpoint);
      return response.data;
    } catch (error: any) {
      if (error?.response && error?.response?.status === 429) {
        console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
        await delay(60);
        return this.delete(options);
      } else {
        throw error;
      }
    }
  }
}

export default BomControleClient;