import * as React from 'react';
import { Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';
import ClienteService from '../../services/ClienteService';

const clienteService = new ClienteService();
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6633'];

export default function PagamentosPieChart({ status, status_pagamento }: any) {
    const [data, setData] = React.useState([]);

    async function buscarRelatorios() {
        try {
            const response = await clienteService.buscarRelatoriosPagamentos(status, status_pagamento);
            setData(response.data.clientes);
        } catch (e) {
            console.log(e)
        }
    }

    React.useEffect(() => {
        buscarRelatorios()
    }, [status, status_pagamento])

    return (
        <Box sx={{ mt: 2, width: '100%', height: '50vh' }}>
            <Typography variant="h6" gutterBottom>Indicações por Parceiro</Typography>
            <ResponsiveContainer  width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="total_indicacoes"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius="80%"
                        fill="#8884d8"
                        label
                    >
                        {data.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    )
};