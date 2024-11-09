import { Request, Response } from 'express';
import knex from '../database/database.js';
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import RequestWithData from '../types/RequestWithData.js';
import usuarioSchema from '../schemas/usuarioSchema.js';
import passwordSchema from '../schemas/passwordSchema.js';
import buscarUserSchema from '../schemas/buscarUserSchema.js';

dotenv.config();

const criarUsuario = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nome, email, perfil, setor, token_bc } = req.body;

        await usuarioSchema.validate(req.body);

        const response = await knex("parceiros_email").insert({ email });
        const email_id = response[0];

        await knex("parceiros_usuario").insert({ nome, email_id, perfil, setor, token_bc });

        return res.status(201).json()
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        } else if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Usúario ou parceiro já existe no sistema.', path: "email" });
        } else {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
        }
    }
}

const criarOuAlterarSenha = async (req: RequestWithData, res: Response): Promise<any> => {
    try {
        const { password } = req.body;
        const data = req.data;

        await passwordSchema.validate(req.body);

        const senhaHash = await bcrypt.hash(password, 10);

        await knex("parceiros_usuario").where("id", "=", data.id).update({
            password: senhaHash
        })

        return res.status(200).send();
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const buscarUsuarios = async (req: Request, res: Response): Promise<any> => {
    try {
        const { pagina, query, perfil }: any = req.query;
        const registrosPorPagina = 8;

        await buscarUserSchema.validate(req.query);

        let usuarios;
        let totalPaginas = 0;

        const queryBuilder = knex("parceiros_usuario as u")
            .select("u.id", "u.nome", "e.email", "u.perfil", "u.setor", "u.ativo", "u.token_bc")
            .join("parceiros_email as e", "u.email_id", "e.id");

        const countBuilder = knex("parceiros_usuario");

        if (query) {
            queryBuilder.where("nome", "like", `%${query}%`);
            countBuilder.where("nome", "like", `%${query}%`);
        }

        if (perfil) {
            queryBuilder.where("perfil", "=", perfil);
            countBuilder.where("perfil", "=", perfil);
        }

        const { totalUsuarios }: any = await countBuilder
            .count('id as totalUsuarios')
            .first();

        if (totalUsuarios) {
            totalPaginas = Math.ceil(totalUsuarios / registrosPorPagina);
        }

        if (pagina) {
            queryBuilder.limit(registrosPorPagina);
        }

        if (!query && pagina) {
            queryBuilder.offset((pagina - 1) * registrosPorPagina);
        }

        usuarios = await queryBuilder;

        return res.status(200).json({ usuarios: usuarios, totalPaginas: totalPaginas });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const buscarUsuario = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        const queryBuilder = knex("parceiros_usuario as u")
            .select("u.nome", "e.email", "u.perfil", "u.setor", "u.ativo", "u.token_bc")
            .join("parceiros_email as e", "u.email_id", "e.id")
            .where("u.id", "=", id);

        const user = await queryBuilder;

        return res.status(200).json({ user: user });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const alterarUsuario = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nome, email, perfil, setor, ativo, token_bc } = req.body;
        const id = req.params.id;

        await usuarioSchema.validate(req.body);

        if (!id) {
            return res.status(400).json({ message: "O campo id é obrigatório" });
        }

        const response = await knex("parceiros_usuario as u").select("pe.id", "pe.email").where("u.id", "=", id).join("parceiros_email as pe", "u.email_id", "pe.id").first();

        if (response.email != email) {
            await knex("parceiros_email").where('id', '=', response.id).update({ email });

        }

        await knex("parceiros_usuario").where('id', '=', id).update({ id, nome, perfil, setor, ativo, token_bc });

        return res.status(200).send();
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        } else if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Usúario já existe no sistema.', path: "email" });
        } else {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
        }
    }
}

export { buscarUsuario, alterarUsuario, buscarUsuarios, criarUsuario, criarOuAlterarSenha };