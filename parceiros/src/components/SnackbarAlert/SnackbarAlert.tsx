import { Alert, Snackbar, useMediaQuery } from "@mui/material";
import { useSnackbarContext } from "../../context/SnackbarContext";

export default function SnackbarAlert({ id, tipo, mensagem, index }: any) {
    const position = index * 4;
    const distance = position.toString() + "rem";
    
    const isMobile = useMediaQuery('(max-width:600px)');
    const vertical = isMobile ? 'bottom' : 'top';
    const marginType = isMobile ? 'marginBottom' : 'marginTop';
    
    const { removerSnackbar } = useSnackbarContext();
    
    const handleCloseSnackbar = (_event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        removerSnackbar(id);
    };

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal: 'right' }}
            open={true}
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
            sx={{ [marginType]: distance }}
        >
            <Alert
                onClose={handleCloseSnackbar}
                severity={tipo}
                variant="filled"
                sx={{ width: '100%' }}
            >
                {mensagem}
            </Alert>
        </Snackbar>
    )
}