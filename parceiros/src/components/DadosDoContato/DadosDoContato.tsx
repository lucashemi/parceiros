import * as React from 'react'
import { TextField } from "@mui/material";
import Fieldset from "../Fieldset/Fieldset";
import AutocompleteBar from "../AutocompleteBar/AutocompleteBar";
import TextMaskCustom from "../TextMaskCustom/TextMaskCustom";
import Usuario from '../../interfaces/Usuario';
import Perfil from "../../enums/Perfil";
import UsuarioService from "../../services/UsuarioService";
import { useSnackbarContext } from '../../context/SnackbarContext';
import AlertType from '../../enums/AlertType';

const usuarioService = new UsuarioService();

const inputWidth = '100%';

export default function DadosDoContato({ disabledDocument = false, disabledConsultores = false, parceiro, handleChange, errorFields }: any) {
    const { abrirSnackbar } = useSnackbarContext();

    const [consultores, setConsultores] = React.useState<Usuario[]>([]);
    const [consultoresFiltrados, setConsultoresFiltrados] = React.useState<Usuario[]>([]);

    const [busca, setBusca] = React.useState('');
    const [ultimaBusca, setUltimaBusca] = React.useState('');

    const aoMudarFiltro = (valor: string, dadosBuscados: boolean = false) => {
        if (!dadosBuscados) {
            buscarConsultores(valor);
        }
        const opcoesFiltradas = consultores?.filter(consultor =>
            consultor.nome.toLowerCase().includes(valor.toLowerCase())
        );
        setConsultoresFiltrados(opcoesFiltradas);
        setUltimaBusca(valor);
    }

    const buscarConsultores = async (valor = '') => {
        try {
            const response = await usuarioService.buscarUsuarios(1, valor, Perfil.Consultor);

            setConsultores(response.data.usuarios);
        } catch (error: any) {
            console.error(error)
            abrirSnackbar(AlertType.Error, error.response.data.message)
        }
    };

    React.useEffect(() => {
        buscarConsultores();
    }, []);

    React.useEffect(() => {
        setConsultoresFiltrados(consultoresFiltrados)
        aoMudarFiltro(ultimaBusca, true);
    }, [consultores]);

    const aoSelecionar = (_e: any, v: any) => {
        setBusca(v);
        const consultor = consultoresFiltrados.find((consultor: any) => consultor.nome === v);
        let event = {
            target: {
                name: "consultor_id",
                value: consultor ? consultor.id : ""
            }
        };
        handleChange(event);
    }

    return (
        <Fieldset legend="Dados do contato">
            <TextField
                error={errorFields.documento}
                disabled={disabledDocument}
                sx={{ flexBasis: inputWidth }}
                required
                label="CPF/CNPJ"
                id="documento"
                name="documento"
                autoFocus
                color="secondary"
                value={parceiro?.documento}
                onChange={(event) => handleChange(event)}
                InputProps={{
                    inputComponent: TextMaskCustom as any
                }}
            />
            <TextField
                error={errorFields.razao_social}
                sx={{ flexBasis: inputWidth }}
                required
                label="Nome/Razão Social"
                id="razao_social"
                name="razao_social"
                color="secondary"
                value={parceiro?.razao_social}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.nome}
                sx={{ flexBasis: inputWidth }}
                required
                label="Nome Contato"
                id="nome"
                name="nome"
                color="secondary"
                value={parceiro?.nome}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.email}
                sx={{ flexBasis: inputWidth }}
                required
                label="E-mail"
                id="email"
                name="email"
                color="secondary"
                value={parceiro?.email}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.tel1}
                sx={{ flexBasis: inputWidth }}
                required
                label="Telefone 1"
                id="tel1"
                name="tel1"
                color="secondary"
                value={parceiro?.tel1}
                onChange={(event) => handleChange(event)}
                InputProps={{
                    inputComponent: TextMaskCustom as any
                }}
            />
            <TextField
                error={errorFields.tel2}
                sx={{ flexBasis: inputWidth }}
                label="Telefone 2"
                id="tel2"
                name="tel2"
                color="secondary"
                value={parceiro?.tel2}
                onChange={(event) => handleChange(event)}
                InputProps={{
                    inputComponent: TextMaskCustom as any
                }}
            />
            {!disabledConsultores && (
                <AutocompleteBar
                    aoMudarFiltro={aoMudarFiltro}
                    opcoes={["", ...consultoresFiltrados.map((consultor: any) => consultor.nome)]}
                    valor={consultoresFiltrados?.find((consultor: any) => consultor.id == parceiro.consultor_id)?.nome || busca} //consultoresFiltrados?.find((consultor: any) => consultor.id == parceiro.consultor_id)?.nome
                    aoSelecionar={aoSelecionar}
                    estilos={{ width: '100%' }}
                    label={"Consultor *"}
                />)}
        </Fieldset>
    )
}

