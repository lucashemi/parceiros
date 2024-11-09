import BaseApiService from './BaseApiService';
import { AxiosResponse } from 'axios';
import Usuario from '../interfaces/Usuario';

export default class UsuarioService extends BaseApiService {
    constructor() {
        super();
    }

    public async buscarUsuarios(pagina: number = 1, query: string = '', perfil = '') {
        const response = await this.get<any>(`/usuario?pagina=${pagina}${query && "&query=" + query}${perfil && "&perfil=" + perfil}`);
        
        response.data.usuarios = response.data.usuarios.map((usuario: Usuario) => ({
            ...usuario,
            ativo: usuario.ativo === 1 ? true : false,
        }));
        
        return response;
    }

    public async criarUsuario(usuario: Usuario): Promise<AxiosResponse<any>> {
        return await this.post<any>("/usuario", usuario);
    }

    public async editarUsuario(usuario: Usuario) {
        const { id , ...usuarioSemId } = usuario;
        return await this.put<any>(`/usuario/${id}`, usuarioSemId);
    }
}