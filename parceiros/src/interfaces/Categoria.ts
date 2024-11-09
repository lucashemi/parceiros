import Subcategoria from "./Subcategoria";

export default interface Categoria {
    nome: string;
    icone: React.ReactNode;
    subcategorias: Subcategoria[];
}