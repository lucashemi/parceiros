import { TextField } from "@mui/material";
import Fieldset from "../Fieldset/Fieldset";
import LogoMarcaField from "../LogoMarcaField/LogoMarcaField";

const inputWidth = '100%';

export default function DadosDaMarca({ cliente, handleChange, errorFields }: any) {
    return (
        <Fieldset legend="Dados da marca">
                <TextField
                    error={errorFields.marca}
                    sx={{ flexBasis: inputWidth }}
                    required
                    label="Nome da Marca"
                    id="marca"
                    name="marca"
                    color="secondary"
                    value={cliente?.marca}
                    onChange={(event) => handleChange(event)}
                />
                <LogoMarcaField
                    cliente={cliente}
                    handleChange={handleChange}
                />
            </Fieldset>
    )
}