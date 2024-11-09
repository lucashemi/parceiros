import * as React from 'react';
import { Box } from "@mui/material";
import Layout from "../components/Layout/Layout";
import IndicacoesLineChart from "../components/IndicacoesLineChart/IndicacoesLineChart";
import FiltroStatusIndicacao from "../components/FiltroStatusIndicacao/FiltroStatusIndicacao";
import AutocompleteBar from "../components/AutocompleteBar/AutocompleteBar";
import { dataAtual, dataMesPassado } from '../utils/dataUtils';
import DatePicker from '../components/DatePicker/DatePicker';
import Parceiro from '../interfaces/Parceiro';
import ParceiroService from '../services/ParceiroService';
import { useSnackbarContext } from '../context/SnackbarContext';
import AlertType from '../enums/AlertType';
import FiltroStatusPagamentoIndicacao from '../components/FiltroStatusPagamentoIndicacao/FiltroStatusPagamentoIndicacao';

export default function RelatoriosIndicacoes() {

    const [inicio, setInicio] = React.useState(dataMesPassado());
    const [fim, setFim] = React.useState(dataAtual());

    const [filtroStatus, setFiltroStatus] = React.useState('');
    const [filtroStatusPagamento, setFiltroStatusPagamento] = React.useState('');

    const [busca, setBusca] = React.useState('');
    const [ultimaBusca, setUltimaBusca] = React.useState('');

    const [filtroParceiro, setFiltroParceiro] = React.useState(0);

    const [parceiros, setParceiros] = React.useState<Parceiro[]>([]);
    const [parceirosFiltrados, setParceirosFiltrados] = React.useState<Parceiro[]>([]);

    const { abrirSnackbar } = useSnackbarContext();

    async function buscarParceiros(query = '') {
        try {
            const parceiroService = new ParceiroService();
            const response = await parceiroService.buscarParceiros(1, query);

            setParceiros(response.data.parceiros);
        } catch (error: any) {
            console.error(error)
            abrirSnackbar(AlertType.Error, error.response.data.message)
        }
    }

    React.useEffect(() => {
        buscarParceiros();
    }, []);

    React.useEffect(() => {
        setParceirosFiltrados(parceirosFiltrados)
        aoMudarFiltro(ultimaBusca, true);
    }, [parceiros]);

    const aoMudarFiltro = (valor: string, dadosBuscados: boolean = false) => {
        setBusca(valor);
        if (!dadosBuscados) {
            buscarParceiros(valor);
        }
        const opcoesFiltradas = parceiros?.filter(parceiro =>
            parceiro.razao_social.toLowerCase().includes(valor.toLowerCase())
        );
        setParceirosFiltrados(opcoesFiltradas);
        setUltimaBusca(valor);
    }

    const aoSelecionar = (_e: any, v: any) => {
        setBusca(v);
        const parceiroId = parceirosFiltrados.find((parceiro: any) => parceiro.razao_social === v)?.id || 0;
        setFiltroParceiro(parceiroId);
    }

    return (
        <>
            <Layout titulo="Relatórios de Indicações">
                <Box sx={{ display: 'flex', gap: { xs: 0, sm: 0, md: 2 }, flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                    <AutocompleteBar
                        aoMudarFiltro={aoMudarFiltro}
                        opcoes={["", ...parceirosFiltrados.map((parceiro: any) => parceiro.razao_social)]}
                        aoSelecionar={aoSelecionar}
                        label={"Parceiro"}
                        estilos={{ flexBasis: { xs: '100%', sm: '100%', md: 'calc(20% - 16px)' }, mt: 2 }}
                        valor={busca}
                    />
                    <DatePicker
                        data={inicio}
                        setData={setInicio}
                        label="Data de inicio"
                    />
                    <DatePicker
                        data={fim}
                        setData={setFim}
                        label="Data final"
                    />
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
                <IndicacoesLineChart parceiro_id={filtroParceiro} inicio={inicio} fim={fim} status={filtroStatus} status_pagamento={filtroStatusPagamento} />
            </Layout>
        </>
    )
}