import { Box, Button, Card, CardActions, Divider, FormControlLabel, Switch } from "@mui/material";
import AlertType from '../../enums/AlertType';
import mascaraDocumento from "../../utils/mascaraDocumento";
import mascaraTelefone from "../../utils/mascaraTelefone";
import mascaraCep from "../../utils/mascaraCep";
import Parceiro from "../../interfaces/Parceiro";
import { useSnackbarContext } from "../../context/SnackbarContext";
import CardContentDrag from '../CardContentDrag/CardContentDrag';
import TituloCard from "../TituloCard/TituloCard";
import TextoCard from "../TextoCard/TextoCard";
import ParceiroService from "../../services/ParceiroService";
import capitalizar from "../../utils/capitalizar";

const parceiroService = new ParceiroService();

export default function CardParceiro({ parceiro, aoEditarParceiro, aoEditarTaxa, aoEditarContrato, setAdicionado }: any) {
    const { abrirSnackbar } = useSnackbarContext();

    const aoDesativar = async (prop: any) => {
        try {
            const novoEstadoAtivo = !parceiro[prop];

            const novoParceiro: Parceiro = {
                ...parceiro,
                [prop]: novoEstadoAtivo,
            }

            await parceiroService.editarParceiro(novoParceiro);

            setAdicionado(true);

            const alertType = novoEstadoAtivo ? AlertType.Info : AlertType.Warning;
            let mensagem;

            if (prop === 'ativo') {
                mensagem = novoEstadoAtivo ? 'Usuário ativado!' : 'Usuário desativado!';
            } else {
                mensagem = novoEstadoAtivo ? 'App do usuário ativado!' : 'App do usuário desativado!';
            }

            abrirSnackbar(alertType, mensagem);
        } catch (error) {
            if (prop == 'ativo') {
                abrirSnackbar(AlertType.Error, 'Erro ao desativar o usuário!');
            } else {
                abrirSnackbar(AlertType.Error, 'Erro ao desativar o app do usuário!');
            }
            console.error(error)
        }
    }

    const parceiroFormatado = {
        titulo: `${parceiro.razao_social} | ${mascaraDocumento(parceiro.documento)}`,
        contato: `Contato: ${parceiro.nome} | Tel1: ${mascaraTelefone(parceiro.tel1)}${parceiro.tel2 ? ` | Tel2: ${mascaraTelefone(parceiro.tel2)}` : ''}`,
        endereco: `Endereco: ${parceiro.endereco.logradouro}, ${parceiro.endereco.numero}${parceiro.endereco.complemento ? `, ${parceiro.endereco.complemento}` : ''}, ${parceiro.endereco.municipio}-${parceiro.endereco.uf}, CEP: ${mascaraCep(parceiro.endereco.cep)}`,
        email: `E-mail: ${parceiro.email}`,
        taxa: `Taxa de Participação: ${parceiro.taxa_tipo === 'Fixa' ? `${parceiro.taxa_valor} / Negócio Fechado` : `${parceiro.taxa_valor} do Negócio Fechado`}`,
        pix: parceiro.pix ? `Chave Pix: ${parceiro.pix} | Tipo de Chave: ${capitalizar(parceiro.tipo_pix)} | Titular: ${parceiro.titular}` : 'Chave Pix: Não informado',
    };

    return (
        <Card
            variant="outlined"
            sx={{
                flexBasis: 'calc(50% - 16px)',
                '@media (max-width: 1200px)': {
                    flexBasis: 'calc(100% - 16px)'
                },
                overflow: "auto",
                maxWidth: "100%"
            }}
        >
            <CardContentDrag>
                <TituloCard>{parceiroFormatado.titulo}</TituloCard>
                <TextoCard>{parceiroFormatado.contato}</TextoCard>
                <TextoCard>{parceiroFormatado.endereco}</TextoCard>
                <TextoCard>{parceiroFormatado.email}</TextoCard>
                <TextoCard gray={false}>{parceiroFormatado.pix}</TextoCard>
                <TextoCard gray={false}>{parceiroFormatado.taxa}</TextoCard>
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: 'fit-content',
                    cursor: 'initial'
                }}>
                    <FormControlLabel
                        control={
                            <Switch
                                name="Ativo"
                                checked={parceiro.ativo ? true : false}
                                onChange={() => aoDesativar('ativo')}
                                color="secondary"
                            />
                        }
                        label="Ativo"
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                name="app"
                                checked={parceiro.app ? true : false}
                                onChange={() => aoDesativar('app')}
                               color="secondary"
                            />
                        }
                        label="Permitir acesso App"
                        sx={{ display: 'none' }}
                    />
                </Box>
            </CardContentDrag>
            <Divider />
            <CardActions sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
                <Button color="secondary" variant="contained" onClick={() => aoEditarParceiro(parceiro)}>Editar Cadastro</Button>
                <Button color="secondary" variant="contained" onClick={() => aoEditarTaxa(parceiro)}>Editar Taxa</Button>
                <Button color="secondary" variant="contained" onClick={() => aoEditarContrato(parceiro)}>Contrato</Button>
            </CardActions>
        </Card>
    )
}