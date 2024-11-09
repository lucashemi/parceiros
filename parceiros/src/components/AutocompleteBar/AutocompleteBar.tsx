import { Autocomplete, TextField } from '@mui/material';

export default function AutocompleteBar({ aoMudarFiltro, opcoes = [], aoSelecionar, label, estilos, valor = "" }: any) {
    return (
        <Autocomplete
            disableClearable
            id="combo-box"
            value={valor}
            options={opcoes}
            onInputChange={(_e: any, v) => {
                aoSelecionar(_e, v);
            }}
            sx={estilos}
            renderInput={(params) => <TextField
                { ...params }
                id="searchBar"
                label={label}
                color="secondary"
                onChange={(e) => aoMudarFiltro(e.target.value || "")}
                sx={{ width: '100%' }}
            />}
        />
    );
}