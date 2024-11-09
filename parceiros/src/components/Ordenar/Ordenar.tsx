import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const inputWidth = "calc(25% - 16px)";

export default function Ordenar({ ordem, setOrdem }: any) {
    return (
        <FormControl sx={{ flexBasis: { xs: '100%', sm: '100%', md: inputWidth }, mt: 2 }}>
            <InputLabel color="secondary" id="label-status">Ordenar</InputLabel>
            <Select
                labelId="label-status"
                id="select-status"
                value={ordem}
                name="status"
                label="Status"
                color="secondary"
                required
                onChange={(event) => setOrdem(event.target.value)}
            >
                <MenuItem value="DESC">Mais recentes</MenuItem>
                <MenuItem value="ASC">Mais antigos</MenuItem>
            </Select>
        </FormControl>
    )
}