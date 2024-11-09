import { Request, Response } from 'express';
import knex from '../database/database.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Usuario from '../types/Usuario.js';
import Parceiro from '../types/Parceiro.js';
import loginSchema from '../schemas/loginSchema.js';
import loginGoogleSchema from '../schemas/loginGoogleSchema.js';

dotenv.config();

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default';
const accessTokenExp = '15m';

const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default';
const refreshTokenExp = '7 days';

const autenticarGoogle = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email } = req.body;

        await loginGoogleSchema.validate(req.body);

        let user: Usuario | Parceiro = await knex("parceiros_usuario as u")
            .join("parceiros_email as e", "u.email_id", "=", "e.id")
            .select("u.*", "e.email")
            .where("e.email", email)
            .first();

        let tipo = "usuario";

        if (!user) {
            user = await knex("parceiros_parceiro as p")
                .join("parceiros_email as e", "p.email_id", "=", "e.id")
                .join("parceiros_endereco as en", "p.endereco_id", "=", "en.id")
                .select("p.*", "e.email", knex.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco"))
                .where("e.email", email)
                .first();
            tipo = "parceiro"
        }

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado!" });
        }

        if (user && !user.ativo) {
            return res.status(401).json({ message: "Usuário desativado!" });
        }

        const accessToken = jwt.sign({ id: user.id, tipo: tipo }, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExp });
        const refreshToken = jwt.sign({ id: user.id, tipo: tipo }, REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExp });

        await knex("parceiros_token").insert({ token: refreshToken, user_id: user.id, user_type: tipo });

        const primeiroAcesso = user.password ? false : true;

        const { password, ...usuarioSemSenha } = user;

        res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, user: usuarioSemSenha, primeiroAcesso: primeiroAcesso });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error)
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const autenticar = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        await loginSchema.validate(req.body);

        let user: Usuario | Parceiro = await knex("parceiros_usuario as u")
            .join("parceiros_email as e", "u.email_id", "=", "e.id")
            .select("u.*", "e.email")
            .where("e.email", email)
            .andWhere("u.ativo", 1)
            .andWhere("u.perfil", "!=", "Consultor")
            .first();

        let tipo = "usuario";

        if (!user) {
            user = await knex("parceiros_parceiro as p")
                .join("parceiros_email as e", "p.email_id", "=", "e.id")
                .join("parceiros_endereco as en", "p.endereco_id", "=", "en.id")
                .select("p.*", "e.email", knex.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco"))
                .where("e.email", email)
                .andWhere("p.ativo", 1)
                .first();

            tipo = "parceiro";
        }

        if (!user) {
            return res.status(401).json({ message: "Usuário não encontrado!", path: "email" });
        }

        if (user && !user.ativo) {
            return res.status(401).json({ message: "Usuário desativado!", path: "email" });
        }

        const { password: dbPassword, ...usuarioSemSenha }: Usuario | Parceiro = user;

        if (!dbPassword) {
            return res.status(401).json({ message: "Usuário não possui uma senha cadastrada!", path: "password" });
        }

        const senhaCorreta = await bcrypt.compare(password, dbPassword);

        if (!senhaCorreta) {
            return res.status(401).json({ message: "Senha incorreta!", path: "password" });
        }

        const accessToken = jwt.sign({ id: user.id, tipo: tipo }, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExp });
        const refreshToken = jwt.sign({ id: user.id, tipo: tipo }, REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExp });

        await knex("parceiros_token").insert({ token: refreshToken, user_id: user.id, user_type: tipo });

        return res.status(200).json({ accessToken: accessToken, refreshToken: refreshToken, user: usuarioSemSenha });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error)
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const token = async (req: Request, res: Response): Promise<any> => {
    try {
        const { token } = req.body;
        if (!token) return res.sendStatus(401);

        const storedToken = await knex('parceiros_token').where({ token }).first();
        if (!storedToken) return res.sendStatus(403);

        jwt.verify(token, REFRESH_TOKEN_SECRET, async (err: any, user: any) => {
            if (err) return res.sendStatus(403);

            const accessToken = jwt.sign({ id: user.id, tipo: user.tipo }, ACCESS_TOKEN_SECRET, { expiresIn: accessTokenExp });

            let usuario: Usuario | Parceiro;
            if (user.tipo == 'usuario') {
                usuario = await knex("parceiros_usuario as u")
                    .join("parceiros_email as e", "u.email_id", "=", "e.id")
                    .select("u.*", "e.email")
                    .where("u.id", user.id)
                    .first();
            } else {
                usuario = await knex("parceiros_parceiro as p")
                    .join("parceiros_email as e", "p.email_id", "=", "e.id")
                    .join("parceiros_endereco as en", "p.endereco_id", "=", "en.id")
                    .select("p.*", "e.email", knex.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco"))
                    .where("p.id", user.id)
                    .first();
            }

            res.status(200).json({ accessToken, user: usuario });
        });
    } catch (error) {

    }
}

const logout = async (req: Request, res: Response): Promise<any> => {
    const { token } = req.body;

    await knex('parceiros_token').where({ token }).del();
    
    res.sendStatus(204);
}

export { autenticar, autenticarGoogle, token, logout };