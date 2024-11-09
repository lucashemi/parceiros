import { Button, Card, CardActions, Divider, FormControlLabel, Switch } from "@mui/material";
import AlertType from '../../enums/AlertType';
import Usuario from "../../interfaces/Usuario";
import { useSnackbarContext } from "../../context/SnackbarContext";
import CardContentDrag from "../CardContentDrag/CardContentDrag";
import UsuarioService from "../../services/UsuarioService";
import TituloCard from "../TituloCard/TituloCard";
import TextoCard from "../TextoCard/TextoCard";

const usuarioService = new UsuarioService();

export default function CardUsuario({ usuario, aoEditar, setAdicionado }: any) {
    const { abrirSnackbar } = useSnackbarContext();

    const aoDesativar = async () => {
        try {
            const novoEstadoAtivo = !usuario.ativo;
            const novoUsuario: Usuario = { ...usuario, ativo: novoEstadoAtivo }

            await usuarioService.editarUsuario(novoUsuario);

            setAdicionado(true);

            if (novoEstadoAtivo) {
                abrirSnackbar(AlertType.Info, 'Usuário ativado!');
            } else {
                abrirSnackbar(AlertType.Warning, 'Usuário desativado!');
            }
        } catch (error) {
            abrirSnackbar(AlertType.Error, 'Erro ao desativar o usuário!');
            console.error(error)
        }
    }

    return (
        <Card
            variant="outlined"
            sx={{
                flexBasis: 'calc(25% - 16px)',
                '@media (max-width: 1200px)': {
                    flexBasis: 'calc(50% - 16px)'
                },
            }}
        >
            <CardContentDrag>
                <TituloCard>{usuario.nome}</TituloCard>
                <TextoCard>Perfil: {usuario.perfil}</TextoCard>
                <TextoCard>Setor: {usuario.setor}</TextoCard>
                <br />
                <TextoCard>{usuario.email}</TextoCard>
            </CardContentDrag>
            <Divider />
            <CardActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                <FormControlLabel
                    control={
                        <Switch
                            name="Ativo"
                            checked={usuario.ativo}
                            onChange={() => aoDesativar()}
                            color="secondary"
                        />
                    }
                    label="Ativo"
                />
                <Button color="secondary" variant="contained" onClick={() => aoEditar(usuario)}>Editar</Button>
            </CardActions>
        </Card>
    )
}