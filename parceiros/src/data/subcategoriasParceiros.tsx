import { AccountBalance, AccountBox, Key } from "@mui/icons-material";
import Subcategoria from "../interfaces/Subcategoria";

const subcategoriasParceiros: Subcategoria[] = [
    { nome: 'Perfil', icone: <AccountBox />, link: '/perfil' },
    { nome: 'Dados Bancários', icone: <AccountBalance />, link: '/dados-bancarios' },
    { nome: 'Alterar Senha', icone: <Key />, link: '/alterar-senha' },
]

export default subcategoriasParceiros;