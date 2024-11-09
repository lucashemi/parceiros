import * as React from 'react';
import { Box, TextField } from '@mui/material';

export default function SearchBar({ aoMudarFiltro, inputWidth = "calc(25% - 16px)" }: any) {
    const [busca, setBusca] = React.useState('');

    const aoFiltrar = (valor: any) => {
        if (valor) {
            setBusca(valor);
            aoMudarFiltro(valor);
        } else {
            setBusca("");
            aoMudarFiltro("");
        }
    }

    return (
        <Box sx={{ width: { sm: '100%', md: inputWidth }, mb: 2, }}>
            <TextField
                id="searchBar"
                label="Buscar"
                color="secondary"
                value={busca}
                onChange={(e) => aoFiltrar(e.target.value)}
                sx={{ width: '100%' }}
            />
        </Box>
    );
}