import * as React from 'react';
import Images from '../assets/images';
import { Avatar, Button, CssBaseline, TextField, Paper, Box, Grid, Typography, Alert } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import UserService from '../services/UserService';
import PasswordField from '../components/PasswordField/PasswordField';
import errorFieldsLoginPadrao from '../constants/errorFieldsLoginPadrao';
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const userService = new UserService();

export default function login() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [erro, setErro] = React.useState('');

  const [errorFields, setErrorFields] = React.useState(errorFieldsLoginPadrao);

  const handleChange = (event: any, setState: Function) => {
    setState(event.target.value);
  };

  React.useEffect(() => {
    const newWindowObject = window as any;
    newWindowObject.onGoogleLibraryLoad = async () => {
      const google = newWindowObject.google;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCallbackResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "medium", type: "standard" }
      );
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function handleCallbackResponse(response: any) {
    const userObject: any = jwtDecode(response.credential);
    const user: any = {
      email: userObject.email,
    }

    try {
      const url = "/auth-google";
      const response = await userService.login(url, user);

      if (response.primeiroAcesso) {
        return navigate("/primeiro-acesso");
      } else {
        return navigate("/");
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message)
      }
      if (error.message && error.message == "Network Error") setErro(error.message);
      console.error(error);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorFields(errorFieldsLoginPadrao);
    try {
      const url = "/auth";

      const dados = {
        email: email,
        password: password,
      }

      await userService.login(url, dados);
      return navigate("/");
    } catch (error: any) {
      if (error.response && error.response.data) {
        setErro(error.response.data.message);
        setErrorFields((prevErrorFields) => (
          { ...prevErrorFields, [error.response.data.path]: true }
        ))
      }
      if (error.message && error.message == "Network Error") setErro(error.message);
      console.error(error);
    }
  };

  return (
    <Grid container component="main" sx={{ height: '100vh' }}>
      <CssBaseline />
      <Grid
        item
        xs={false}
        sm={4}
        md={7}
        sx={{
          backgroundImage: `url('${Images.wallpaper}')`,
          backgroundRepeat: 'no-repeat',
          backgroundColor: (t) =>
            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
          sx={{
            my: 12,
            mx: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: { xs: 'calc(100% - 64px)', sm: 'calc(100% - 64px)', md: 'initial' },
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Acesse sua conta
          </Typography>
          <Box component="div" sx={{ mt: 1 }} id="googleButton"></Box>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
            <TextField
              error={errorFields.email}
              margin="normal"
              required
              fullWidth
              id="email"
              label="E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              color="secondary"
              value={email}
              onChange={(event) => handleChange(event, setEmail)}
            />
            <PasswordField
              error={errorFields.password}
              value={password}
              name="password"
              label="Senha"
              id="password"
              onChange={(event: any) => handleChange(event, setPassword)}
            />
            {erro && (
              <Alert severity='error'>{erro}</Alert>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              color="secondary"
            >
              Entrar
            </Button>
          </Box>
        </Box>
      </Grid>
    </Grid>
  );
}