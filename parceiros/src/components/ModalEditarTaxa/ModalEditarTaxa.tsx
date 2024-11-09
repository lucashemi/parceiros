import * as React from 'react';
import { Alert, Box, Button, Divider, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import AlertType from '../../enums/AlertType';
import { useSnackbarContext } from '../../context/SnackbarContext';
import formatarBRL from '../../utils/formatarBRL';
import ParceiroService from '../../services/ParceiroService';
import errorFieldsParceiroPadrao from '../../constants/errorFieldsParceiroPadrao';

const parceiroService = new ParceiroService();

export default function ModalEditarTaxa({ openModal, setOpenModal, parceiroEditado, setParceiroEditado, setAdicionado }: any) {
    const { abrirSnackbar } = useSnackbarContext();

    const [alerta, setAlerta] = React.useState<{ mensagem: string, tipo: AlertType | undefined }>({ mensagem: "", tipo: undefined });

    const [errorFields, setErrorFields] = React.useState(errorFieldsParceiroPadrao);

    const handleClose = () => setOpenModal(false);

    function handleChangeParceiro(event: any) {
        let { name, value } = event.target;

        if (name == "taxa_valor") {
            value = value.replace(/[^\d,]/g, '');
            if (parceiroEditado.taxa_tipo == "Fixa") {
                value = formatarBRL(value);
            } else {
                value = Number(value.replace(",", ""));
                if (value == '') value = '0';
                if (value > 100) value = '100';
                value = value + "%";
            }
        }

        if (name == "taxa_tipo") {
            setParceiroEditado((prevParceiroEditado: any) => ({
                ...prevParceiroEditado,
                taxa_valor: value == "Variável" ? '10%' : formatarBRL('100,00')
            }));
        }

        setParceiroEditado((prevParceiroEditado: any) => ({
            ...prevParceiroEditado,
            [name]: value
        }));
    }

    const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorFields(errorFieldsParceiroPadrao);
        try {

            await parceiroService.editarParceiro(parceiroEditado);

            setOpenModal(false);
            setAdicionado(true);
            abrirSnackbar(AlertType.Success, 'Taxa do usuário editada com sucesso!')
        } catch (error: any) {
            if (error.response && error.response.data) {
                setAlerta({ mensagem: error.response.data.message, tipo: AlertType.Error });
                setErrorFields((prevErrorFields) => (
                    { ...prevErrorFields, [error.response.data.path]: true }
                ))
            }
            console.error(error);
        }
    }

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-titulo"
            aria-describedby="modal-modal-descricao"
        >
            <Box component='form' className='modalBox' onSubmit={(event: React.FormEvent<HTMLFormElement>) => handleSubmitEdit(event)} >
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                    <Typography variant="h6" fontWeight={600}>{parceiroEditado.razao_social}</Typography>
                    <Close sx={{ cursor: 'pointer' }} onClick={handleClose} />
                </Box>
                <Divider />
                <Typography fontWeight={600} variant='h6'>
                    Taxa de Participação
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ width: '50%' }}>
                        <InputLabel color="secondary" id="label-taxa_tipo">Tipo</InputLabel>
                        <Select
                            error={errorFields.taxa_tipo}
                            labelId="label-taxa_tipo"
                            id="select-taxa_tipo"
                            value={parceiroEditado?.taxa_tipo}
                            name="taxa_tipo"
                            label="Tipo"
                            color="secondary"
                            required
                            onChange={(event) => handleChangeParceiro(event)}
                        >
                            <MenuItem value={"Fixa"}>Taxa Fixa</MenuItem>
                            <MenuItem value={"Variável"}>Taxa Variável</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        error={errorFields.taxa_valor}
                        sx={{ width: '50%' }}
                        placeholder={parceiroEditado?.taxa_tipo == 'Variável' ? '%' : 'R$'}
                        required
                        id="taxa_valor"
                        name="taxa_valor"
                        label={parceiroEditado?.taxa_tipo == 'Variável' ? 'Taxa (%)' : 'Valor Fixo'}
                        autoFocus
                        color="secondary"
                        value={parceiroEditado?.taxa_valor}
                        onChange={(event) => handleChangeParceiro(event)}
                    />
                </Box>
                {alerta.mensagem && (
                    <Alert sx={{ width: '100%' }} severity={alerta.tipo}>{alerta.mensagem}</Alert>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ mt: 1 }}
                >
                    Salvar
                </Button>
            </Box>
        </Modal>
    )
}