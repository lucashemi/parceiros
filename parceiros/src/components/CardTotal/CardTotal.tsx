import { Card, Tooltip, Typography } from "@mui/material";

export default function CardTotal({ bgcolor, color, titulo, valor, texto }: any) {

    return (
        <Tooltip title={texto}>
            <Card
                sx={{
                    width: { xs: '100%', sm: '100%', md: '33%' },
                    bgcolor: bgcolor,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    px: 2,
                    py: 1
                }}>
                <Typography variant="h6" sx={{ color: color }}>{titulo}</Typography>
                <Typography variant="h5" sx={{ color: color }}>{valor}</Typography>
            </Card>
        </Tooltip>
    )
}