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
const bomControleClient_1 = __importDefault(require("./bomControleClient"));
class ClienteService extends bomControleClient_1.default {
    constructor(tokenId) {
        // Chama o construtor da classe pai (BomControleClient) para inicializar o axios com o token
        super(tokenId);
    }
    // Buscar cliente
    buscarCliente(documento) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = `/Cliente/Pesquisar?pesquisa=${documento}`;
            try {
                // Usando o método 'get' herdado de BomControleClient
                return yield this.get({ endpoint });
            }
            catch (error) {
                const status = error.response.data.status;
                if (status === 404) {
                    return null;
                }
                console.error('Erro ao buscar cliente:', error);
                throw error;
            }
        });
    }
    // Criar cliente
    criarCliente(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const endpoint = '/Cliente/Criar';
            try {
                // Usando o método 'post' herdado de BomControleClient
                const response = yield this.post({ endpoint, data });
                return response.data;
            }
            catch (error) {
                console.error('Erro ao criar cliente:', error);
                throw error;
            }
        });
    }
}
exports.default = ClienteService;
