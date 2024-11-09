import * as React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';
import ClienteService from '../../services/ClienteService';
import { dataAtual, dataMesPassado } from '../../utils/dataUtils';

const clienteService = new ClienteService();

export default function IndicacoesLineChart({ parceiro_id = 0, inicio = dataMesPassado(), fim = dataAtual(), status = "", status_pagamento = "" }) {
    const [data, setData] = React.useState([]);

    async function buscarRelatorios() {
        try {
            const response = await clienteService.buscarRelatorios(parceiro_id, inicio, fim, status, status_pagamento);
            setData(response.data.clientes);
        } catch (e) {
            console.log(e)
        }
    }

    React.useEffect(() => {
        buscarRelatorios()
    }, [parceiro_id, inicio, fim, status, status_pagamento])

    return (
        <Box sx={{ padding: 2, borderRadius: '8px', boxShadow: 1, width: '100%', height: '40vh' }}>
            <Typography variant="h6" gutterBottom>Total de Indicações por Periodo</Typography>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}`, `Total de Indicações`]} />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="total_indicacoes"
                        stroke="#8884d8"
                        strokeWidth={2}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                        animationDuration={500}
                    />
                </LineChart>
            </ResponsiveContainer>
        </Box>
    )
};