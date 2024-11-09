import { Box } from "@mui/material";
import CardTotal from "../CardTotal/CardTotal";
import formatarBRL from "../../utils/formatarBRL";
import COLORS from "../../constants/colors";

export default function CardsTotais({ clientes }: any) {

    const calcularSomaTotal = (filter: string = '') => {
        return formatarBRL(clientes.reduce((acumulador: any, cliente: any) => {
            if (cliente.valor_participacao && (!filter || cliente.status_pagamento == filter)) {
                return acumulador + Number(cliente.valor_participacao);
            }
            return acumulador
        }, 0).toFixed(2).toString())
    }

    return (
        <Box
            sx={{
                display: 'flex',
                width: { xs: '100%', sm: '100%', md: 'calc(50% - 16px)' },
                flexDirection: { xs: 'column', sm: 'column', md: 'row' },
                gap: 1
            }}
        >
            <CardTotal
                bgcolor={COLORS.green}
                color={"white"}
                titulo={"Total"}
                valor={calcularSomaTotal()}
                texto={"Soma total de a receber e total pago"}
            />
            <CardTotal
                bgcolor={COLORS.blue}
                color={"white"}
                titulo={"Total a Receber"}
                valor={calcularSomaTotal("Não Pago")}
                texto={"Total de indicações convertidas em negócio"}
            />
            <CardTotal
                bgcolor={COLORS.red}
                color={"white"}
                titulo={"Total Pago"}
                valor={calcularSomaTotal("Pago")}
                texto={"Total de indicações já pagas a você"}
            />
        </Box>
    )
}