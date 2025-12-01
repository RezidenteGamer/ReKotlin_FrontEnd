/**
 * =============================================================================
 * CONTEXTO DE AUTENTICAÇÃO GLOBAL
 * =============================================================================
 * 
 * Este arquivo implementa o gerenciamento de estado global de autenticação
 * usando a Context API do React.
 * 
 * FUNCIONALIDADE EXTRA #3: Sistema completo de autenticação
 * 
 * O que este arquivo faz:
 * - Armazena informações do usuário logado em TODA a aplicação
 * - Persiste o login usando localStorage (usuário continua logado ao recarregar)
 * - Fornece funções helper para verificar tipo de usuário
 * - Protege rotas baseado no estado de autenticação
 * 
 * Padrão de Design: Context API + Custom Hook
 * Benefícios:
 * - Evita prop drilling (passar props por vários níveis)
 * - Estado global acessível em qualquer componente
 * - Código mais limpo e organizado
 * 
 */

import { createContext, useContext, useState, useEffect } from 'react';

/**
 * =============================================================================
 * CRIAÇÃO DO CONTEXTO
 * =============================================================================
 * 
 * createContext() cria um "container" que pode ser acessado por qualquer
 * componente filho na árvore de componentes.
 * 
 * Inicializamos com null porque não há usuário logado no início.
 */
const AuthContext = createContext(null);

/**
 * =============================================================================
 * PROVIDER - Componente que fornece o contexto
 * =============================================================================
 * 
 * O AuthProvider "envolve" toda a aplicação e fornece o estado de autenticação
 * para todos os componentes filhos.
 * 
 * Este componente:
 * - Gerencia o estado do usuário logado
 * - Persiste/recupera dados do localStorage
 * - Fornece funções de login/logout
 * - Fornece funções helper (ehProfessor, ehAcademico)
 * 
 * @param {Object} props - Props do componente
 * @param {ReactNode} props.children - Componentes filhos que terão acesso ao contexto
 * 
 * @example
 * // No main.jsx ou App.jsx
 * <AuthProvider>
 *   <MinhaAplicacao />
 * </AuthProvider>
 */
