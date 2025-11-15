import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import { LayoutBase } from '../componentes/LayoutBase';
import { ListaTurmas } from '../paginas/ListaTurmas';
import { FormularioTurma } from '../paginas/FormularioTurma';
import { SelecionarTipo } from '../paginas/SelecionarTipo';
import { Login } from '../paginas/Login';

/**
 * Componente de proteção de rotas
 * Redireciona para login se o usuário não estiver autenticado
 */
function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/selecionar-tipo" replace />;
  }

  return children;
}

/**
 * Configuração de rotas da aplicação
 * Define todas as páginas e seus caminhos
 */
export function RotasApp() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas de autenticação (sem layout) */}
          <Route path="/selecionar-tipo" element={<SelecionarTipo />} />
          <Route path="/login/:tipo" element={<Login />} />

          {/* Rotas principais (com layout e proteção) */}
          <Route path="/" element={
            <RotaProtegida>
              <LayoutBase />
            </RotaProtegida>
          }>
            <Route index element={<ListaTurmas />} />
            <Route path="turma/nova" element={<FormularioTurma />} />
            <Route path="turma/editar/:idTurma" element={<FormularioTurma />} />
          </Route>

          {/* Rota padrão - redireciona para home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}