import { TextField } from "@mui/material";
import Fieldset from "../Fieldset/Fieldset";

const inputWidth = '100%';

export default function DadosDaMensagem({ cliente, handleChange, errorFields }: any) {
    return (
        <Fieldset legend="Mensagem">
            <TextField
                error={errorFields.mensagem}
                sx={{ flexBasis: inputWidth }}
                label="Mensagem"
                id="mensagem"
                name="mensagem"
                color="secondary"
                multiline
                rows={5}
                value={cliente?.mensagem}
                onChange={(event) => handleChange(event)}
            />
        </Fieldset>
    )
}