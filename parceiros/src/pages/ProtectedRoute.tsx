import { useEffect } from "react";
import UserService from "../services/UserService"
import { useNavigate } from "react-router-dom";

const userService = new UserService();

const ProtectedRoute = ({ element, loginPage, parceiroPage, admEParceiroPage } : any) => {
    const navigate = useNavigate();

    useEffect(() => {
        const verificarAutenticacao = async () => {
            const usuarioAutenticado = userService.authenticatedUser();
            const ehUmUsuario = userService.ehUsuario();
            if (!usuarioAutenticado && !loginPage) {
                userService.logout();
                navigate('/login');
                return null;
            } else if (usuarioAutenticado && loginPage) {
                navigate('/');
                return null;
            } else if (usuarioAutenticado && !admEParceiroPage && !parceiroPage && !ehUmUsuario) {
                navigate('/');
                return null;
            } else if (usuarioAutenticado && !admEParceiroPage && parceiroPage && ehUmUsuario) {
                navigate('/');
                return null;
            }
        };

        verificarAutenticacao();
    }, [navigate]);

    return <>{element}</>
}

export default ProtectedRoute;