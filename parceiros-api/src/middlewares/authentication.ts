import { Response, NextFunction } from 'express';
import jwt from "jsonwebtoken";
import knex from '../database/database.js';
import dotenv from "dotenv";
import RequestWithData from '../types/RequestWithData.js';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default';

export const verificarToken = async (req: RequestWithData, res: Response, next: NextFunction): Promise<any> => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Não autorizado!' });
    }

    try {
        const token = authorization.split(' ')[1];
        const data = jwt.verify(token, ACCESS_TOKEN_SECRET) as any;

        const tabela = data.tipo == 'usuario' ? "parceiros_usuario" : "parceiros_parceiro";

        const usuario = await knex(tabela).where("id", data.id);
        
        if (!usuario) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }

        req.data = data;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Acesso expirado!' });
        }

        console.error(error);
        return res.status(500).json({ message: 'Erro interno no servidor!' });
    }
}