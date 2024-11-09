import { createBrowserRouter } from "react-router-dom"
import Login from "./pages/Login.tsx"
import PrimeiroAcesso from './pages/PrimeiroAcesso.tsx'
import ErrorPage from './components/ErrorPage/ErrorPage.tsx'
import ProtectedRoute from "./pages/ProtectedRoute.tsx"
import PagamentosParceiro from "./pages/PagamentosParceiro.tsx"
import PagamentosConsultor from "./pages/PagamentosConsultor.tsx"
import CadastrosUsuarios from "./pages/CadastrosUsuarios.tsx"
import CadastrosParceiros from "./pages/CadastrosParceiros.tsx"
import RelatoriosPagamentos from "./pages/RelatoriosPagamentos.tsx"
import RelatoriosIndicacoes from "./pages/RelatoriosIndicacoes.tsx"
import Home from "./pages/Home.tsx"
import AlterarSenha from "./pages/AlterarSenha.tsx"
import Perfil from "./pages/Perfil.tsx"
import DadosBancarios from "./pages/DadosBancarios.tsx"

const router = createBrowserRouter([
    {
      path: "/",
      element: <ProtectedRoute element={<Home />} parceiroPage={true} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/perfil",
      element: <ProtectedRoute element={<Perfil />} parceiroPage={true} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/dados-bancarios",
      element: <ProtectedRoute element={<DadosBancarios />} parceiroPage={true} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/alterar-senha",
      element: <ProtectedRoute element={<AlterarSenha />} parceiroPage={true} />,
      errorElement: <ErrorPage />,
    },
    {
      path: "/primeiro-acesso",
      element: <ProtectedRoute element={<PrimeiroAcesso />} admEParceiroPage={true} />,
      errorElement: <ErrorPage />
    },
    {
      path: "/login",
      element: <ProtectedRoute element={<Login />} loginPage={true} />,
      errorElement: <ErrorPage />
    },
    {
      path: "/pagamentos-parceiro",
      element: <ProtectedRoute element={<PagamentosParceiro />} />,
      errorElement: <ErrorPage />
    },
    {
      path: "/pagamentos-consultor",
      element: <ProtectedRoute element={<PagamentosConsultor />} />,
      errorElement: <ErrorPage />
    },
    {
      path: "/cadastros-usuarios",
      element: <ProtectedRoute element={<CadastrosUsuarios />} />,
      errorElement: <ErrorPage />
    },
    {
      path: "/cadastros-parceiros",
      element: <ProtectedRoute element={<CadastrosParceiros />} />,
      errorElement: <ErrorPage />
    },
    {
      path: "/relatorios-pagamentos",
      element: <ProtectedRoute element={<RelatoriosPagamentos />} />,
      errorElement: <ErrorPage />
    },
    {
      path: "/relatorios-indicacoes",
      element: <ProtectedRoute element={<RelatoriosIndicacoes />} />,
      errorElement: <ErrorPage />
    }
  ])

export default router;