import * as React from 'react';
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import LayoutItemCollapse from '../LayoutItemCollapse/LayoutItemCollapse';

export default function LayoutItem({ text, icon, component = "", href = "", subcategorias = [], action }: any) {
    const [open, setOpen] = React.useState(false);

    const aoExpandir = () => {
        setOpen(open => !open);
    };

    return (
        <ListItem sx={{ flexDirection: 'column' }} disablePadding>
            <ListItemButton 
                sx={{ width: '100%' }} 
                component={component} 
                href={href} 
                onClick={(subcategorias.length > 0 || action) ? aoExpandir : undefined}
            >
                <ListItemIcon>
                    {icon}
                </ListItemIcon>
                <ListItemText primary={text} />
                {(subcategorias.length || action) && (open ? <ExpandLess /> : <ExpandMore />)}
            </ListItemButton>
            {(subcategorias.length > 0 || action) && (
                <LayoutItemCollapse 
                    open={open} 
                    subcategorias={subcategorias ? subcategorias : []} 
                    action={action}
                />
            )}
        </ListItem>
    )
}