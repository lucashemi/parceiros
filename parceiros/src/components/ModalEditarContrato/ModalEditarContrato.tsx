import * as React from 'react';
import { Box, Modal } from "@mui/material";
import AlertType from '../../enums/AlertType';
import { useSnackbarContext } from '../../context/SnackbarContext';
import Contrato from '../../interfaces/Contrato';
import ContratoService from '../../services/ContratoService';
import TabelaEditarContrato from '../TabelaEditarContrato/TabelaEditarContrato';
import FormEditarContrato from '../FormEditarContrato/FormEditarContrato';

const contratoService = new ContratoService();

export default function ModalEditarContrato({ openModal, setOpenModal, parceiroEditado }: any) {
    const { abrirSnackbar } = useSnackbarContext();

    const [contratos, setContratos] = React.useState<Contrato[]>([]);
    const [adicionado, setAdicionado] = React.useState(false);

    const handleClose = () => setOpenModal(false);

    async function buscarContratos() {
        try {
            const response = await contratoService.buscarContratos(parceiroEditado.id);

            setContratos(response.data.contratos);
            setAdicionado(false);
        } catch (error: any) {
            console.error(error)
            abrirSnackbar(AlertType.Error, error.response.data.message)
        }
    }

    React.useEffect(() => {
        buscarContratos();
    }, [adicionado])

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            aria-labelledby="modal-modal-titulo"
            aria-describedby="modal-modal-descricao"
        >
            <Box className='modalBox'>
                <FormEditarContrato 
                    setAdicionado={setAdicionado}
                    handleClose={handleClose}
                    parceiroEditado={parceiroEditado}
                />
                <TabelaEditarContrato
                    contratos={contratos}
                    setAdicionado={setAdicionado}
                    parceiroEditado={parceiroEditado}
                />
            </Box>
        </Modal>
    )
}