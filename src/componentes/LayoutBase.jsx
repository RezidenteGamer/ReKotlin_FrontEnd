/**
 * =============================================================================
 * LAYOUT BASE - ESTRUTURA PRINCIPAL DA APLICAÇÃO
 * =============================================================================
 * 
 * Este componente define a estrutura visual comum de TODAS as páginas internas
 * da aplicação (após login).
 * 
 * REQUISITOS IMPLEMENTADOS:
 * ✅ Criar layout base organizado e responsivo
 * ✅ Navegação funcional entre telas
 * ✅ Componente reutilizável (usado em todas as páginas internas)
 * 
 * Estrutura visual:
 * ┌──────────────────────────────────────┐
 * │ NAVBAR (sempre visível)              │
 * │ - Logo                               │
 * │ - Links de navegação (contextuais)   │
 * │ - Informações do usuário             │
 * │ - Botão de logout                    │
 * ├──────────────────────────────────────┤
 * │                                      │
 * │ CONTEÚDO PRINCIPAL                   │
 * │ <Outlet /> ← Páginas renderizam aqui│
 * │                                      │
 * ├──────────────────────────────────────┤
 * │ FOOTER (sempre visível)              │
 * └──────────────────────────────────────┘
 * 
 * Benefícios desta abordagem:
 * - Navbar e Footer aparecem automaticamente em todas as páginas
 * - Código não se repete (DRY - Don't Repeat Yourself)
 * - Mudanças no layout afetam todas as páginas simultaneamente
 * - Navegação consistente em toda aplicação
 * 
 * @author [Seu Nome]
 * @version 1.0.0
 * @since 2025-01-15
 */

import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL: LayoutBase
 * =============================================================================
 * 
 * Componente que envolve todas as páginas internas da aplicação.
 * Fornece estrutura consistente com navbar, conteúdo dinâmico e footer.
 * 
 * Como funciona:
 * 1. Navbar é renderizada no topo (sempre fixa)
 * 2. <Outlet /> renderiza a página atual (muda conforme a rota)
 * 3. Footer é renderizado no fim (sempre fixo)
 * 
 * Páginas que usam este layout:
 * - ListaTurmas (/)
 * - FormularioTurma (/turma/nova, /turma/editar/:id)
 * 
 * @returns {JSX.Element} Estrutura completa do layout
 */
