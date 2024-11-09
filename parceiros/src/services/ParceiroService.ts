import BaseApiService from './BaseApiService';
import { AxiosResponse } from 'axios';
import Parceiro from '../interfaces/Parceiro';
import formatarBRL from '../utils/formatarBRL';
import desformatarBRL from '../utils/desformatarBRL';
import removerMascara from '../utils/removerMascara';
import tipoDoPix from '../utils/pixUtils';
import parceiroPadrao from '../constants/parceiroPadrao';
import transformNullToEmptyString from '../utils/transformNullToEmptyString';

export default class ParceiroService extends BaseApiService {
    constructor() {
        super();
    }

    public async buscarParceiros(pagina: number = 1, query = '') {
        const response = await this.get<any>(`/parceiro?pagina=${pagina}${query && "&query=" + query}`);

        response.data.parceiros = response.data.parceiros.map((parceiro: Parceiro) => (transformNullToEmptyString({
            ...parceiroPadrao,
            ...parceiro,
            ativo: parceiro.ativo === 1 ? true : false,
            app: parceiro.app === 1 ? true : false,
            taxa_valor: parceiro.taxa_tipo == "Fixa" ? formatarBRL(parceiro.taxa_valor) : Number(parceiro.taxa_valor).toFixed(0) + "%",
        })));
        
        return response;
    }

    public async criarParceiro(parceiro: Parceiro): Promise<AxiosResponse<any>> {
        const parceiroFormatado = {
            ...parceiro,
            documento: removerMascara(parceiro.documento),
            tel1: removerMascara(parceiro.tel1),
            tel2: removerMascara(parceiro.tel2),
            endereco: {
                ...parceiro.endereco,
                cep: removerMascara(parceiro.endereco.cep),
            },
        }
        return await this.post<any>("/parceiro", parceiroFormatado);
    }

    public async editarParceiro(parceiro: Parceiro) {
        const pix = parceiro.pix;
        const pixSemMascara = pix.includes("(") ? removerMascara(pix) : pix;
        const tipo_pix = tipoDoPix(pixSemMascara);

        const { id, ...parceiroFormatado } = {
            ...parceiro,
            documento: removerMascara(parceiro.documento),
            tel1: removerMascara(parceiro.tel1),
            tel2: removerMascara(parceiro.tel2),
            taxa_valor: desformatarBRL(parceiro.taxa_valor),
            endereco: {
                ...parceiro.endereco,
                cep: removerMascara(parceiro.endereco.cep),
            },
            pix: pixSemMascara,
            tipo_pix: tipo_pix
        }
        return await this.put<any>(`/parceiro/${id}`, parceiroFormatado);
    }
}