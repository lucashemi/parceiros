import { Typography } from "@mui/material";

export default function TextoCard({ children, gray = true }: any) {

    return (
        <Typography 
            variant="body1" 
            color={gray ? 'rgba(33, 37, 41, 0.75)' : "initial"}
            fontWeight={gray ? "initial" : 700}
            sx={{ 
                whiteSpace: "nowrap",
                lineHeight: "26px",
                width: 'fit-content',
                cursor: 'initial',
            }}
        >
            {children}
        </Typography>
    )
}