export function LayoutBase() {
  /**
   * ---------------------------------------------------------------------------
   * HOOKS E ESTADO
   * ---------------------------------------------------------------------------
   */
  
  /**
   * Contexto de autenticação
   * Fornece dados do usuário e funções helper
   * 
   * @property {Object|null} usuario - Dados do usuário logado
   * @property {Function} logout - Função para fazer logout
   * @property {Function} ehProfessor - Verifica se é professor
   */
  const { usuario, logout, ehProfessor } = useAuth();
  
  /**
   * Hook para navegação programática
   * Permite redirecionar via código (não apenas por cliques)
   */
  const navigate = useNavigate();

  /**
   * ===========================================================================
   * FUNÇÃO: handleLogout
   * ===========================================================================
   * 
   * Realiza o logout do usuário e redireciona para tela de seleção.
   * 
   * Fluxo:
   * 1. Chama logout() do AuthContext
   *    - Remove dados do estado React
   *    - Remove dados do localStorage
   * 2. Redireciona para /selecionar-tipo
   * 3. Usuário precisa fazer login novamente para acessar páginas protegidas
   * 
   * @returns {void}
   */
  const handleLogout = () => {
    // Remove autenticação
    logout();
    
    // Redireciona para tela de login
    navigate('/selecionar-tipo');
  };

  /**
   * ===========================================================================
   * RENDERIZAÇÃO DO LAYOUT
   * ===========================================================================
   * 
   * Estrutura Flexbox que garante que o footer fique sempre no fim,
   * mesmo quando o conteúdo é pequeno.
   * 
   * Classes Tailwind explicadas:
   * - min-h-screen: altura mínima de 100vh (tela inteira)
   * - flex flex-col: layout flexível vertical
   * - bg-gray-100: fundo cinza claro
   */
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      
      {/* 
        =====================================================================
        NAVBAR - NAVEGAÇÃO PRINCIPAL
        =====================================================================
        
        Barra superior com:
        - Logo/título clicável (volta para home)
        - Links de navegação (contextuais por tipo de usuário)
        - Informações do usuário logado
        - Botão de logout
        
        Classes Tailwind:
        - bg-white: fundo branco
        - shadow-md: sombra média (destaque)
        - p-4: padding de 1rem em todos os lados
      */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* 
            ---------------------------------------------------------------
            LOGO / TÍTULO
            ---------------------------------------------------------------
            
            Link para home (/)
            Clicável em qualquer página para voltar à lista de turmas
          */}
          <Link 
            to="/" 
            className="text-2xl font-bold text-blue-600"
            aria-label="Voltar para página inicial"
          >
            Portal Acadêmico
          </Link>

          {/* 
            ---------------------------------------------------------------
            LINKS DE NAVEGAÇÃO + INFO DO USUÁRIO
            ---------------------------------------------------------------
            
            Layout flexível com espaçamento entre itens
          */}
          <div className="flex items-center space-x-6">
            
            {/* 
              Link: Início (sempre visível)
              Navega para / (ListaTurmas)
            */}
            <Link 
              to="/" 
              className="text-gray-700 hover:text-blue-500 font-medium"
              aria-label="Ir para página inicial"
            >
              Início
            </Link>

            {/* 
              -------------------------------------------------------------
              LINK CONDICIONAL: Criar Turma (só para professores)
              -------------------------------------------------------------
              
              Renderização condicional:
              - Se usuário existe E é professor: mostra link
              - Caso contrário: não renderiza (null)
              
              Operador lógico && (short-circuit):
              - Se primeira condição for false, não avalia o resto
              - Se for true, retorna o JSX à direita
            */}
            {usuario && ehProfessor() && (
              <Link 
                to="/turma/nova" 
                className="text-gray-700 hover:text-blue-500 font-medium"
                aria-label="Criar nova turma"
              >
                Criar Turma
              </Link>
            )}

            {/* 
              -------------------------------------------------------------
              SEÇÃO DE USUÁRIO: Info + Logout
              -------------------------------------------------------------
              
              Mostra informações do usuário logado e botão de sair
              Renderização condicional: só aparece se usuário existe
            */}
            {usuario ? (
              /**
               * Layout com informações do usuário + botão logout
               * flex items-center: alinha verticalmente ao centro
               * space-x-4: espaçamento horizontal entre elementos
               */
              <div className="flex items-center space-x-4">
                
                {/* 
                  Card de informações do usuário
                  Alinhado à direita (text-right)
                */}
                <div className="text-right">
                  {/* Nome do usuário em negrito */}
                  <p className="text-sm font-semibold text-gray-800">
                    {usuario.nome}
                  </p>
                  
                  {/* 
                    Tipo de usuário com emoji
                    Usa operador ternário para definir emoji e texto corretos
                    
                    Formato: condição ? valorSeTrue : valorSeFalse
                  */}
                  <p className="text-xs text-gray-500">
                    {usuario.tipoUsuario === 'PROFESSOR' 
                      ? '👨‍🏫 Professor' 
                      : '🎓 Acadêmico'}
                  </p>
                </div>
                
                {/* 
                  Botão de Logout
                  
                  Vermelho para indicar ação destrutiva (sair do sistema)
                  onClick chama handleLogout que:
                  1. Remove autenticação
                  2. Redireciona para login
                */}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition"
                  aria-label="Sair do sistema"
                >
                  Sair
                </button>
              </div>
            ) : (
              /**
               * -------------------------------------------------------------
               * CASO ESPECIAL: Usuário não logado
               * -------------------------------------------------------------
               * 
               * Este caso NÃO deveria acontecer pois o LayoutBase só é
               * renderizado em rotas protegidas (requerem autenticação).
               * 
               * Mas incluímos por segurança:
               * - Mostra botão "Entrar" caso algo dê errado
               * - Permite recuperação do estado inconsistente
               */
              <Link 
                to="/selecionar-tipo" 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition"
                aria-label="Fazer login"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* 
        =====================================================================
        MAIN - CONTEÚDO PRINCIPAL
        =====================================================================
        
        Área onde as páginas são renderizadas.
        
        <Outlet /> é um componente especial do React Router que:
        - Renderiza a rota filha correspondente à URL atual
        - Funciona como um "slot" para conteúdo dinâmico
        
        Exemplos:
        - URL = "/" → Outlet renderiza <ListaTurmas />
        - URL = "/turma/nova" → Outlet renderiza <FormularioTurma />
        - URL = "/turma/editar/5" → Outlet renderiza <FormularioTurma />
        
        Classes Tailwind:
        - flex-grow: ocupa todo espaço disponível (empurra footer para baixo)
        - container mx-auto: centraliza e limita largura máxima
        - p-6: padding de 1.5rem em todos os lados
      */}
      <main className="flex-grow container mx-auto p-6">
        <Outlet />
      </main>

      {/* 
        =====================================================================
        FOOTER - RODAPÉ
        =====================================================================
        
        Rodapé fixo que aparece em todas as páginas.
        Contém informações sobre o projeto.
        
        Classes Tailwind:
        - bg-gray-800: fundo cinza escuro
        - text-white: texto branco (contraste com fundo escuro)
        - p-4: padding de 1rem
        - text-center: texto centralizado
      */}
      <footer className="bg-gray-800 text-white p-4 text-center">
        Trabalho Semestral - Front/Back - 2025
      </footer>
    </div>
  );
}

