import BaseApiService from './BaseApiService';
import { AxiosResponse } from 'axios';
import removerMascara from '../utils/removerMascara';
import Cliente from '../interfaces/Cliente';
import driveUpload from '../utils/driveUpload';
import formatarLinkImagem from '../utils/formatarLinkImagem';

export default class ClienteService extends BaseApiService {
    constructor() {
        super();
    }

    public async buscarClientes(id: number | undefined, pagina: number = 1, status = '', status_pagamento = '', ordem = "DESC") {
        return await this.get<any>(`/cliente${id ? "/" + id : ""}?pagina=${pagina}${status && "&status=" + status}${status_pagamento && "&status_pagamento=" + status_pagamento}&ordem=${ordem}`);
    }

    public async criarCliente(cliente: Cliente): Promise<AxiosResponse<any>> {
        let linkLogomarca = "";
        if (cliente.logomarca) {
            const response = await driveUpload(cliente.logomarca, cliente.logomarca.name);
            linkLogomarca = formatarLinkImagem(response?.data);
        }

        const clienteFormatado: Cliente = {
            ...cliente,
            documento: removerMascara(cliente.documento),
            tel1: removerMascara(cliente.tel1),
            tel2: removerMascara(cliente.tel2),
            endereco: {
                ...cliente.endereco,
                cep: removerMascara(cliente.endereco.cep),
            },
            logomarca: linkLogomarca
        }
        return await this.post<any>("/cliente", clienteFormatado);
    }

    public async buscarRelatorios(id?: number | undefined, inicio?: string, fim?: string, status?: string, status_pagamento?: string): Promise<AxiosResponse<any>> {
        return await this.get<any>(`/relatorios${id ? "/" + id : ""}?inicio=${inicio}&fim=${fim}${status && "&status=" + status}${status_pagamento && "&status_pagamento=" + status_pagamento}`);
    }

    public async buscarRelatoriosPagamentos(status: string, status_pagamento: string): Promise<AxiosResponse<any>> {
        return await this.get<any>(`/relatorios-pagamentos?status=${status}&status_pagamento=${status_pagamento}`);
    }
}