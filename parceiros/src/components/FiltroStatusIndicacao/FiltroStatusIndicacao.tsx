import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import StatusIndicacao from "../../enums/StatusIndicacao";

export default function FiltroStatusIndicacao({ filtro, setFiltro, inputWidth = "calc(25% - 16px)" }: any) {
    return (
        <FormControl sx={{ flexBasis: { xs: '100%', sm: '100%', md: inputWidth }, mt: 2 }}>
            <InputLabel color="secondary" id="label-status">Status</InputLabel>
            <Select
                labelId="label-status"
                id="select-status"
                value={filtro}
                name="status"
                label="Status"
                color="secondary"
                required
                onChange={(event) => setFiltro(event.target.value)}
            >
                <MenuItem value={""}>Qualquer status</MenuItem>
                <MenuItem value={StatusIndicacao.EmNegociacao}>{StatusIndicacao.EmNegociacao}</MenuItem>
                <MenuItem value={StatusIndicacao.VendaRealizada}>{StatusIndicacao.VendaRealizada}</MenuItem>
                <MenuItem value={StatusIndicacao.VendaPerdida}>{StatusIndicacao.VendaPerdida}</MenuItem>
            </Select>
        </FormControl>
    )
}