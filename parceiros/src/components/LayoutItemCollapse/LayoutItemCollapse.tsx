import { Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import UserService from '../../services/UserService';

const userService = new UserService();

export default function LayoutItemCollapse({ open, subcategorias = [], action }: any) {
    const navigate = useNavigate();
    
    const aoDeslogar = async () => {
        await userService.logout();
        return navigate('/login')
    };
    
    return (
        <Collapse sx={{ width: '100%' }} in={open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
                {subcategorias.length > 0 && (
                        subcategorias.map((subcategoria: any) => (
                            <ListItemButton key={subcategoria.nome} sx={{ pl: 4 }} component="a" href={subcategoria.link}>
                                <ListItemIcon>
                                    {subcategoria.icone}
                                </ListItemIcon>
                                <ListItemText primary={subcategoria.nome} />
                            </ListItemButton>
                        ))
                )}
                {subcategorias[0]?.nome == "Perfil" && (<Divider />)}
                {(action || (subcategorias.length > 0 && subcategorias[0]?.nome == "Perfil")) && (
                    <>
                        <ListItemButton sx={{ pl: 4 }} onClick={aoDeslogar}>
                            <ListItemIcon>
                                <ExitToApp />
                            </ListItemIcon>
                            <ListItemText primary={"Sair"} />
                        </ListItemButton>
                    </>
                )}
            </List>
        </Collapse>
    )
}