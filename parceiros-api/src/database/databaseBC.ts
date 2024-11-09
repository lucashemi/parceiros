import dotenv from 'dotenv';
import knex from 'knex';

dotenv.config();

const db = knex({
    client: 'mysql2',
    connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME_BC
    }
});

export default db;