import * as React from "react";
import Layout from "../components/Layout/Layout";
import PartnerForm from "../components/PartnerForm/PartnerForm";
import CardParceiro from "../components/CardParceiro/CardParceiro";
import { Box, Button, Pagination } from "@mui/material";
import SearchBar from "../components/SearchBar/SearchBar";
import parceiroPadrao from "../constants/parceiroPadrao";
import Parceiro from "../interfaces/Parceiro";
import { useSnackbarContext } from "../context/SnackbarContext";
import AlertType from "../enums/AlertType";
import ModalEditarTaxa from "../components/ModalEditarTaxa/ModalEditarTaxa";
import ModalEditarContrato from "../components/ModalEditarContrato/ModalEditarContrato";
import Loading from "../components/Loading/Loading";
import ParceiroService from "../services/ParceiroService";

const parceiroService = new ParceiroService();

export default function CadastrosParceiros() {
    const [abrirForm, setAbrirForm] = React.useState(false);
    const [abrirTaxa, setAbrirTaxa] = React.useState(false);
    const [abrirContrato, setAbrirContrato] = React.useState(false);

    const [editando, setEditando] = React.useState(false);
    const [parceiroEditado, setParceiroEditado] = React.useState<Parceiro>(parceiroPadrao);

    const [parceiros, setParceiros] = React.useState<Parceiro[]>([]);
    const [parceirosFiltrados, setParceirosFiltrados] = React.useState<Parceiro[]>([]);

    const [ultimaBusca, setUltimaBusca] = React.useState('');

    const [adicionado, setAdicionado] = React.useState(false);

    const [totalPaginas, setTotalPaginas] = React.useState(1);
    const [paginaAtual, setPaginaAtual] = React.useState(1);

    const { abrirSnackbar } = useSnackbarContext();

    async function buscarParceiros(pagina = 1, query = '') {
        try {
            const response = await parceiroService.buscarParceiros(pagina, query);

            setParceiros(response.data.parceiros);

            setTotalPaginas(response.data.totalPaginas);
            setPaginaAtual(pagina);

            setAdicionado(false);
        } catch (error: any) {
            console.error(error)
            abrirSnackbar(AlertType.Error, error.response.data.message)
        }
    }

    React.useEffect(() => {
        buscarParceiros();
    }, [adicionado])

    function aoEditarParceiro(parceiro: Parceiro) {
        setParceiroEditado(parceiro);
        setEditando(true);
        setAbrirForm(true);
    }

    function aoEditarTaxa(parceiro: Parceiro) {
        setParceiroEditado(parceiro);
        setAbrirTaxa(true);
    }

    function aoEditarContrato(parceiro: Parceiro) {
        setParceiroEditado(parceiro);
        setAbrirContrato(true);
    }

    function handleClickNovoParceiro() {
        setParceiroEditado(parceiroPadrao);
        setAbrirForm(prevAbrirForm => !prevAbrirForm);
    }

    const aoMudarFiltro = (valor: string, dadosBuscados: boolean = false) => {
        if (!dadosBuscados) {
            buscarParceiros(1, valor);
        }
        const opcoesFiltradas = parceiros?.filter(parceiro =>
            parceiro.nome.toLowerCase().includes(valor.toLowerCase())
        );
        setParceirosFiltrados(opcoesFiltradas);
        setUltimaBusca(valor);
    }

    React.useEffect(() => {
        setParceirosFiltrados(parceiros);
        aoMudarFiltro(ultimaBusca, true);
    }, [parceiros]);

    return (
        <Layout titulo="Parceiros">
            {abrirForm ? <PartnerForm
                parceiroParam={parceiroEditado}
                setEditando={setEditando}
                editando={editando}
                setAbrirForm={setAbrirForm}
                setAdicionado={setAdicionado}
            />
                :
                <Box>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        sx={{ mb: 3, paddingY: 1.5, width: { xs: '100%', sm: '100%', md: 'calc(25% - 16px)' } }}
                        onClick={handleClickNovoParceiro}
                    >
                        Cadastrar novo parceiro
                    </Button>
                    {parceirosFiltrados && <SearchBar aoMudarFiltro={aoMudarFiltro} />}
                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                    }}>
                        {parceiros.map((parceiro) => (
                            <CardParceiro
                                key={parceiro.id}
                                parceiro={parceiro}
                                aoEditarParceiro={aoEditarParceiro}
                                aoEditarTaxa={aoEditarTaxa}
                                aoEditarContrato={aoEditarContrato}
                                setParceiros={setParceiros}
                                setAdicionado={setAdicionado}
                            />
                        )) || <Loading />}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={totalPaginas}
                            page={paginaAtual}
                            color="secondary"
                            onChange={(_event, newPage: any) => {
                                buscarParceiros(newPage);
                            }}
                        />
                    </Box>
                </Box>
            }
            {abrirTaxa && <ModalEditarTaxa
                openModal={abrirTaxa}
                setOpenModal={setAbrirTaxa}
                parceiroEditado={parceiroEditado}
                setParceiroEditado={setParceiroEditado}
                setAdicionado={setAdicionado}
            />}
            {abrirContrato && <ModalEditarContrato
                openModal={abrirContrato}
                setOpenModal={setAbrirContrato}
                parceiroEditado={parceiroEditado}
                setParceiroEditado={setParceiroEditado}
                setAdicionado={setAdicionado}
            />
            }
        </Layout>
    )
}