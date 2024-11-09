import * as React from "react";
import { Box, Divider, Pagination } from "@mui/material";
import Layout from "../components/Layout/Layout";
import UsuarioService from "../services/UsuarioService";
import SearchBar from "../components/SearchBar/SearchBar";
import RegisterUserForm from "../components/RegisterUserForm/RegisterUserForm";
import Loading from "../components/Loading/Loading";
import CardUsuario from "../components/CardUsuario/CardUsuario";
import AlertType from "../enums/AlertType";
import ModalEditarUsuario from "../components/ModalEditarUsuario/ModalEditarUsuario";
import Usuario from "../interfaces/Usuario";
import { useSnackbarContext } from "../context/SnackbarContext";

const usuarioService = new UsuarioService();

export default function CadastrosUsuarios() {
    const [usuarios, setUsuarios] = React.useState<Usuario[] | undefined | null>();
    const [usuariosFiltrados, setUsuariosFiltrados] = React.useState<Usuario[] | undefined | null>(usuarios);
    const [ultimaBusca, setUltimaBusca] = React.useState('');

    const [adicionado, setAdicionado] = React.useState(false);

    const [totalPaginas, setTotalPaginas] = React.useState(1);
    const [paginaAtual, setPaginaAtual] = React.useState(1);

    const [usuarioEditado, setUsuarioEditado] = React.useState<Usuario | undefined>();
    const [openModal, setOpenModal] = React.useState(false);

    const { abrirSnackbar } = useSnackbarContext();

    const aoMudarFiltro = (valor: string, dadosBuscados: boolean = false) => {
        if (!dadosBuscados) {
            buscarUsuarios(1, valor);
        }
        const opcoesFiltradas = usuarios?.filter(usuario =>
            usuario.nome.toLowerCase().includes(valor.toLowerCase())
        );
        setUsuariosFiltrados(opcoesFiltradas);
        setUltimaBusca(valor);
    }

    React.useEffect(() => {
        setUsuariosFiltrados(usuarios);
        aoMudarFiltro(ultimaBusca, true);
    }, [usuarios]);

    const buscarUsuarios = async (pagina: number = 1, query: string = '') => {
        try {
            const response = await usuarioService.buscarUsuarios(pagina, query);

            const usuarios = response.data.usuarios;

            setTotalPaginas(response.data.totalPaginas);
            setPaginaAtual(pagina);

            setUsuarios(usuarios);
            setAdicionado(false);
        } catch (error: any) {
            abrirSnackbar(AlertType.Error, error.response.data.message);
            console.error(error);
        }
    };

    React.useEffect(() => {
        buscarUsuarios();
    }, [adicionado]);

    const aoEditar = (usuario: Usuario) => {
        setUsuarioEditado(usuario);
        setOpenModal(true);
    }

    return (
        <Layout titulo="Usuários">
            <RegisterUserForm setAdicionado={setAdicionado} />
            <Divider sx={{ mb: 3 }} />
            {usuariosFiltrados && <SearchBar aoMudarFiltro={aoMudarFiltro} />}
            <Box sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 2,
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            }}>
                {usuariosFiltrados && usuariosFiltrados.map((usuario: Usuario) => (
                    <CardUsuario
                        key={String(usuario.id)}
                        usuario={usuario}
                        aoEditar={aoEditar}
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
                        buscarUsuarios(newPage);
                    }}
                />
            </Box>
            {openModal && <ModalEditarUsuario
                openModal={openModal}
                setOpenModal={setOpenModal}
                usuarioEditado={usuarioEditado}
                setUsuarioEditado={setUsuarioEditado}
                setAdicionado={setAdicionado}
            />}
        </Layout>
    )
}