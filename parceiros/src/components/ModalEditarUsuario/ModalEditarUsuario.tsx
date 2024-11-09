import * as React from 'react';
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Modal, Select, TextField, Typography } from "@mui/material";
import { Close } from "@mui/icons-material";
import AlertType from '../../enums/AlertType';
import './ModalEditarUsuario.css';
import Usuario from '../../interfaces/Usuario';
import { useSnackbarContext } from '../../context/SnackbarContext';
import UsuarioService from '../../services/UsuarioService';
import errorFieldsUsuarioPadrao from '../../constants/errorFieldsUsuarioPadrao';

const usuarioService = new UsuarioService();

export default function ModalEditarUsuario({ openModal, setOpenModal, usuarioEditado, setUsuarioEditado, setAdicionado }: any) {
    const { abrirSnackbar } = useSnackbarContext();
    
    const [errorFields, setErrorFields] = React.useState(errorFieldsUsuarioPadrao);

    const [alerta, setAlerta] = React.useState<{ mensagem: string, tipo: AlertType | undefined }>({ mensagem: "", tipo: undefined });

    const handleClose = () => setOpenModal(false);

    const handleChangeUsuario = (event: any) => {
        const { name, value } = event.target;
        setUsuarioEditado((prevState: Usuario | undefined) => ({
            ...prevState,
            [name]: value
        }))
    };

    const handleSubmitEdit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorFields(errorFieldsUsuarioPadrao);
        try {
            await usuarioService.editarUsuario(usuarioEditado);

            setAdicionado(true);
            setOpenModal(false);
            abrirSnackbar(AlertType.Success, 'Usuário editado com sucesso!')
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
                    <Typography variant="h6" fontWeight={600}>Editar usuário</Typography>
                    <Close sx={{ cursor: 'pointer' }} onClick={handleClose} />
                </Box>
                <TextField
                    error={errorFields.nome}
                    className='modalBoxInput'
                    required
                    id="nome"
                    label="Nome"
                    name="nome"
                    autoComplete="givenName"
                    autoFocus
                    color="secondary"
                    value={usuarioEditado.nome}
                    onChange={(event) => handleChangeUsuario(event)}
                />
                <TextField
                    error={errorFields.email}
                    className='modalBoxInput'
                    required
                    name="email"
                    label="E-mail"
                    type="email"
                    id="email"
                    color="secondary"
                    value={usuarioEditado.email}
                    onChange={(event) => handleChangeUsuario(event)}
                />
                <FormControl className='modalBoxInput'>
                    <InputLabel color="secondary" id="label-perfil">Perfil</InputLabel>
                    <Select
                        error={errorFields.perfil}
                        labelId="label-perfil"
                        id="select-perfil"
                        value={usuarioEditado.perfil}
                        label="Perfil"
                        name="perfil"
                        color="secondary"
                        required
                        onChange={(event) => handleChangeUsuario(event)}
                    >
                        <MenuItem value={"Administrador"}>Administrador</MenuItem>
                        <MenuItem value={"Consultor"}>Consultor</MenuItem>
                        <MenuItem value={"Operador"}>Operador</MenuItem>
                    </Select>
                </FormControl>
                <FormControl className='modalBoxInput'>
                    <InputLabel color="secondary" id="label-setor">Setor</InputLabel>
                    <Select
                        error={errorFields.setor}
                        labelId="label-setor"
                        id="select-setor"
                        value={usuarioEditado.setor}
                        label="Setor"
                        name="setor"
                        color="secondary"
                        required
                        onChange={(event) => handleChangeUsuario(event)}
                    >
                        <MenuItem value={"Comercial"}>Comercial</MenuItem>
                        <MenuItem value={"Gestão de Contas"}>Gestão de Contas</MenuItem>
                        <MenuItem value={"Financeiro"}>Financeiro</MenuItem>
                        <MenuItem value={"RH"}>RH</MenuItem>
                        <MenuItem value={"TI"}>TI</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    error={errorFields.token_bc}
                    className='modalBoxInput'
                    required
                    name="token_bc"
                    label="Token Bom Controle"
                    type="text"
                    id="token_bc"
                    color="secondary"
                    value={usuarioEditado.token_bc}
                    onChange={(event) => handleChangeUsuario(event)}
                />
                {alerta.mensagem && (
                    <Alert sx={{ width: '100%' }} severity={alerta.tipo}>{alerta.mensagem}</Alert>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ mb: 1 }}
                >
                    Editar
                </Button>
            </Box>
        </Modal>
    )
}