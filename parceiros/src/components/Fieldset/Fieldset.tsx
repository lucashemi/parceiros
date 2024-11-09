import { Box } from "@mui/material";

const boxWidth = { xs: 'calc(100% - 16px)', sm: 'calc(100% - 16px)', md: 'calc(50% - 16px)'}

export default function Fieldset({ children, legend }: any) {
    return (
        <Box component="fieldset" sx={{
            display: 'flex',
            flexWrap: 'wrap',
            flexDirection: { xs: 'column', sm: 'column', md: 'row' },
            width: boxWidth,
            gap: 2,
            color: '#9c27b0',
            borderColor: '#9c27b0',
            borderRadius: '0.3rem',
            padding: 2
        }}>
            <legend>{legend}</legend>
            {children}
        </Box>
    )
}