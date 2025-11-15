import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * Layout base da aplicação
 * Contém navegação contextual baseada no tipo de usuário logado
 */
export function LayoutBase() {
  const { usuario, logout, ehProfessor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/selecionar-tipo');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navegação Principal */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            Portal Acadêmico
          </Link>

          <div className="flex items-center space-x-6">
            {/* Links de navegação */}
            <Link to="/" className="text-gray-700 hover:text-blue-500 font-medium">
              Início
            </Link>

            {/* Mostrar "Criar Turma" apenas para professores */}
            {usuario && ehProfessor() && (
              <Link 
                to="/turma/nova" 
                className="text-gray-700 hover:text-blue-500 font-medium"
              >
                Criar Turma
              </Link>
            )}

            {/* Informações do usuário logado */}
            {usuario ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">
                    {usuario.nome}
                  </p>
                  <p className="text-xs text-gray-500">
                    {usuario.tipoUsuario === 'PROFESSOR' ? '👨‍🏫 Professor' : '🎓 Acadêmico'}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link 
                to="/selecionar-tipo" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        Trabalho Semestral - Front/Back - 2025
      </footer>
    </div>
  );
}