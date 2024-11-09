import * as React from 'react';
import { Box } from "@mui/material";
import Layout from "../components/Layout/Layout";
import PagamentosPieChart from "../components/PagamentosPieChart/PagamentosPieChart";
import FiltroStatusIndicacao from "../components/FiltroStatusIndicacao/FiltroStatusIndicacao";
import FiltroStatusPagamentoIndicacao from "../components/FiltroStatusPagamentoIndicacao/FiltroStatusPagamentoIndicacao";

export default function RelatoriosPagamentos() {
    const [filtroStatus, setFiltroStatus] = React.useState('');
    const [filtroStatusPagamento, setFiltroStatusPagamento] = React.useState('');


    return (
        <>
            <Layout titulo="Relatórios de Pagamentos">
                <Box sx={{ display: 'flex', gap: { xs: 0, sm: 0, md: 2 }, flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                    <FiltroStatusIndicacao
                        filtro={filtroStatus}
                        setFiltro={setFiltroStatus}
                        inputWidth={"calc(20% - 16px)"}
                    />
                    <FiltroStatusPagamentoIndicacao
                        filtro={filtroStatusPagamento}
                        setFiltro={setFiltroStatusPagamento}
                        inputWidth={"calc(20% - 16px)"}
                    />
                </Box>
                <PagamentosPieChart status={filtroStatus} status_pagamento={filtroStatusPagamento} />
            </Layout>
        </>
    )
}