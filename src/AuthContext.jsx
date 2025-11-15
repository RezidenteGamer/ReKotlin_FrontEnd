import { createContext, useContext, useState, useEffect } from 'react';

/**
 * Contexto de Autenticação
 * Gerencia o estado global do usuário logado em toda a aplicação
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega dados do usuário do localStorage ao iniciar
  useEffect(() => {
    const usuarioSalvo = localStorage.getItem('usuario');
    if (usuarioSalvo) {
      try {
        setUsuario(JSON.parse(usuarioSalvo));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('usuario');
      }
    }
    setCarregando(false);
  }, []);

  // Função para fazer login
  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
  };

  // Função para fazer logout
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem('usuario');
  };

  // Verifica se é professor
  const ehProfessor = () => {
    return usuario?.tipoUsuario === 'PROFESSOR';
  };

  // Verifica se é acadêmico
  const ehAcademico = () => {
    return usuario?.tipoUsuario === 'ACADEMICO';
  };

  return (
    <AuthContext.Provider value={{ 
      usuario, 
      login, 
      logout, 
      ehProfessor, 
      ehAcademico,
      carregando 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para usar o contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}