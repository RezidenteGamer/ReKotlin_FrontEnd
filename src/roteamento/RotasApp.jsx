/**
 * =============================================================================
 * CONFIGURAÇÃO DE ROTAS DA APLICAÇÃO
 * =============================================================================
 * 
 * Este arquivo é o "mapa" da aplicação, definindo todas as páginas (rotas)
 * e como navegar entre elas.
 * 
 * REQUISITOS IMPLEMENTADOS:
 * ✅ Criar navegação funcional entre telas
 * ✅ Estrutura inicial do projeto React (com rotas)
 * ✅ FUNCIONALIDADE EXTRA: Sistema de autenticação com proteção de rotas
 * 
 * Conceitos importantes:
 * - SPA (Single Page Application): Não recarrega a página ao navegar
 * - Rotas protegidas: Apenas usuários autenticados podem acessar
 * - Rotas públicas: Qualquer um pode acessar
 * - Layouts aninhados: LayoutBase envolve páginas internas
 * 
 * Estrutura de rotas:
 * /selecionar-tipo          → Escolher tipo de usuário (público)
 * /login/:tipo              → Fazer login (público)
 * /                         → Home com lista de turmas (protegido)
 * /turma/nova               → Criar turma (protegido, só professor)
 * /turma/editar/:idTurma    → Editar turma (protegido, só professor)
 * 
 * @author [Seu Nome]
 * @version 1.0.0
 * @since 2025-01-15
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../AuthContext';
import { LayoutBase } from '../componentes/LayoutBase';
import { ListaTurmas } from '../paginas/ListaTurmas';
import { FormularioTurma } from '../paginas/FormularioTurma';
import { SelecionarTipo } from '../paginas/SelecionarTipo';
import { Login } from '../paginas/Login';

/**
 * =============================================================================
 * COMPONENTE: RotaProtegida
 * =============================================================================
 * 
 * HOC (Higher-Order Component) que protege rotas privadas.
 * Só permite acesso se o usuário estiver autenticado.
 * 
 * FUNCIONALIDADE EXTRA: Sistema completo de autenticação
 * 
 * Fluxo de proteção:
 * 1. Verifica se está carregando dados do localStorage
 * 2. Se carregando: mostra loading
 * 3. Se não há usuário: redireciona para /selecionar-tipo
 * 4. Se há usuário: renderiza a página solicitada
 * 
 * Este padrão garante que páginas privadas não sejam acessíveis
 * digitando a URL diretamente no navegador.
 * 
 * @param {Object} props - Propriedades do componente
 * @param {ReactNode} props.children - Componente filho a ser protegido
 * 
 * @returns {JSX.Element} Children (se autenticado), Loading ou Navigate
 * 
 * @example
 * <RotaProtegida>
 *   <PaginaPrivada />
 * </RotaProtegida>
 * 
 * // Se usuário não estiver logado, será redirecionado automaticamente
 */
