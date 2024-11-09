import { Request, Response } from 'express';
import knex from '../database/database.js';
import dotenv from "dotenv";
import { dataAtual, formatarData } from '../utils/dataUtils.js';
import clienteSchema from '../schemas/clienteSchema.js';
import buscarUserSchema from '../schemas/buscarUserSchema.js';
import criarLeadBc from '../utils/criarLeadBc.js';

dotenv.config();

const criarCliente = async (req: Request, res: Response): Promise<any> => {
    try {
        const { documento, razao_social, nome, email, tel1, tel2, parceiro_id, endereco, marca, logomarca: link_logomarca, mensagem } = req.body;

        await clienteSchema.validate(req.body);

        const response = await knex("parceiros_endereco").insert(endereco);
        const endereco_id = response[0];

        const result = await knex("parceiros_cliente").insert({
            documento,
            razao_social,
            nome,
            email,
            tel1,
            tel2: tel2 || null,
            endereco_id,
            parceiro_id,
            marca,
            link_logomarca: link_logomarca || null,
            mensagem: mensagem || null,
            data_indicacao: dataAtual()
        })

        const insertedId = result[0];

        // cria lead no bitrix
        const idDaOportunidade = await criarLeadBc(req.body);

        // gravar ida da op q foi criada no bc
        await knex("parceiros_cliente").where('id', insertedId).update({ id_lead: idDaOportunidade });

        return res.status(201).send();
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Cliente já existe no sistema.', path: "documento" });
        } else {
            console.error(error);
            return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
        }
    }
}

const buscarClientes = async (req: Request, res: Response): Promise<any> => {
    try {
        const parceiro_id = req.params.parceiro_id;
        const { pagina, status, status_pagamento, ordem }: any = req.query;
        const registrosPorPagina = 8;

        await buscarUserSchema.validate(req.query);

        let clientes;
        let totalPaginas = 0;

        const queryBuilder = knex("parceiros_cliente as c")
            .select(
                "c.id",
                "c.razao_social",
                "c.documento", "c.nome", "c.marca",
                "c.link_logomarca", "c.email",
                "c.tel1", "c.tel2",
                "c.parceiro_id",
                "c.data_indicacao",
                "c.mensagem",
                "c.status",
                "c.status_pagamento",
                "c.valor_participacao",
                "c.data_pagamento",
                "c.link_comprovante",
                "p.razao_social as parceiro_razao_social",
                "u.nome as consultor_nome",
                knex.raw("JSON_OBJECT('id', e.id, 'cep', e.cep, 'logradouro', e.logradouro, 'numero', e.numero, 'complemento', e.complemento, 'bairro', e.bairro, 'uf', e.uf, 'municipio', e.municipio) as endereco")
            )
            .join("parceiros_endereco as e", "c.endereco_id", "e.id")
            .join("parceiros_parceiro as p", "c.parceiro_id", "p.id")
            .join("parceiros_usuario as u", "p.consultor_id", "u.id")

        const countBuilder = knex("parceiros_cliente");

        if (parceiro_id) {
            queryBuilder.where("parceiro_id", "=", parceiro_id);
            countBuilder.where("parceiro_id", "=", parceiro_id);
        }

        if (status) {
            queryBuilder.where("status", "like", `%${status}%`);
            countBuilder.where("status", "like", `%${status}%`);
        }

        if (status_pagamento) {
            queryBuilder.where("status_pagamento", "like", `${status_pagamento}`);
            countBuilder.where("status_pagamento", "like", `${status_pagamento}`);
        }

        queryBuilder.orderBy('c.data_indicacao', ordem);
        queryBuilder.orderBy('id', ordem);

        const { totalClientes }: any = await countBuilder
            .count('id as totalClientes')
            .first();

        if (totalClientes) {
            totalPaginas = Math.ceil(totalClientes / registrosPorPagina);
        }

        if (pagina) {
            queryBuilder.limit(registrosPorPagina);
        }

        if (!status && pagina) {
            queryBuilder.offset((pagina - 1) * registrosPorPagina);
        }

        clientes = await queryBuilder;

        return res.status(200).json({ clientes: clientes, totalPaginas: totalPaginas });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const relatorioClientes = async (req: Request, res: Response): Promise<any> => {
    try {
        const parceiro_id = req.params.parceiro_id;
        const { inicio = dataAtual(), fim = dataAtual(), status, status_pagamento }: any = req.query;

        const queryBuilder = knex("direcao.parceiros_cliente as pc")
            .select(
                "pc.data_indicacao as name",
                knex.raw("COUNT(pc.id) as total_indicacoes")
            )
            .whereBetween("pc.data_indicacao", [inicio, fim]);

        if (parceiro_id) {
            queryBuilder.where("pc.parceiro_id", "=", parceiro_id);
        }

        if (status) {
            queryBuilder.where("pc.status", "LIKE", `%${status}%`);
        }

        if (status_pagamento) {
            queryBuilder.where("pc.status_pagamento", "LIKE", `${status_pagamento}`);
        }

        queryBuilder
            .groupBy("pc.data_indicacao")
            .orderBy("pc.data_indicacao");

        const clientes = await queryBuilder;

        const clientesFormatados = clientes.map(row => ({
            ...row,
            name: formatarData(new Date(row.name))
        }));

        return res.status(200).json({ clientes: clientesFormatados });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const relatorioPagamentos = async (req: Request, res: Response): Promise<any> => {
    try {
        const { status, status_pagamento }: any = req.query;

        const queryBuilder = knex("direcao.parceiros_cliente as pc")
            .select(
                "p.razao_social as name",
                knex.raw("COUNT(pc.id) as total_indicacoes")
            )
            .join("direcao.parceiros_parceiro as p", "pc.parceiro_id", "p.id")

        if (status) {
            queryBuilder.where("pc.status", "LIKE", `%${status}%`);
        }

        if (status_pagamento) {
            queryBuilder.where("pc.status_pagamento", "LIKE", `${status_pagamento}`);
        }

        queryBuilder
            .groupBy("p.razao_social")
            .orderBy("total_indicacoes", "desc");

        const clientes = await queryBuilder;

        return res.status(200).json({ clientes });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message, path: error.path });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

export { criarCliente, buscarClientes, relatorioClientes, relatorioPagamentos };