import * as React from 'react'
import Layout from "../components/Layout/Layout";
import Cliente from "../interfaces/Cliente";
import { useSnackbarContext } from '../context/SnackbarContext';
import AlertType from '../enums/AlertType';
import ClienteService from '../services/ClienteService';
import FiltroStatusIndicacao from '../components/FiltroStatusIndicacao/FiltroStatusIndicacao';
import CardCliente from '../components/CardCliente/CardCliente';
import { Box, Button, Pagination } from '@mui/material';
import Loading from '../components/Loading/Loading';
import ParceiroService from '../services/ParceiroService';
import Parceiro from '../interfaces/Parceiro';
import AutocompleteBar from '../components/AutocompleteBar/AutocompleteBar';
import Ordenar from '../components/Ordenar/Ordenar';
import UserService from '../services/UserService';
import IndicacaoForm from '../components/IndicacaoForm/IndicacaoForm';
import CardsTotais from '../components/CardsTotais/CardsTotais';
import FiltroStatusPagamentoIndicacao from '../components/FiltroStatusPagamentoIndicacao/FiltroStatusPagamentoIndicacao';

const clienteService = new ClienteService();
const userService = new UserService();

export default function Indicacoes() {
    const user = userService.getUser();
    const ehUsuario = userService.ehUsuario();

    if (!userService.authenticatedUser()) return;

    const [abrirForm, setAbrirForm] = React.useState(false);
    const [adicionado, setAdicionado] = React.useState(false);

    const [clientes, setClientes] = React.useState<Cliente[]>([]);
    const [parceiros, setParceiros] = React.useState<Parceiro[]>([]);
    const [parceirosFiltrados, setParceirosFiltrados] = React.useState<Parceiro[]>([]);

    const [busca, setBusca] = React.useState('');
    const [ultimaBusca, setUltimaBusca] = React.useState('');

    const [filtroStatus, setFiltroStatus] = React.useState('');
    const [filtroStatusPagamento, setFiltroStatusPagamento] = React.useState('');
    const [filtroParceiro, setFiltroParceiro] = React.useState(!ehUsuario ? user?.id : 0);
    const [ordem, setOrdem] = React.useState('DESC');

    const [totalPaginas, setTotalPaginas] = React.useState(1);
    const [paginaAtual, setPaginaAtual] = React.useState(1);

    const { abrirSnackbar } = useSnackbarContext();

    async function buscarClientes(pagina = 1) {
        try {
            if (!userService.authenticatedUser()) return;
            const response = await clienteService.buscarClientes(filtroParceiro || undefined, pagina, filtroStatus, filtroStatusPagamento, ordem);

            setTotalPaginas(response.data.totalPaginas);
            setPaginaAtual(pagina);

            setClientes(response.data.clientes);
            setAdicionado(false);
        } catch (error: any) {
            console.error(error)
            abrirSnackbar(AlertType.Error, error.response.data.message)
        }
    }

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
        setFiltroStatus("");
        setFiltroParceiro(!ehUsuario ? user?.id : 0);
    }, [adicionado]);

    React.useEffect(() => {
        buscarClientes();
    }, [adicionado, filtroStatus, filtroStatusPagamento, filtroParceiro, ordem]);

    React.useEffect(() => {
        buscarParceiros();
    }, []);

    React.useEffect(() => {
        setParceirosFiltrados(parceirosFiltrados)
        aoMudarFiltro(ultimaBusca, true);
    }, [parceiros]);

    function handleClickNovaIndicacao() {
        setAbrirForm(prevAbrirForm => !prevAbrirForm);
    }

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
            <Layout titulo="Indicações de Parceiros">
                {abrirForm ?
                    <IndicacaoForm
                        setAbrirForm={setAbrirForm}
                        setAdicionado={setAdicionado}
                    />
                    : <Box>
                        {!ehUsuario && 
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                sx={{ mb: 3, paddingY: 1.5, width: { xs: '100%', sm: '100%', md: 'calc(25% - 16px)' } }}
                                onClick={handleClickNovaIndicacao}
                            >
                                Criar Nova indicação
                            </Button>
                            <CardsTotais clientes={clientes} />
                        </Box>}
                        <Box sx={{ display: 'flex', gap: { xs: 0, sm: 0, md: 2 }, flexDirection: { xs: 'column', sm: 'column', md: 'row' } }}>
                            {ehUsuario && <AutocompleteBar
                                aoMudarFiltro={aoMudarFiltro}
                                opcoes={["", ...parceirosFiltrados.map((parceiro: any) => parceiro.razao_social)]}
                                aoSelecionar={aoSelecionar}
                                label={"Parceiro"}
                                estilos={{ flexBasis: { xs: '100%', sm: '100%', md: 'calc(25% - 16px)' }, mt: 2 }}
                                valor={busca}
                            />}
                            <FiltroStatusIndicacao
                                filtro={filtroStatus}
                                setFiltro={setFiltroStatus}
                            />
                            <FiltroStatusPagamentoIndicacao
                                filtro={filtroStatusPagamento}
                                setFiltro={setFiltroStatusPagamento}
                            />
                            <Ordenar
                                ordem={ordem}
                                setOrdem={setOrdem}
                            />
                        </Box>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 2,
                            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                            mt: 2
                        }}>
                            {clientes.map((cliente) => (
                                <CardCliente
                                    key={cliente.id}
                                    cliente={cliente}
                                    administrador={ehUsuario}
                                />
                            )) || <Loading />}
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                            <Pagination
                                count={totalPaginas}
                                page={paginaAtual}
                                color="secondary"
                                onChange={(_event, newPage: any) => {
                                    buscarClientes(newPage);
                                }}
                            />
                        </Box>
                    </Box>}
            </Layout>
        </>
    )
}