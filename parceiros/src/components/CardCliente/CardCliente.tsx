import { Box, Button, Card, CardActions, Divider } from "@mui/material";
import mascaraDocumento from "../../utils/mascaraDocumento";
import CardContentDrag from '../CardContentDrag/CardContentDrag';
import clientePadrao from "../../constants/clientePadrao";
import formatarBRL from "../../utils/formatarBRL";
import TituloCard from "../TituloCard/TituloCard";
import TextoCard from "../TextoCard/TextoCard";
import CardClienteStatus from "../CardClienteStatus/CardClienteStatus";
import { formatarData } from "../../utils/dataUtils";
import Images from '../../assets/images';

export default function CardCliente({ cliente = clientePadrao, administrador = false }: any) {

    return (
        <Card
            variant="outlined"
            sx={{
                flexBasis: 'calc(50% - 16px)',
                '@media (max-width: 1200px)': {
                    flexBasis: 'calc(100% - 16px)'
                },
                maxWidth: '100%'
            }}
        >
            <Box sx={{ paddingX: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', maxHeight: '25%', minHeight: '25%', minWidth: '25%', maxWidth: '25%' }}>
                        <img style={{ width: '100%' }} referrerPolicy="no-referrer" src={cliente.link_logomarca ?? Images.semFoto} />
                    </Box>
                    <CardContentDrag>
                        <TituloCard>#{cliente.id}-Marca: {cliente.marca}</TituloCard>
                        {administrador && <TextoCard>Parceiro: <strong>{cliente.parceiro_razao_social}</strong></TextoCard>}
                        <TextoCard>Razão Social: {cliente.razao_social}</TextoCard>
                        <TextoCard>CPF/CNPJ: {mascaraDocumento(cliente.documento)}</TextoCard>
                        <TextoCard>Data Indicação: {formatarData(cliente.data_indicacao)}</TextoCard>
                        <TextoCard>Data do Pagamento: {cliente.data_pagamento ? cliente.data_pagamento : '-'}</TextoCard>
                        <TextoCard>Valor da Participação: {cliente.valor_participacao ? formatarBRL(cliente.valor_participacao) : '-'}</TextoCard>
                        {administrador && <TextoCard>Consultor: {cliente.consultor_nome}</TextoCard>}
                        <CardClienteStatus status={cliente.status} status_pagamento={cliente.status_pagamento} />
                    </CardContentDrag>
                </Box>
            </Box>
            <Divider />
            <CardActions sx={{ display: 'flex', justifyContent: 'space-evenly', alignItems: 'stretch' }}>
                <Button color="secondary" variant="contained" href={cliente.link_comprovante}>Comprovante</Button>
            </CardActions>
        </Card>
    )
}