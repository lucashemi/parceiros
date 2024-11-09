import { jwtDecode } from 'jwt-decode';
import BaseApiService from './BaseApiService';
import transformNullToEmptyString from '../utils/transformNullToEmptyString';
import { User } from '../interfaces/User';

export default class UserService extends BaseApiService {
    constructor() {
        super();
    }

    public async login(url: string, dados: any) {
        const { data } = await this.post<any>(url, dados)

        if (data && data.accessToken && data.user) {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            const userNotNull = transformNullToEmptyString(data.user);
            localStorage.setItem('user', this.encryptData(userNotNull));
        }

        return data;
    }

    public getUser() {
        if (!this.authenticatedUser()) {
            return null;
        }

        const user = localStorage.getItem("user");

        return user ? this.decryptData(user) as User : null;
    }

    public async token() {
        const response = await this.post('/token', { token: this.refreshToken }) as any;

        const newAccessToken = response.data.accessToken;
        localStorage.setItem('accessToken', newAccessToken);

        const newUser = response.data.user;
        const userNotNull = transformNullToEmptyString(newUser);
        localStorage.setItem('user', this.encryptData(userNotNull));

        return response;
    }

    public ehUsuario() {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");

        if (!token || !user) {
            return false;
        }

        const { tipo } = jwtDecode(token) as any;

        return tipo == 'usuario' ? true : false;
    }

    public authenticatedUser() {
        const token = localStorage.getItem("accessToken");
        const user = localStorage.getItem("user");
        return token !== null && user !== null ? true : false;
    }

    public async logout() {
        const token = localStorage.getItem("refreshToken");
        await this.post<any>("/logout", { token });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
    }

}