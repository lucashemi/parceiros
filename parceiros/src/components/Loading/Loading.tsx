import { Box, CircularProgress } from "@mui/material";

export default function Loading() {
    return (
        <Box component={'div'} sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
        }}>
            <CircularProgress color="secondary" />
        </Box>
    )
}