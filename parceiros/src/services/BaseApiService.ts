import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import transformNullToEmptyString from '../utils/transformNullToEmptyString';
import CryptoJS from 'crypto-js';
import UserService from './UserService';

class BaseApiService {
  protected axiosInstance: AxiosInstance;
  protected refreshToken: string;
  private SECRET_KEY = import.meta.env.VITE_SECRET_KEY;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: "https://direcaosistemas.com.br/parceiros-api",
    });

    this.refreshToken = localStorage.getItem('refreshToken') || '';

    this.axiosInstance.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        if (error.response.status === 401 && !originalRequest._retry && originalRequest.url !== "/auth" && originalRequest.url !== "/auth-google") {
          originalRequest._retry = true;

          try {
            const response = await this.axiosInstance.post('/token', { token: this.refreshToken });

            if (response.status === 200) {
              const newAccessToken = response.data.accessToken;
              localStorage.setItem('accessToken', newAccessToken);

              const newUser = response.data.user;
              const userNotNull = transformNullToEmptyString(newUser);
              localStorage.setItem('user', this.encryptData(userNotNull));

              originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

              return this.axiosInstance(originalRequest);
            }
          } catch (error) {
            console.error('Erro ao obter um novo token JWT:', error);
            const userService = new UserService();
            userService.logout();
          }
        }

        return Promise.reject(error);
      }
    );
  }

  protected encryptData(data: any) {
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.SECRET_KEY).toString();
  }

  protected decryptData(ciphertext: any) {
    const bytes = CryptoJS.AES.decrypt(ciphertext, this.SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }

  private getAuthHeader() {
    const token = localStorage.getItem('accessToken');
    return { Authorization: `Bearer ${token}` };
  }

  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        ...this.getAuthHeader(),
      },
    });
  }

  protected async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...this.getAuthHeader(),
      },
    });
  }

  protected async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.put<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        ...this.getAuthHeader(),
      },
    });
  }

  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.delete<T>(url, {
      ...config,
      headers: {
        ...config?.headers,
        ...this.getAuthHeader(),
      },
    });
  }

}

export default BaseApiService;