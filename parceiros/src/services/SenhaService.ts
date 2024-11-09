import BaseApiService from './BaseApiService';

export default class SenhaService extends BaseApiService {
    constructor() {
        super();
    }

    public async alterarSenha(dados: any, ehUsuario: boolean) {
        const rota = ehUsuario ? 'senha' : 'senhaParceiro';
        return await this.post<any>(`/${rota}`, dados);
    }
}