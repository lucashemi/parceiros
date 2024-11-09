import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Alert, Button, Card, CardContent, InputLabel, List, ListItem, Typography } from "@mui/material";
import UserService from "../services/UserService";
import SenhaService from "../services/SenhaService";
import criteriosSenha from "../data/criteriosSenha";
import PasswordField from "../components/PasswordField/PasswordField";
import AlertType from "../enums/AlertType";
import { useSnackbarContext } from "../context/SnackbarContext";

const userService = new UserService();
const senhaService = new SenhaService();

export default function primeiroAcesso() {
  const navigate = useNavigate();

  const [password, setPassword] = React.useState('');
  const [erro, setErro] = useState();

  const { abrirSnackbar } = useSnackbarContext();

  const handleChange = (event: any, setState: Function) => {
    setState(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const dados = {
        password: password
      }

      await senhaService.alterarSenha(dados, userService.ehUsuario());

      abrirSnackbar(AlertType.Success, "Senha cadastrada com sucesso!");

      return navigate("/");
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message)
      }
      console.error(error);
    }
  };

  return (
    <Card sx={{ width: { xs: 'fit-content', sm: 500, md: 500}, margin: 'auto', mt: 10 }}>
      <CardContent>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>Seja bem vindo!</Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Para garantir acesso a aplicação a qualquer momento é necessária a criação de uma <strong>senha</strong>. Você poderá alterá-la depois.
        </Typography>
        <Typography variant="body1" sx={{ mt: 1 }}>
          Sua senha <strong>deve</strong> conter:
        </Typography>
        <List>
          {criteriosSenha.map((criterio, index) => (
            <ListItem key={index} sx={{ py: 0, fontWeight: 700 }}>
              {criterio}
            </ListItem>
          ))}
        </List>
        <form onSubmit={handleSubmit}>
          <InputLabel sx={{ mt: 1 }}>Crie uma senha:</InputLabel>
          <PasswordField
            error={erro ? true : false}
            value={password}
            name="password"
            label="Senha"
            id="password"
            onChange={(event: any) => { handleChange(event, setPassword) }}
          />
          {erro && (
            <Alert severity="error">{erro}</Alert>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ my: 2 }}
            color="secondary"
          >Criar senha</Button>
        </form>
      </CardContent>
    </Card>
  )
}