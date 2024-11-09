import { Request, Response } from 'express';
import knex from '../database/database.js';
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import RequestWithData from '../types/RequestWithData.js';
import passwordSchema from '../schemas/passwordSchema.js';
import buscarUserSchema from '../schemas/buscarUserSchema.js';
import parceiroSchema from '../schemas/parceiroSchema.js';

dotenv.config();

const criarParceiro = async (req: Request, res: Response): Promise<any> => {
    try {
        const { documento, razao_social, nome, ativo, tel1, tel2, email, consultor_id, endereco } = req.body;

        await parceiroSchema.validate(req.body);

        const response = await knex("parceiros_endereco").insert(endereco)
        const endereco_id = response[0];

        const response_email = await knex("parceiros_email").insert({ email });
        const email_id = response_email[0];

        await knex("parceiros_parceiro").insert({ documento, razao_social, nome, email_id, ativo, tel1, tel2: tel2 || null, endereco_id, consultor_id })

        return res.status(201).send();
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            const path = error.sqlMessage.includes("parceiros_parceiro.parceiro_unique_1") ? "documento" : "email";
            return res.status(400).json({ message: 'Parceiro já existe no sistema.', path: path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const buscarParceiros = async (req: Request, res: Response): Promise<any> => {
    try {
        const { pagina, query }: any = req.query;
        const registrosPorPagina = 8;

        await buscarUserSchema.validate(req.query);

        let parceiros;
        let totalPaginas = 0;

        const queryBuilder = knex("parceiros_parceiro as p")
            .select(
                "p.id",
                "p.razao_social",
                "p.documento", "p.nome",
                "pe.email", "p.tel1", "p.tel2",
                "p.ativo",
                "p.app",
                "p.consultor_id",
                "p.taxa_tipo",
                "p.taxa_valor",
                "p.pix",
                "p.titular",
                "p.tipo_pix",
                knex.raw("JSON_OBJECT('id', e.id, 'cep', e.cep, 'logradouro', e.logradouro, 'numero', e.numero, 'complemento', e.complemento, 'bairro', e.bairro, 'uf', e.uf, 'municipio', e.municipio) as endereco")
            )
            .join("parceiros_endereco as e", "p.endereco_id", "e.id")
            .join("parceiros_email as pe", "p.email_id", "pe.id")

        const countBuilder = knex("parceiros_parceiro");

        if (query) {
            queryBuilder.where("razao_social", "like", `%${query}%`);
            countBuilder.where("razao_social", "like", `%${query}%`);
        }

        const { totalParceiros }: any = await countBuilder
            .count('id as totalParceiros')
            .first();

        if (totalParceiros) {
            totalPaginas = Math.ceil(totalParceiros / registrosPorPagina);
        }

        if (pagina) {
            queryBuilder.limit(registrosPorPagina);
        }

        if (!query && pagina) {
            queryBuilder.offset((pagina - 1) * registrosPorPagina);
        }

        parceiros = await queryBuilder;

        return res.status(200).json({ parceiros: parceiros, totalPaginas: totalPaginas });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const buscarParceiro = async (req: Request, res: Response): Promise<any> => {
    try {
        const id = req.params.id;

        const queryBuilder = knex("parceiros_parceiro as p")
            .select(
                "p.id",
                "p.razao_social",
                "p.documento", "p.nome",
                "pe.email", "p.tel1", "p.tel2",
                "p.ativo",
                "p.app",
                "p.consultor_id",
                "p.taxa_tipo",
                "p.taxa_valor",
                "p.pix",
                "p.titular",
                "p.tipo_pix",
                knex.raw("JSON_OBJECT('id', en.id, 'cep', en.cep, 'logradouro', en.logradouro, 'numero', en.numero, 'complemento', en.complemento, 'bairro', en.bairro, 'uf', en.uf, 'municipio', en.municipio) as endereco")
            )
            .join("parceiros_endereco as en", "p.endereco_id", "en.id")
            .join("parceiros_email as pe", "p.email_id", "e.id")
            .where("p.id", "=", id);

        const user = await queryBuilder;

        return res.status(200).json({ user: user });
    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const alterarParceiro = async (req: Request, res: Response): Promise<any> => {
    try {
        const { documento, razao_social, nome, ativo, app, taxa_tipo, taxa_valor, tel1, tel2, email, consultor_id, endereco, pix, titular, tipo_pix } = req.body;
        const id = req.params.id;

        await parceiroSchema.validate(req.body);

        const { id: endereco_id, ...novoEndereco } = endereco;
        await knex("parceiros_endereco").where('id', '=', endereco_id).update(novoEndereco);

        const response = await knex("parceiros_parceiro as p").select("pe.id", "pe.email").where("p.id", "=", id).join("parceiros_email as pe", "p.email_id", "pe.id").first();

        if (response.email != email) {
            await knex("parceiros_email").where('id', '=', response.id).update({ email });
        }

        await knex("parceiros_parceiro")
            .where('id', '=', id)
            .update({
                documento,
                razao_social,
                nome, ativo,
                app,
                taxa_tipo,
                taxa_valor,
                tel1,
                tel2: tel2 || null,
                endereco_id,
                consultor_id,
                pix,
                titular,
                tipo_pix
            })

        return res.status(200).send();
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Parceiro já existe no sistema.', path: "email" });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const criarSenhaParceiro = async (req: RequestWithData, res: Response): Promise<any> => {
    try {
        const { senhaAtual, password } = req.body;
        const data = req.data;

        await passwordSchema.validate(req.body)

        if (senhaAtual) {
            const parceiro = await knex("parceiros_parceiro").select("password").where("id", "=", data.id).first();
            const senhaCorreta = await bcrypt.compare(senhaAtual, parceiro.password);
            if (!senhaCorreta) {
                return res.status(400).json({ message: "A senha atual informada é incorreta!", path: "senhaAtual" })
            }
        }

        const senhaHash = await bcrypt.hash(password, 10);

        await knex("parceiros_parceiro").where("id", "=", data.id).update({
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

export { criarParceiro, buscarParceiros, buscarParceiro, alterarParceiro, criarSenhaParceiro };