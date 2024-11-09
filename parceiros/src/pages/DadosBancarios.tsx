import React, { useState } from "react";
import { Alert, Box, Button, TextField } from "@mui/material";
import Layout from "../components/Layout/Layout";
import AlertType from "../enums/AlertType";
import { useSnackbarContext } from "../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import TextMaskCustom from "../components/TextMaskCustom/TextMaskCustom";
import ParceiroService from "../services/ParceiroService";
import UserService from "../services/UserService";
import errorFieldsParceiroPadrao from "../constants/errorFieldsParceiroPadrao";

const userService = new UserService();
const parceiroService = new ParceiroService();

export default function DadosBancarios() {
  const user = userService.getUser();
  const navigate = useNavigate();

  const { abrirSnackbar } = useSnackbarContext();

  const [parceiro, setParceiro] = React.useState(user) as any;
  const [erro, setErro] = useState("");

  const [errorFields, setErrorFields] = React.useState(errorFieldsParceiroPadrao);

  const handleChange = async (event: any) => {
    const { name, value } = event.target;
    setParceiro((prevParceiro: any) => ({
      ...prevParceiro,
      [name]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorFields(errorFieldsParceiroPadrao);
    try {
      await parceiroService.editarParceiro(parceiro);

      await userService.token();
      abrirSnackbar(AlertType.Success, "Dados bancários alterados com sucesso!")
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
    <Layout titulo="Dados Bancários">
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
          <TextField
            error={errorFields.pix}
            margin="normal"
            required
            fullWidth
            name="pix"
            label="Chave PIX"
            type="text"
            id="pix"
            color="secondary"
            sx={{ flexBasis: '20%' }}
            value={parceiro.pix}
            onChange={(event) => { handleChange(event) }}
            InputProps={{
              inputComponent: TextMaskCustom as any
            }}
          />
          <TextField
            error={errorFields.titular}
            margin="normal"
            required
            fullWidth
            name="titular"
            label="Nome do Titular da Chave PIX"
            type="text"
            id="titular"
            color="secondary"
            sx={{ flexBasis: '20%' }}
            value={parceiro.titular}
            onChange={(event) => { handleChange(event) }}
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
          Salvar
        </Button>
      </Box>
    </Layout>
  )
}