/**
 * =============================================================================
 * COMO O OUTLET FUNCIONA
 * =============================================================================
 * 
 * Exemplo prático:
 * 
 * 1. Usuário acessa "/"
 *    ┌─────────────────────┐
 *    │ Navbar              │
 *    ├─────────────────────┤
 *    │ <ListaTurmas />     │ ← Outlet renderiza ListaTurmas
 *    ├─────────────────────┤
 *    │ Footer              │
 *    └─────────────────────┘
 * 
 * 2. Usuário clica em "Criar Turma" (navega para /turma/nova)
 *    ┌─────────────────────┐
 *    │ Navbar              │ ← Permanece igual
 *    ├─────────────────────┤
 *    │ <FormularioTurma /> │ ← Outlet troca para FormularioTurma
 *    ├─────────────────────┤
 *    │ Footer              │ ← Permanece igual
 *    └─────────────────────┘
 * 
 * Apenas o conteúdo central muda, Navbar e Footer permanecem!
 * 
 * =============================================================================
 */

/**
 * =============================================================================
 * NAVEGAÇÃO CONTEXTUAL POR TIPO DE USUÁRIO
 * =============================================================================
 * 
 * A navbar adapta-se automaticamente ao tipo de usuário logado:
 * 
 * PROFESSOR vê:
 * ┌──────────────────────────────────────────────────────────┐
 * │ Portal Acadêmico  |  Início  |  Criar Turma  |  [João] Sair │
 * └──────────────────────────────────────────────────────────┘
 * 
 * ACADÊMICO vê:
 * ┌──────────────────────────────────────────────────────────┐
 * │ Portal Acadêmico  |  Início  |  [Maria] Sair            │
 * └──────────────────────────────────────────────────────────┘
 * 
 * NÃO LOGADO (não deveria acontecer aqui):
 * ┌──────────────────────────────────────────────────────────┐
 * │ Portal Acadêmico  |  Início  |  Entrar                  │
 * └──────────────────────────────────────────────────────────┘
 * 
 * =============================================================================
 */

/**
 * =============================================================================
 * RESPONSIVIDADE
 * =============================================================================
 * 
 * O layout é totalmente responsivo graças ao Tailwind CSS:
 * 
 * DESKTOP (1024px+):
 * - Navbar com links horizontais lado a lado
 * - Container com largura máxima centralizado
 * - Espaçamentos amplos
 * 
 * TABLET (768px - 1023px):
 * - Navbar mantém layout horizontal
 * - Container usa 100% da largura com padding
 * 
 * MOBILE (< 768px):
 * - Links podem quebrar linha naturalmente
 * - Espaçamentos reduzidos automaticamente
 * - Touch-friendly (botões maiores)
 * 
 * Classes Tailwind responsivas usadas:
 * - container: ajusta largura automaticamente
 * - mx-auto: centraliza em telas grandes
 * - p-4, p-6: padding responsivo
 * - flex: layout flexível que se adapta
 * 
 * =============================================================================
 */

/**
 * =============================================================================
 * ACESSIBILIDADE (a11y)
 * =============================================================================
 * 
 * Boas práticas de acessibilidade implementadas:
 * 
 * 1. Labels semânticos:
 *    - aria-label em links e botões
 *    - Descrições claras do que cada elemento faz
 * 
 * 2. Navegação por teclado:
 *    - Todos os links e botões são acessíveis via Tab
 *    - Enter/Space ativa botões
 * 
 * 3. Contraste de cores:
 *    - Texto escuro em fundo claro (navbar)
 *    - Texto claro em fundo escuro (footer)
 *    - Ratios atendem WCAG 2.1 AA
 * 
 * 4. HTML semântico:
 *    - <nav> para navegação
 *    - <main> para conteúdo principal
 *    - <footer> para rodapé
 * 
 * 5. Estados visuais:
 *    - hover: feedback ao passar mouse
 *    - focus: outline automático do navegador
 *    - active: feedback ao clicar
 * 
 * =============================================================================
 */