import * as React from "react";
import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import Usuario from "../../interfaces/Usuario";
import AlertType from "../../enums/AlertType";
import usuarioPadrao from "../../constants/usuarioPadrao";
import UsuarioService from "../../services/UsuarioService";
import errorFieldsUsuarioPadrao from "../../constants/errorFieldsUsuarioPadrao";

const usuarioService = new UsuarioService();

const inputWidth = 'calc(20% - 16px)';

export default function RegisterUserForm({ setAdicionado }: any) {
    const [usuario, setUsuario] = React.useState<Usuario>(usuarioPadrao);
    const [alerta, setAlerta] = React.useState<{ mensagem: string, tipo: AlertType | undefined }>({ mensagem: "", tipo: undefined });

    const [errorFields, setErrorFields] = React.useState(errorFieldsUsuarioPadrao);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setUsuario((prevUsuario): any => ({
            ...prevUsuario,
            [name]: value
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorFields(errorFieldsUsuarioPadrao);
        try {
            await usuarioService.criarUsuario(usuario);

            setAdicionado(true);
            setAlerta({ mensagem: "Usuário cadastrado com sucesso!", tipo: AlertType.Success });
        } catch (error: any) {
            if (error.response && error.response.data) {
                setAlerta({ mensagem: error.response.data.message, tipo: AlertType.Error });
                setErrorFields((prevErrorFields) => (
                    { ...prevErrorFields, [error.response.data.path]: true }
                ))
            }
            console.error(error);
        }
    };

    return (
        <>
            <Typography variant="h5">
                Cadastrar usuário
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{
                mt: 1,
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                gap: 2,
            }}>
                <TextField
                    error={errorFields.nome}
                    sx={{ flexBasis: inputWidth }}
                    required
                    id="nome"
                    label="Nome"
                    name="nome"
                    autoComplete="givenName"
                    autoFocus
                    color="secondary"
                    value={usuario?.nome}
                    onChange={(event) => handleChange(event)}
                />
                <TextField
                    error={errorFields.email}
                    sx={{ flexBasis: inputWidth }}
                    required
                    name="email"
                    label="E-mail"
                    type="email"
                    id="email"
                    color="secondary"
                    value={usuario?.email}
                    onChange={(event) => handleChange(event)}
                />
                <FormControl sx={{ flexBasis: inputWidth }}>
                    <InputLabel color="secondary" id="label-perfil">Perfil</InputLabel>
                    <Select
                        error={errorFields.perfil}
                        labelId="label-perfil"
                        id="select-perfil"
                        value={usuario?.perfil}
                        name="perfil"
                        label="Perfil"
                        color="secondary"
                        required
                        onChange={(event) => handleChange(event)}
                    >
                        <MenuItem value={"Administrador"}>Administrador</MenuItem>
                        <MenuItem value={"Consultor"}>Consultor</MenuItem>
                        <MenuItem value={"Operador"}>Operador</MenuItem>
                    </Select>
                </FormControl>
                <FormControl sx={{ flexBasis: inputWidth }}>
                    <InputLabel color="secondary" id="label-setor">Setor</InputLabel>
                    <Select
                        error={errorFields.setor}
                        labelId="label-setor"
                        id="select-setor"
                        value={usuario?.setor}
                        name="setor"
                        label="Setor"
                        color="secondary"
                        required
                        onChange={(event) => handleChange(event)}
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
                    sx={{ flexBasis: inputWidth }}
                    required
                    name="token_bc"
                    label="Token Bom Controle"
                    type="text"
                    id="token_bc"
                    color="secondary"
                    value={usuario?.token_bc}
                    onChange={(event) => handleChange(event)}
                />
                {alerta.mensagem && (
                    <Alert sx={{ width: '100%' }} severity={alerta.tipo}>{alerta.mensagem}</Alert>
                )}
                <Button
                    type="submit"
                    variant="contained"
                    color="secondary"
                    sx={{ mb: 3 }}
                >
                    Adicionar
                </Button>
            </Box>
        </>
    )
}