function RotaProtegida({ children }) {
  /**
   * Obtém estado de autenticação do contexto global
   * - usuario: objeto com dados do usuário (ou null se não logado)
   * - carregando: boolean indicando se ainda está verificando localStorage
   */
  const { usuario, carregando } = useAuth();

  /**
   * ---------------------------------------------------------------------------
   * ESTADO 1: Carregando dados do localStorage
   * ---------------------------------------------------------------------------
   * 
   * Enquanto verifica se há usuário salvo, mostra tela de loading.
   * Isso evita "flash" de redirecionamento indesejado.
   * 
   * Cenário: Usuário está logado, recarrega página
   * - Sem loading: Redirecionaria para login e voltaria (ruim UX)
   * - Com loading: Mostra spinner enquanto verifica, depois mantém na página
   */
  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {/* 
            Spinner animado usando Tailwind
            animate-spin: rotação infinita
            border-b-2: apenas borda inferior para efeito de "loading"
          */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  /**
   * ---------------------------------------------------------------------------
   * ESTADO 2: Usuário não autenticado
   * ---------------------------------------------------------------------------
   * 
   * Se não há usuário logado, redireciona para tela de seleção de tipo.
   * 
   * <Navigate> é o componente do React Router para redirecionamento.
   * replace={true} substitui a entrada no histórico (não cria nova)
   * 
   * Isso evita que o usuário pressione "voltar" e retorne à página protegida.
   */
  if (!usuario) {
    return <Navigate to="/selecionar-tipo" replace />;
  }

  /**
   * ---------------------------------------------------------------------------
   * ESTADO 3: Usuário autenticado
   * ---------------------------------------------------------------------------
   * 
   * Se passou pelas verificações, renderiza o conteúdo protegido.
   * children é a página que foi envolta por <RotaProtegida>
   */
  return children;
}

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL: RotasApp
 * =============================================================================
 * 
 * Define TODAS as rotas da aplicação e sua hierarquia.
 * 
 * Estrutura hierárquica:
 * 
 * <BrowserRouter>                     ← Habilita roteamento SPA
 *   <AuthProvider>                    ← Contexto de autenticação global
 *     <Routes>                        ← Container de rotas
 *       <Route>Rotas públicas</Route>
 *       <Route>Rotas protegidas</Route>
 *     </Routes>
 *   </AuthProvider>
 * </BrowserRouter>
 * 
 * @returns {JSX.Element} Estrutura completa de rotas
 */
export function RotasApp() {
  return (
    /**
     * =========================================================================
     * BrowserRouter - Provedor de roteamento
     * =========================================================================
     * 
     * Habilita navegação via URL do navegador (SPA - Single Page Application)
     * Sem ele, os componentes <Route>, <Link> e useNavigate() não funcionam.
     * 
     * Alternativas:
     * - HashRouter: usa # na URL (ex: /#/turmas)
     * - MemoryRouter: não altera URL (usado em testes)
     * - BrowserRouter: usa URLs limpas (ex: /turmas) ← Melhor para produção
     */
    <BrowserRouter>
      
      {/**
       * =======================================================================
       * AuthProvider - Contexto de autenticação
       * =======================================================================
       * 
       * Envolve toda a aplicação para que qualquer componente possa:
       * - Acessar dados do usuário logado
       * - Fazer login/logout
       * - Verificar tipo de usuário (professor/acadêmico)
       * 
       * Deve estar DENTRO do BrowserRouter mas FORA do Routes
       * para que o contexto esteja disponível em todas as páginas.
       */}
      <AuthProvider>
        
        {/**
         * =====================================================================
         * Routes - Container de rotas
         * =====================================================================
         * 
         * Agrupa todas as rotas da aplicação.
         * Apenas UMA rota é renderizada por vez (a que corresponde à URL atual).
         * 
         * React Router 6 usa matching automático:
         * - Não precisa de <Switch>
         * - Não precisa de exact
         * - Rotas mais específicas têm prioridade
         */}
        <Routes>
          
          {/* 
            ===================================================================
            ROTAS PÚBLICAS - Autenticação
            ===================================================================
            
            Estas rotas NÃO estão protegidas.
            Qualquer pessoa pode acessar, mesmo sem login.
          */}
          
          {/**
           * Rota: /selecionar-tipo
           * Página: SelecionarTipo
           * 
           * Primeira tela que o usuário vê.
           * Permite escolher entre "Sou Professor" ou "Sou Acadêmico".
           * 
           * Após seleção, navega para /login/professor ou /login/academico
           */}
          <Route 
            path="/selecionar-tipo" 
            element={<SelecionarTipo />} 
          />
          
          {/**
           * Rota: /login/:tipo
           * Página: Login
           * 
           * Parâmetro dinâmico :tipo pode ser:
           * - "professor" → /login/professor
           * - "academico" → /login/academico
           * 
           * O componente Login usa useParams() para acessar o valor de :tipo
           * e ajustar a interface (cores, ícones, mensagens).
           * 
           * Após login bem-sucedido, redireciona para /
           */}
          <Route 
            path="/login/:tipo" 
            element={<Login />} 
          />

          {/* 
            ===================================================================
            ROTAS PROTEGIDAS - Área Logada
            ===================================================================
            
            Estas rotas exigem autenticação.
            Usuários não logados são redirecionados para /selecionar-tipo
          */}
          
          {/**
           * Rota: / (e subrotas)
           * Layout: LayoutBase
           * 
           * Esta é uma ROTA PAI que:
           * 1. Envolve as páginas internas com LayoutBase (navbar + footer)
           * 2. Protege todas as subrotas com <RotaProtegida>
           * 
           * Todas as rotas filhas serão renderizadas no <Outlet /> do LayoutBase.
           * 
           * Estrutura visual:
           * ┌─────────────────────────────────┐
           * │ Navbar (LayoutBase)             │
           * ├─────────────────────────────────┤
           * │                                 │
           * │  <Outlet /> ← Rotas filhas aqui │
           * │                                 │
           * ├─────────────────────────────────┤
           * │ Footer (LayoutBase)             │
           * └─────────────────────────────────┘
           */}
          <Route 
            path="/" 
            element={
              <RotaProtegida>
                <LayoutBase />
              </RotaProtegida>
            }
          >
            {/**
             * Rota: / (index)
             * Página: ListaTurmas
             * 
             * index significa que esta é a rota padrão quando acessar /
             * Sem index, precisaríamos definir path="/"
             * 
             * Esta é a HOME da aplicação.
             * Exibe lista de todas as turmas com busca, filtros e ações.
             */}
            <Route 
              index 
              element={<ListaTurmas />} 
            />
            
            {/**
             * Rota: /turma/nova
             * Página: FormularioTurma (modo criação)
             * 
             * Apenas PROFESSORES devem acessar.
             * O componente FormularioTurma verifica isso internamente
             * e redireciona se não for professor.
             * 
             * Usado para criar novas turmas.
             */}
            <Route 
              path="turma/nova" 
              element={<FormularioTurma />} 
            />
            
            {/**
             * Rota: /turma/editar/:idTurma
             * Página: FormularioTurma (modo edição)
             * 
             * Parâmetro dinâmico :idTurma contém o ID da turma a editar.
             * Exemplo: /turma/editar/5 → idTurma = "5"
             * 
             * O FormularioTurma detecta que há :idTurma e entra em modo edição:
             * - Busca dados atuais da turma
             * - Pré-preenche o formulário
             * - Ao salvar, faz PUT ao invés de POST
             * 
             * Apenas o PROFESSOR responsável deve editar (validado no back-end).
             */}
            <Route 
              path="turma/editar/:idTurma" 
              element={<FormularioTurma />} 
            />
          </Route>

          {/* 
            ===================================================================
            ROTA FALLBACK - Captura URLs inexistentes
            ===================================================================
            
            path="*" significa "qualquer outra rota não definida acima"
            Funciona como um 404 handler.
            
            Em vez de mostrar página de erro, redirecionamos para home.
            
            Exemplos:
            - /pagina-inexistente → redireciona para /
            - /turmas/999999999 → redireciona para /
            - /qualquer/coisa → redireciona para /
          */}
          <Route 
            path="*" 
            element={<Navigate to="/" replace />} 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

/**
 * =============================================================================
 * FLUXO DE NAVEGAÇÃO COMPLETO
 * =============================================================================
 * 
 * PRIMEIRO ACESSO (usuário não logado):
 * 1. Acessa qualquer URL → RotaProtegida detecta falta de autenticação
 * 2. Redireciona para /selecionar-tipo
 * 3. Usuário escolhe tipo (Professor/Acadêmico)
 * 4. Navega para /login/professor ou /login/academico
 * 5. Faz login com email e senha
 * 6. Login bem-sucedido → salva dados no AuthContext
 * 7. Redireciona para / (ListaTurmas)
 * 
 * USUÁRIO JÁ LOGADO:
 * 1. Acessa qualquer URL protegida
 * 2. RotaProtegida verifica localStorage
 * 3. Encontra dados salvos → restaura sessão
 * 4. Permite acesso à página solicitada
 * 
 * NAVEGAÇÃO ENTRE PÁGINAS:
 * - Cliques em <Link> do React Router → navegação instantânea (SPA)
 * - Não recarrega a página inteira
 * - Apenas troca o componente renderizado
 * - Histórico do navegador funciona (botão voltar)
 * 
 * =============================================================================
 */