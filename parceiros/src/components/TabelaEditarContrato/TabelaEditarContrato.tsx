import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Link } from 'react-router-dom';
import Loading from '../Loading/Loading';
import ContratoService from '../../services/ContratoService';
import { useSnackbarContext } from '../../context/SnackbarContext';
import AlertType from '../../enums/AlertType';

const contratoService = new ContratoService();

export default function TabelaEditarContrato({ contratos, setAdicionado, parceiroEditado }: any) {
    const { abrirSnackbar } = useSnackbarContext();

    const aoDeletar = async (idContrato: any) => {
        try {

            await contratoService.deletarContrato(parceiroEditado.id, idContrato);

            setAdicionado(true);
            abrirSnackbar(AlertType.Warning, "Contrato excluido!")
        } catch (error: any) {
            console.error(error)
            abrirSnackbar(AlertType.Error, error.response.data.message)
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ display: 'flex', justifyContent: 'space-around' }}>
                        <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Comprovante</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>Excluir</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody sx={{ display: 'block', maxHeight: 250, overflowY: "auto" }}>
                    {contratos ? contratos.map((contrato: any) => (
                        <TableRow
                            key={contrato.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">
                                {contrato.data}
                            </TableCell>
                            <TableCell>
                                <Link to={contrato.url} target='_blank'>
                                    {contrato.nome}
                                </Link>
                            </TableCell>
                            <TableCell>
                                <Button
                                    sx={{ color: '#f00', textDecoration: 'underline', textTransform: 'initial' }}
                                    onClick={() => aoDeletar(contrato.id)}
                                >
                                    Excluir
                                </Button>
                            </TableCell>
                        </TableRow>
                    )) : <Loading />}
                </TableBody>
            </Table>
        </TableContainer>
    )
}