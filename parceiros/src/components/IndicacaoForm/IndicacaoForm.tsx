import * as React from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import AlertType from "../../enums/AlertType";
import { useSnackbarContext } from "../../context/SnackbarContext";
import buscarCep from "../../utils/buscarCep";
import Cliente from "../../interfaces/Cliente";
import clientePadrao from "../../constants/clientePadrao";
import UserService from "../../services/UserService";
import Loading from "../Loading/Loading";
import ClienteService from "../../services/ClienteService";
import DadosDoContato from "../DadosDoContato/DadosDoContato";
import DadosDoEndereco from "../DadosDoEndereco/DadosDoEndereco";
import DadosDaMarca from "../DadosDaMarca/DadosDaMarca";
import DadosDaMensagem from "../DadosDaMensagem/DadosDaMensagem";
import errorFieldsIndicacaoPadrao from "../../constants/errorFieldsIndicacaoPadrao";

const userService = new UserService();
const clienteService = new ClienteService();

export default function IndicacaoForm({ setAbrirForm, setAdicionado }: any) {
    const user = userService.getUser();

    const [cliente, setCliente] = React.useState<Cliente>({ ...clientePadrao, parceiro_id: user?.id });

    const [enviando, setEnviando] = React.useState(false);

    const [errorFields, setErrorFields] = React.useState(errorFieldsIndicacaoPadrao);

    const [erroAdicionar, setErroAdicionar] = React.useState('');
    const [tipoMensagemAdicionar, setTipoMensagemAdicionar] = React.useState<AlertType>();

    const { abrirSnackbar } = useSnackbarContext();

    const handleChange = async (event: any) => {
        const { name, value, files } = event.target;
        let endereco;
        if (name == 'endereco.cep') {
            endereco = await buscarCep(event);
        }
        if (name.startsWith('endereco.')) {
            const enderecoField = name.split('.')[1];
            const novoEndereco = { ...cliente.endereco, ...endereco, [enderecoField]: value };
            setCliente(prevCliente => ({
                ...prevCliente,
                endereco: novoEndereco
            }));
        } else if (name == 'logomarca') {
            setCliente(prevCliente => ({
                ...prevCliente,
                logomarca: files[0]
            }));
        } else {
            setCliente(prevCliente => ({
                ...prevCliente,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEnviando(true);
        setErrorFields(errorFieldsIndicacaoPadrao);
        try {
            await clienteService.criarCliente(cliente);

            setEnviando(false);
            setAdicionado(true);
            abrirSnackbar(AlertType.Success, "Indicação enviada com sucesso!");
            setAbrirForm(false);
        } catch (error: any) {
            setEnviando(false);
            if (error.response && error.response.data) {
                setTipoMensagemAdicionar(AlertType.Error);
                setErroAdicionar(error.response.data.message);
                setErrorFields((prevErrorFields) => (
                    { ...prevErrorFields, [error.response.data.path]: true }
                ))
            }
            console.error(error);
        }
    }

    return (
        <>
            <Typography variant="h5">
                Nova Indicação
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{
                mt: 1,
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                gap: 2,
            }}>
                <DadosDoContato
                    parceiro={cliente}
                    handleChange={handleChange}
                    disabledConsultores={true}
                    errorFields={errorFields}
                />
                <DadosDoEndereco
                    parceiro={cliente}
                    handleChange={handleChange}
                    errorFields={errorFields}
                />
                <DadosDaMarca
                    cliente={cliente}
                    handleChange={handleChange}
                    errorFields={errorFields}
                />
                <DadosDaMensagem
                    cliente={cliente}
                    handleChange={handleChange}
                    errorFields={errorFields}
                />
                {erroAdicionar && (
                    <Alert sx={{ width: '100%' }} severity={tipoMensagemAdicionar}>{erroAdicionar}</Alert>
                )}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    justifyContent: 'center',
                    gap: 10
                }}>
                    <Button
                        disabled={enviando}
                        type="button"
                        variant="contained"
                        color="secondary"
                        onClick={() => { setAdicionado(true); setAbrirForm((prevAbrirForm: any) => !prevAbrirForm) }}
                        sx={{ mb: 3, padding: 1.5, width: '25%' }}
                    >
                        Cancelar
                    </Button>
                    <Button
                        disabled={enviando}
                        type="submit"
                        variant="contained"
                        color="secondary"
                        sx={{ mb: 3, padding: 1.5, width: '25%' }}
                    >
                        Enviar Indicação
                    </Button>
                    {enviando && <Loading />}
                </Box>
            </Box>
        </>
    )
}