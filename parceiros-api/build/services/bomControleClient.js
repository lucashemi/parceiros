"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const delay_1 = __importDefault(require("../utils/delay"));
dotenv_1.default.config();
class BomControleClient {
    constructor(tokenId) {
        this.baseUrl = 'https://apinewintegracao.bomcontrole.com.br/integracao';
        this.tokenId = tokenId;
        this.init();
    }
    // Inicializar Axios com config padrão
    init() {
        this.axiosInstance = axios_1.default.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `ApiKey ${this.tokenId}`
            },
        });
    }
    // Get generico
    get(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { endpoint } = options;
            try {
                const response = yield this.axiosInstance.get(endpoint);
                return response.data;
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.response) && ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                    console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
                    yield (0, delay_1.default)(60);
                    return this.get(options);
                }
                else {
                    throw error;
                }
            }
        });
    }
    // Post generico
    post(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { endpoint, data } = options;
            try {
                const response = yield this.axiosInstance.post(endpoint, data);
                return response;
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.response) && ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                    console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
                    yield (0, delay_1.default)(60);
                    return this.post(options);
                }
                else {
                    throw error;
                }
            }
        });
    }
    // Put generico
    put(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { endpoint, data } = options;
            try {
                const response = yield this.axiosInstance.put(endpoint, data);
                return response.data;
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.response) && ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                    console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
                    yield (0, delay_1.default)(60);
                    return this.put(options);
                }
                else {
                    throw error;
                }
            }
        });
    }
    // Delete generico
    delete(options) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const { endpoint } = options;
            try {
                const response = yield this.axiosInstance.delete(endpoint);
                return response.data;
            }
            catch (error) {
                if ((error === null || error === void 0 ? void 0 : error.response) && ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.status) === 429) {
                    console.log('Erro 429: Limite de solicitações excedido. Aguardando 1 minuto para tentar novamente.');
                    yield (0, delay_1.default)(60);
                    return this.delete(options);
                }
                else {
                    throw error;
                }
            }
        });
    }
}
exports.default = BomControleClient;
