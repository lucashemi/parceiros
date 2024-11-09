import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import StatusPagamento from "../../enums/StatusPagamento";

export default function FiltroStatusPagamentoIndicacao({ filtro, setFiltro, inputWidth = "calc(25% - 16px)" }: any) {
    return (
        <FormControl sx={{ flexBasis: { xs: '100%', sm: '100%', md: inputWidth }, mt: 2 }}>
            <InputLabel color="secondary" id="label-status">Status Pagamento</InputLabel>
            <Select
                labelId="label-status-pagamento"
                id="select-status-pagamento"
                value={filtro}
                name="status-pagamento"
                label="Status Pagamento"
                color="secondary"
                required
                onChange={(event) => setFiltro(event.target.value)}
            >
                <MenuItem value={""}>Qualquer status</MenuItem>
                <MenuItem value={StatusPagamento.NaoPago}>{StatusPagamento.NaoPago}</MenuItem>
                <MenuItem value={StatusPagamento.Pago}>{StatusPagamento.Pago}</MenuItem>
            </Select>
        </FormControl>
    )
}