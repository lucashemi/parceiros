import React, { useState } from "react";
import { Alert, Box, Button } from "@mui/material";
import UserService from "../services/UserService";
import Layout from "../components/Layout/Layout";
import AlertType from "../enums/AlertType";
import { useSnackbarContext } from "../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import SenhaService from "../services/SenhaService";
import PasswordField from "../components/PasswordField/PasswordField";
import errorFieldsAlterarSenhaPadrao from "../constants/errorFieldsAlterarSenhaPadrao";

const userService = new UserService();
const senhaService = new SenhaService();

export default function AlterarSenha() {
  const navigate = useNavigate();

  const [errorFields, setErrorFields] = React.useState(errorFieldsAlterarSenhaPadrao);

  const { abrirSnackbar } = useSnackbarContext();

  const [passwords, setPasswords] = React.useState(['', '', '']);
  const [erro, setErro] = useState("");

  const handleChangePassword = (event: any, i: any) => {
    const newPasswords = [...passwords];
    newPasswords[i] = event.target.value;
    setPasswords(newPasswords)
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorFields(errorFieldsAlterarSenhaPadrao);
    try {
      if (passwords[1] !== passwords[2]) {
        setErro("A senha de confirmação está diferente da nova senha!")
        setErrorFields((prevErrorFields) => (
          { ...prevErrorFields, passwordConfirmation: true }
        ))
        return
      }

      const dados = {
        senhaAtual: passwords[0],
        password: passwords[1]
      }

      await senhaService.alterarSenha(dados, userService.ehUsuario());

      abrirSnackbar(AlertType.Success, "Senha alterada com sucesso!")
      navigate("/")
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message)
        setErrorFields((prevErrorFields) => (
          { ...prevErrorFields, [error.response.data.path]: true }
        ))
      }
      console.error(error);
    }
  };

  return (
    <Layout titulo="Alterar Senha">
      <Box
        component="form"
        onSubmit={handleSubmit}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            gap: 3
          }}
        >
          <PasswordField
            error={errorFields.senhaAtual}
            value={passwords[0]}
            name="senhaAtual"
            label="Senha Atual"
            id="senhaAtual"
            onChange={(event: any) => { handleChangePassword(event, 0) }}
            sx={{ flexBasis: '33%' }}
          />
          <PasswordField
            error={errorFields.password}
            value={passwords[1]}
            name="password"
            label="Nova Senha"
            id="password"
            onChange={(event: any) => { handleChangePassword(event, 1) }}
            sx={{ flexBasis: '33%' }}
          />
          <PasswordField
            error={errorFields.passwordConfirmation}
            value={passwords[2]}
            name="passwordConfirmation"
            label="Confirmar Nova Senha"
            id="passwordConfirmation"
            onChange={(event: any) => { handleChangePassword(event, 2) }}
            sx={{ flexBasis: '33%' }}
          />
        </Box>
        {erro && (
          <Alert severity="error">{erro}</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          color="secondary"
        >
          Alterar senha
        </Button>
      </Box>
    </Layout>
  )
}