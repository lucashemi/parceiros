import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import { Link } from 'react-router-dom';
import Images from '../../assets/images';
import { Home, Person } from '@mui/icons-material';
import UserService from '../../services/UserService';
import categorias from '../../data/categorias';
import LayoutItem from '../LayoutItem/LayoutItem';
import { Toolbar } from '@mui/material';
import subcategoriasParceiros from '../../data/subcategoriasParceiros';

const userService = new UserService();

export default function LayoutDrawer() {
    const user = userService.getUser();
    const ehUmUsuario = userService.ehUsuario(); 

    return (
        <>
            <Link to="/">
                <Toolbar sx={{ width: '85%', margin: '0 auto' }}>
                    <img src={Images.logo} alt='Logo da direcao' width={'100%'} />
                </Toolbar>
            </Link>
            <Divider />
            <List component={'div'} style={{ flex: 1, marginTop: 5 }}>
                <LayoutItem 
                    icon={<Home />} 
                    text={"Indicações"} 
                    component="a" 
                    href="/" 
                />
                {ehUmUsuario && categorias.map((categoria) => (
                    <LayoutItem
                        key={categoria.nome}
                        icon={categoria.icone}
                        text={categoria.nome}
                        subcategorias={categoria.subcategorias}
                    />
                ))}
            </List>
            <List sx={{ mb: 3 }}>
                {user && <LayoutItem 
                    icon={<Person />} 
                    text={user.nome} 
                    subcategorias={ehUmUsuario ? [] : subcategoriasParceiros}
                    action={ehUmUsuario} 
                />}
            </List>
        </>
    );
}