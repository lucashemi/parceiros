import * as React from 'react'
import { CloudUpload } from "@mui/icons-material"
import { Box, Button, Typography } from "@mui/material"
import VisuallyHiddenInput from "../VisuallyHiddenInput/VisuallyHiddenInput"

export default function LogoMarcaField({ cliente, handleChange }: any) {

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleButtonLogomarca = () => {
        fileInputRef.current?.click();
    }

    return (
        <Box
            component={'fieldset'}
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                color: 'rgba(0, 0, 0, 0.87)',
                border: '1px solid rgb(192, 192, 192)',
                borderRadius: '0.3rem',
                padding: '10.5px 8px',
                width: '100%'
            }}>
            <legend>Logo Marca</legend>
            <Button
                color="secondary"
                variant="contained"
                component="label"
                onChange={handleButtonLogomarca}
                startIcon={<CloudUpload />}
            >
                Escolher arquivo
                <VisuallyHiddenInput
                    name="logomarca"
                    ref={fileInputRef}
                    onChange={(event) => handleChange(event)}
                    type="file"
                    accept=".jpg, .jpeg, .png"
                />
            </Button>
            {cliente?.logomarca && (
                <Typography variant="body1" sx={{ overflow: 'hidden' }} >
                    {cliente?.logomarca?.name}
                </Typography>
            )}
        </Box>
    )
}