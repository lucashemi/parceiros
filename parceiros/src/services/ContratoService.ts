import BaseApiService from './BaseApiService';
import { AxiosResponse } from 'axios';
import Contrato from '../interfaces/Contrato';

export default class ContratoService extends BaseApiService {
    constructor() {
        super();
    }

    public async buscarContratos(id: number): Promise<AxiosResponse<any>> {
        return await this.get<any>(`/contrato/${id}`);
    }

    public async criarContrato(id: number, contrato: Contrato): Promise<AxiosResponse<any>> {
        return await this.post<any>(`/contrato/${id}`, contrato);
    }

    public async deletarContrato(parceiroId: number, contratoId: number): Promise<AxiosResponse<any>> {
        return await this.delete<any>(`/contrato/${parceiroId}/${contratoId}`)
    }
}