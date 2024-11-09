import * as React from 'react'
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { IconButton, InputAdornment, TextField } from "@mui/material"

export default function PasswordField({ value, ...outrasProps }: any) {

    const [showPassword, setShowPassword] = React.useState(false);

    const handleShowPassword = () => {
        setShowPassword((prevShowPassword) => !prevShowPassword)
    };

    return (
        <TextField
            margin="normal"
            required
            fullWidth
            type={showPassword ? "text" : "password"}
            color="secondary"
            value={value}
            {...outrasProps}
            InputProps={{
                endAdornment: (
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleShowPassword}
                            onMouseDown={handleShowPassword}
                        >
                            {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>
                )
            }}
        />
    )
}