export function AuthProvider({ children }) {
  /**
   * ---------------------------------------------------------------------------
   * ESTADO DO USUÁRIO LOGADO
   * ---------------------------------------------------------------------------
   * 
   * Este estado armazena TODAS as informações do usuário autenticado.
   * 
   * Estrutura do objeto usuario:
   * {
   *   id: number,              // ID único do usuário
   *   email: string,           // Email de login
   *   nome: string,            // Nome completo
   *   tipoUsuario: string,     // "PROFESSOR" ou "ACADEMICO"
   *   departamento?: string,   // Apenas para professores
   *   matricula?: string       // Apenas para acadêmicos
   * }
   * 
   * null = nenhum usuário logado
   */
  const [usuario, setUsuario] = useState(null);
  
  /**
   * ---------------------------------------------------------------------------
   * ESTADO DE CARREGAMENTO
   * ---------------------------------------------------------------------------
   * 
   * Indica se ainda estamos verificando se há um usuário logado no localStorage.
   * Evita renderizar conteúdo antes de saber o estado de autenticação.
   * 
   * true = ainda verificando
   * false = verificação completa
   */
  const [carregando, setCarregando] = useState(true);

  /**
   * ---------------------------------------------------------------------------
   * EFFECT: Recuperar usuário do localStorage ao iniciar
   * ---------------------------------------------------------------------------
   * 
   * Este useEffect executa UMA VEZ quando o componente monta.
   * Ele verifica se existe um usuário salvo no localStorage (de uma sessão anterior).
   * 
   * Fluxo:
   * 1. Busca 'usuario' no localStorage
   * 2. Se existir, faz parse do JSON e restaura o estado
   * 3. Se não existir ou houver erro, mantém usuario como null
   * 4. Define carregando = false para liberar a renderização
   * 
   * IMPORTANTE: localStorage persiste entre recarregamentos da página,
   * mantendo o usuário logado mesmo após fechar o navegador.
   */
  useEffect(() => {
    // Busca os dados salvos no localStorage
    const usuarioSalvo = localStorage.getItem('usuario');
    
    if (usuarioSalvo) {
      try {
        // Converte o JSON de volta para objeto JavaScript
        const usuarioObj = JSON.parse(usuarioSalvo);
        setUsuario(usuarioObj);
      } catch (error) {
        // Se houver erro no parse (dados corrompidos), remove do storage
        console.error('Erro ao carregar usuário do localStorage:', error);
        localStorage.removeItem('usuario');
      }
    }
    
    // Libera a aplicação para renderizar
    setCarregando(false);
  }, []); // Array vazio = executa apenas na montagem do componente

  /**
   * ---------------------------------------------------------------------------
   * FUNÇÃO: login
   * ---------------------------------------------------------------------------
   * 
   * Realiza o login do usuário, salvando seus dados no estado e no localStorage.
   * Esta função é chamada APÓS o back-end validar as credenciais.
   * 
   * Fluxo:
   * 1. Componente Login faz requisição para API
   * 2. API valida e retorna dados do usuário
   * 3. Componente chama esta função com os dados retornados
   * 4. Dados são salvos no estado (React) e no localStorage (navegador)
   * 
   * @param {Object} dadosUsuario - Dados do usuário retornados pela API
   * 
   * @example
   * // Após login bem-sucedido na API
   * const response = await autenticacaoServico.login(credenciais);
   * login(response.data); // Salva os dados localmente
   */
  const login = (dadosUsuario) => {
    // Atualiza o estado React (re-renderiza componentes que usam useAuth)
    setUsuario(dadosUsuario);
    
    // Persiste no localStorage (mantém após fechar navegador)
    localStorage.setItem('usuario', JSON.stringify(dadosUsuario));
  };

  /**
   * ---------------------------------------------------------------------------
   * FUNÇÃO: logout
   * ---------------------------------------------------------------------------
   * 
   * Realiza o logout do usuário, removendo todos os seus dados.
   * 
   * Fluxo:
   * 1. Remove dados do estado React (usuario volta a ser null)
   * 2. Remove dados do localStorage
   * 3. Componentes que verificam 'usuario' são re-renderizados
   * 4. Rotas protegidas redirecionam para login
   * 
   * @example
   * // No componente LayoutBase
   * const { logout } = useAuth();
   * 
   * function handleLogout() {
   *   logout();
   *   navigate('/selecionar-tipo');
   * }
   */
  const logout = () => {
    // Remove do estado React
    setUsuario(null);
    
    // Remove do localStorage
    localStorage.removeItem('usuario');
  };

  /**
   * ---------------------------------------------------------------------------
   * FUNÇÃO HELPER: ehProfessor
   * ---------------------------------------------------------------------------
   * 
   * Verifica se o usuário logado é um professor.
   * Usado para mostrar/ocultar funcionalidades específicas de professores.
   * 
   * Operador Optional Chaining (?.) garante que não teremos erro se usuario for null.
   * 
   * @returns {boolean} true se for professor, false caso contrário
   * 
   * @example
   * const { ehProfessor } = useAuth();
   * 
   * // Mostrar botão apenas para professores
   * {ehProfessor() && (
   *   <button>Criar Turma</button>
   * )}
   */
  const ehProfessor = () => {
    return usuario?.tipoUsuario === 'PROFESSOR';
  };

  /**
   * ---------------------------------------------------------------------------
   * FUNÇÃO HELPER: ehAcademico
   * ---------------------------------------------------------------------------
   * 
   * Verifica se o usuário logado é um acadêmico.
   * Usado para mostrar/ocultar funcionalidades específicas de acadêmicos.
   * 
   * @returns {boolean} true se for acadêmico, false caso contrário
   * 
   * @example
   * const { ehAcademico } = useAuth();
   * 
   * // Mostrar botão apenas para acadêmicos
   * {ehAcademico() && (
   *   <button>Matricular-se</button>
   * )}
   */
  const ehAcademico = () => {
    return usuario?.tipoUsuario === 'ACADEMICO';
  };

  /**
   * ---------------------------------------------------------------------------
   * PROVIDER VALUE - Dados fornecidos pelo contexto
   * ---------------------------------------------------------------------------
   * 
   * Todos os valores dentro de 'value' estarão disponíveis para componentes
   * que usarem o hook useAuth().
   * 
   * Qualquer alteração nestes valores causa re-renderização dos componentes
   * que os utilizam.
   */
  return (
    <AuthContext.Provider value={{ 
      usuario,        // Objeto com dados do usuário (ou null)
      login,          // Função para fazer login
      logout,         // Função para fazer logout
      ehProfessor,    // Função helper - verifica se é professor
      ehAcademico,    // Função helper - verifica se é acadêmico
      carregando      // Boolean - indica se ainda está carregando
    }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * =============================================================================
 * CUSTOM HOOK - useAuth
 * =============================================================================
 * 
 * Hook customizado que facilita o acesso ao contexto de autenticação.
 * 
 * Este hook:
 * - Abstrai a lógica de useContext
 * - Valida se está sendo usado dentro de um AuthProvider
 * - Fornece melhor experiência de desenvolvimento
 * 
 * IMPORTANTE: Este hook SÓ pode ser usado dentro de componentes que estão
 * envoltos por <AuthProvider>.
 * 
 * @returns {Object} Objeto com todas as funcionalidades de autenticação
 * @returns {Object|null} returns.usuario - Dados do usuário logado (ou null)
 * @returns {Function} returns.login - Função para fazer login
 * @returns {Function} returns.logout - Função para fazer logout
 * @returns {Function} returns.ehProfessor - Verifica se é professor
 * @returns {Function} returns.ehAcademico - Verifica se é acadêmico
 * @returns {boolean} returns.carregando - Estado de carregamento
 * 
 * @throws {Error} Se usado fora de um AuthProvider
 * 
 * @example
 * // Em qualquer componente da aplicação
 * import { useAuth } from '../AuthContext';
 * 
 * function MeuComponente() {
 *   const { usuario, ehProfessor, logout } = useAuth();
 *   
 *   if (!usuario) {
 *     return <p>Você precisa fazer login!</p>;
 *   }
 *   
 *   return (
 *     <div>
 *       <p>Bem-vindo, {usuario.nome}!</p>
 *       {ehProfessor() && <button>Criar Turma</button>}
 *       <button onClick={logout}>Sair</button>
 *     </div>
 *   );
 * }
 */
export function useAuth() {
  // Obtém o contexto
  const context = useContext(AuthContext);
  
  /**
   * Validação de segurança:
   * Se context for null/undefined, significa que o componente está sendo
   * usado FORA de um <AuthProvider>, o que causaria erros.
   * Lançamos um erro claro para facilitar o debug.
   */
  if (!context) {
    throw new Error(
      'useAuth deve ser usado dentro de um AuthProvider. ' +
      'Certifique-se de envolver sua aplicação com <AuthProvider>.'
    );
  }
  
  // Retorna todos os valores do contexto
  return context;
}

/**
 * =============================================================================
 * EXEMPLO DE USO COMPLETO
 * =============================================================================
 * 
 * // 1. Envolver a aplicação com AuthProvider (main.jsx)
 * import { AuthProvider } from './AuthContext';
 * 
 * <AuthProvider>
 *   <App />
 * </AuthProvider>
 * 
 * 
 * // 2. Usar em qualquer componente
 * import { useAuth } from '../AuthContext';
 * 
 * function MinhaPagina() {
 *   const { usuario, ehProfessor, logout } = useAuth();
 *   
 *   return (
 *     <div>
 *       {usuario ? (
 *         <>
 *           <h1>Olá, {usuario.nome}!</h1>
 *           {ehProfessor() && <CriarTurmaButton />}
 *           <button onClick={logout}>Sair</button>
 *         </>
 *       ) : (
 *         <p>Faça login para continuar</p>
 *       )}
 *     </div>
 *   );
 * }
 * 
 * 
 * // 3. Proteger rotas
 * function RotaProtegida({ children }) {
 *   const { usuario, carregando } = useAuth();
 *   
 *   if (carregando) return <Loading />;
 *   if (!usuario) return <Navigate to="/login" />;
 *   
 *   return children;
 * }
 */