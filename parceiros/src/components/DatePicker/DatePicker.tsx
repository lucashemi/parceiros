import { TextField } from "@mui/material";

export default function DatePicker({ data, setData, label, inputWidth = "calc(20% - 16px)" }: any) {
    return (
        <TextField
        id={"date-input-" + label} 
        label={label}
        type="date"
        sx={{ flexBasis: { xs: '100%', sm: '100%', md: inputWidth }, mt: 2 }}
        value={data}
        onChange={(e) => setData(e.target.value)}
        InputLabelProps={{
            shrink: true,
        }}
        inputProps={{
            max: '9999-12-31',
        }}
    />
    )

}