import { Request, Response } from 'express';
import knex from '../database/database.js';
import dotenv from "dotenv";
import { dataAtual } from '../utils/dataUtils.js';
import criarContratoSchema from '../schemas/criarContratoSchema.js';
import idContratoEParceiroSchema from '../schemas/idContratoEParceiroSchema.js';

dotenv.config();

const criarContrato = async (req: Request, res: Response): Promise<any> => {
    try {
        const { nome, url } = req.body;
        const parceiro_id = req.params.parceiro_id;

        await criarContratoSchema.validate(req.body);
        await idContratoEParceiroSchema.validate(req.params);

        const data = {
            data: dataAtual(),
            nome,
            url,
            parceiro_id
        }

        await knex("parceiros_contrato").insert(data)
        return res.status(201).send();
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const buscarContratos = async (req: Request, res: Response): Promise<any> => {
    try {
        const parceiro_id = req.params.parceiro_id;

        await idContratoEParceiroSchema.validate(req.params);

        const contratos = await knex("parceiros_contrato as pc").select("pc.id", "pc.data", "pc.nome", "pc.url").where("parceiro_id", parceiro_id);

        return res.status(200).json({ contratos: contratos });
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

const deletarContratos = async (req: Request, res: Response): Promise<any> => {
    try {
        const parceiro_id = req.params.parceiro_id;
        const contrato_id = req.params.contrato_id;

        await idContratoEParceiroSchema.validate(req.params);

        await knex("parceiros_contrato as pc").where("parceiro_id", parceiro_id).where("id", contrato_id).del();

        return res.status(200).json();
    } catch (error: any) {
        if (error?.name === 'ValidationError') {
            return res.status(400).json({ message: error.message });
        }
        console.error(error);
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor.' });
    }
}

export { criarContrato, buscarContratos, deletarContratos };