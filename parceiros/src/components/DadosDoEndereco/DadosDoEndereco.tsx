import { TextField } from "@mui/material";
import Fieldset from "../Fieldset/Fieldset";
import TextMaskCustom from "../TextMaskCustom/TextMaskCustom";

const inputWidth = '100%';

export default function DadosDoEndereco({ parceiro, handleChange, errorFields }: any) {
    return (
        <Fieldset legend="Dados do endereço">
            <TextField
                error={errorFields.cep}
                sx={{ flexBasis: inputWidth }}
                required
                label="CEP"
                id="cep"
                name="endereco.cep"
                color="secondary"
                value={parceiro?.endereco?.cep}
                onChange={(event) => handleChange(event)}
                InputProps={{
                    inputComponent: TextMaskCustom as any
                }}
            />
            <TextField
                error={errorFields.logradouro}
                sx={{ flexBasis: inputWidth }}
                required
                label="Logradouro"
                id="logradouro"
                name="endereco.logradouro"
                color="secondary"
                value={parceiro?.endereco?.logradouro}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.numero}
                sx={{ flexBasis: inputWidth }}
                required
                label="Número"
                id="numero"
                name="endereco.numero"
                color="secondary"
                value={parceiro?.endereco?.numero}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.complemento}
                sx={{ flexBasis: inputWidth }}
                label="Complemento"
                id="complemento"
                name="endereco.complemento"
                color="secondary"
                value={parceiro?.endereco?.complemento}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.bairro}
                sx={{ flexBasis: inputWidth }}
                required
                label="Bairro"
                id="bairro"
                name="endereco.bairro"
                color="secondary"
                value={parceiro?.endereco?.bairro}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.municipio}
                sx={{ flexBasis: inputWidth }}
                required
                label="Municipio"
                id="municipio"
                name="endereco.municipio"
                color="secondary"
                value={parceiro?.endereco?.municipio}
                onChange={(event) => handleChange(event)}
            />
            <TextField
                error={errorFields.uf}
                sx={{ flexBasis: inputWidth }}
                required
                label="UF"
                id="uf"
                name="endereco.uf"
                color="secondary"
                value={parceiro?.endereco?.uf}
                onChange={(event) => handleChange(event)}
            />
        </Fieldset>
    )
}

