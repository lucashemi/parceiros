import { BarChart, ContentPaste, Diversity3, Payment, People } from "@mui/icons-material";
import Categoria from "../interfaces/Categoria";

const categorias: Categoria[] = [
    {
        nome: 'Cadastros',
        icone: <ContentPaste  />,
        subcategorias: [
            { nome: 'Usuários', icone: <People />, link: '/cadastros-usuarios' },
            { nome: 'Parceiros', icone: <Diversity3 />, link: '/cadastros-parceiros' },
        ],
    },
    {
        nome: 'Relatórios',
        icone: <BarChart />,
        subcategorias: [
            { nome: 'Pagamentos', icone: <Payment />, link: '/relatorios-pagamentos' },
            { nome: 'Indicações', icone: <People />, link: '/relatorios-indicacoes' },
        ],
    },
]

export default categorias;