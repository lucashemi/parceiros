import * as React from 'react';
import { Alert, Box, Button, Divider, Typography } from "@mui/material";
import { Close, CloudUpload } from "@mui/icons-material";
import AlertType from '../../enums/AlertType';
import { useSnackbarContext } from '../../context/SnackbarContext';
import VisuallyHiddenInput from '../VisuallyHiddenInput/VisuallyHiddenInput';
import Loading from '../Loading/Loading';
import ContratoService from '../../services/ContratoService';
import driveUpload from '../../utils/driveUpload';

const contratoService = new ContratoService();

export default function FormEditarContrato({ setAdicionado, handleClose, parceiroEditado }: any) {
    const { abrirSnackbar } = useSnackbarContext();

    const [arquivo, setArquivo] = React.useState(null) as any;
    const [enviando, setEnviando] = React.useState(false);

    const [erroEditar, setErroEditar] = React.useState('');
    const [tipoMensagemEditar, setTipoMensagemEditar] = React.useState<AlertType>();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setEnviando(true);
        try {

            const response = await driveUpload(arquivo, parceiroEditado.razao_social);

            const contrato = {
                nome: arquivo.name,
                url: response.data
            }

            await contratoService.criarContrato(parceiroEditado.id, contrato);

            setAdicionado(true);
            setEnviando(false);
            abrirSnackbar(AlertType.Success, 'Contrato adicionado com sucesso!')

        } catch (error: any) {
            if (error.response && error.response.data) {
                setTipoMensagemEditar(AlertType.Error);
                setErroEditar(error.response.data.message);
            }
            console.error(error);
        }
    }

    const handleFileChange = (event: any) => {
        const file = event.target.files[0];
        setArquivo(file);
    };

    return (
        <Box
            component='form'
            onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleSubmit(event)}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="h6" fontWeight={600} my={1}>{parceiroEditado.razao_social}</Typography>
                <Close sx={{ cursor: 'pointer' }} onClick={handleClose} />
            </Box>
            <Divider />
            <Typography fontWeight={600} variant='h6' my={2}>
                Contrato
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                    color="secondary"
                    variant="contained"
                    component="label"
                    onChange={handleFileChange}
                    startIcon={<CloudUpload />}
                >
                    Escolher arquivo
                    <VisuallyHiddenInput type="file" accept=".pdf" />
                </Button>
                {arquivo && (
                    <Typography variant="body1" sx={{ overflow: 'hidden' }} >
                        {arquivo?.name}
                    </Typography>
                )}
            </Box>
            {erroEditar && (
                <Alert sx={{ width: '100%' }} severity={tipoMensagemEditar}>{erroEditar}</Alert>
            )}
            <Button
                fullWidth
                disabled={enviando || !arquivo ? true : false}
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ mt: 1 }}
            >
                Salvar
            </Button>
            {enviando && <Loading />}
        </Box>
    )
}