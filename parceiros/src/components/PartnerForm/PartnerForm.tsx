import * as React from "react";
import { Alert, Box, Button, Typography } from "@mui/material";
import AlertType from "../../enums/AlertType";
import Parceiro from "../../interfaces/Parceiro";
import { useNavigate } from "react-router-dom";
import parceiroPadrao from "../../constants/parceiroPadrao";
import { useSnackbarContext } from "../../context/SnackbarContext";
import buscarCep from "../../utils/buscarCep";
import ParceiroService from "../../services/ParceiroService";
import DadosDoContato from "../DadosDoContato/DadosDoContato";
import DadosDoEndereco from "../DadosDoEndereco/DadosDoEndereco";
import errorFieldsParceiroPadrao from "../../constants/errorFieldsParceiroPadrao";
import UserService from "../../services/UserService";

const userService = new UserService();
const parceiroService = new ParceiroService();

export default function PartnerForm({ disabledDocument = false, disabledConsultores = false, parceiroParam = parceiroPadrao, setEditando, editando = false, setAbrirForm, setAdicionado }: any) {
    const navigate = useNavigate();

    const [parceiro, setParceiro] = React.useState<Parceiro>(parceiroParam);

    const [errorFields, setErrorFields] = React.useState(errorFieldsParceiroPadrao);

    const [erroAdicionar, setErroAdicionar] = React.useState('');
    const [tipoMensagemAdicionar, setTipoMensagemAdicionar] = React.useState<AlertType>();

    const { abrirSnackbar } = useSnackbarContext();

    const handleChange = async (event: any) => {
        const { name, value } = event.target;
        let endereco: any;
        if (name == 'endereco.cep') {
            endereco = await buscarCep(event);
        }
        if (name.startsWith('endereco.')) {
            const enderecoField = name.split('.')[1];
            const novoEndereco = { ...parceiro.endereco, ...endereco, [enderecoField]: value };
            setParceiro(prevParceiro => ({
                ...prevParceiro,
                endereco: novoEndereco
            }));
        } else {
            setParceiro(prevParceiro => ({
                ...prevParceiro,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorFields(errorFieldsParceiroPadrao);
        try {

            editando ?
                await parceiroService.editarParceiro(parceiro)
                : 
                await parceiroService.criarParceiro(parceiro);

            if (disabledDocument) {
                await userService.token();
                abrirSnackbar(AlertType.Success, "Perfil editado com sucesso!");
                navigate('/');
            } else {
                setAdicionado(true);
                if (editando) {
                    setEditando(false);
                    abrirSnackbar(AlertType.Success, "Parceiro editado com sucesso!");
                } else {
                    abrirSnackbar(AlertType.Success, "Parceiro criado com sucesso!");
                }
                setAbrirForm(false);
            }

        } catch (error: any) {
            if (error.response && error.response.data) {
                setTipoMensagemAdicionar(AlertType.Error);
                setErroAdicionar(error.response.data.message);
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
                {disabledDocument ? "Editar perfil" : (editando ? "Editar parceiro" : "Cadastrar parceiro")}
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{
                mt: 1,
                display: 'flex',
                flexWrap: 'wrap',
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                gap: 2,
            }}>
                <DadosDoContato 
                    disabledDocument={disabledDocument}
                    disabledConsultores={disabledConsultores}
                    parceiro={parceiro}
                    handleChange={handleChange}
                    errorFields={errorFields}
                />
                <DadosDoEndereco 
                    parceiro={parceiro}
                    handleChange={handleChange}
                    errorFields={errorFields}
                />
                {erroAdicionar && (
                    <Alert sx={{ width: '100%' }} severity={tipoMensagemAdicionar}>{erroAdicionar}</Alert>
                )}
                <Box sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    width: '100%',
                    justifyContent: 'center',
                    gap: 10
                }}>
                    {!disabledDocument && <Button
                        type="button"
                        variant="contained"
                        color="secondary"
                        onClick={() => { setAdicionado(true); setEditando(false); setAbrirForm((prevAbrirForm: any) => !prevAbrirForm) }}
                        sx={{ mb: 3, padding: 1.5, width: '25%' }}
                    >
                        Cancelar
                    </Button>}
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        sx={{ mb: 3, padding: 1.5, width: '25%' }}
                    >
                        {editando ? "Salvar" : "Adicionar"}
                    </Button>
                </Box>
            </Box>
        </>
    )
}