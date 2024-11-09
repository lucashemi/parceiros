import { Typography } from "@mui/material";

export default function TituloCard({ children }: any) {

    return (
        <Typography 
            variant="h6" 
            fontWeight={700} 
            sx={{ 
                whiteSpace: "nowrap", 
                width: 'fit-content', 
                cursor: 'initial' 
            }}
        >
            {children}
        </Typography>
    )
}