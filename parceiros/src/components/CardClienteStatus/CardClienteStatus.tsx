import { Typography } from "@mui/material";
import COLORS from "../../constants/colors";

export default function CardClienteStatus({ status, status_pagamento }: any) {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Em Negociação':
                return COLORS.blue;
            case 'Venda Realizada':
                return COLORS.green;
            case 'Venda Perdida':
                return COLORS.red;
            default:
                return COLORS.purple;
        }
    };

    const getStatusPagamentoColor = (status: string) => {
        switch (status) {
            case 'Não Pago':
                return COLORS.red;
            case 'Pago':
                return COLORS.green;
            default:
                return COLORS.purple;
        }
    };

    return (
        <Typography variant="h6" sx={{ display: 'flex', gap: 1, mt: 2, width: 'fit-content', cursor: 'initial' }}>
            <Typography
                sx={{
                    color: getStatusColor(status),
                    fontWeight: 700
                }}
            >
                {status}
            </Typography>
            <Typography>|</Typography>
            <Typography
                sx={{
                    color: getStatusPagamentoColor(status_pagamento),
                    fontWeight: 700
                }}
            >
                {status_pagamento}
            </Typography>
        </Typography>
    )
}