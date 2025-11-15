/**
 * =============================================================================
 * PÁGINA DE SELEÇÃO DE TIPO DE USUÁRIO
 * =============================================================================
 * 
 * Primeira tela que o usuário vê ao acessar a aplicação.
 * Permite escolher entre "Sou Professor" ou "Sou Acadêmico".
 * 
 * FUNCIONALIDADE EXTRA: Sistema completo de autenticação
 * 
 * REQUISITOS IMPLEMENTADOS:
 * ✅ Navegação funcional (redireciona para tela de login apropriada)
 * ✅ Layout organizado e responsivo
 * ✅ Componentes interativos (botões grandes e clicáveis)
 * 
 * Por que essa tela existe?
 * - Melhora UX (experiência do usuário)
 * - Evita confusão sobre qual tipo de conta usar
 * - Permite design diferenciado por tipo (cores, ícones)
 * - Facilita validação no back-end (tipo enviado explicitamente)
 * 
 * Fluxo de navegação:
 * 1. Usuário acessa /selecionar-tipo
 * 2. Clica em "Sou Professor" ou "Sou Acadêmico"
 * 3. É redirecionado para /login/professor ou /login/academico
 * 4. Faz login com credenciais
 * 5. Entra na aplicação
 * 
 * @author [Seu Nome]
 * @version 1.0.0
 * @since 2025-01-15
 */

import { useNavigate } from 'react-router-dom';

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL: SelecionarTipo
 * =============================================================================
 * 
 * Componente simples que renderiza dois grandes botões interativos.
 * Cada botão redireciona para a tela de login apropriada.
 * 
 * Design principles:
 * - Minimalista: apenas o essencial (dois botões)
 * - Visual: ícones grandes e cores distintas
 * - Intuitivo: texto claro sobre cada opção
 * - Acessível: navegação por teclado, labels apropriados
 * 
 * @returns {JSX.Element} Página de seleção de tipo
 */
export function SelecionarTipo() {
  /**
   * ---------------------------------------------------------------------------
   * HOOK: useNavigate
   * ---------------------------------------------------------------------------
   * 
   * Permite navegação programática (via código, não apenas cliques em <Link>)
   * Usado aqui para redirecionar após o usuário clicar em um botão
   */
  const navigate = useNavigate();

  /**
   * ===========================================================================
   * FUNÇÃO: selecionarTipo
   * ===========================================================================
   * 
   * Chamada quando o usuário clica em um dos botões.
   * Redireciona para a tela de login correspondente.
   * 
   * Fluxo:
   * 1. Recebe tipo ("PROFESSOR" ou "ACADEMICO")
   * 2. Converte para minúsculo
   * 3. Navega para /login/:tipo
   * 
   * Por que converter para minúsculo?
   * - URLs são case-sensitive em alguns servidores
   * - Padrão REST usa minúsculas em URLs
   * - /login/professor é mais limpo que /login/PROFESSOR
   * 
   * @param {string} tipo - Tipo de usuário ("PROFESSOR" ou "ACADEMICO")
   * @returns {void}
   * 
   * @example
   * selecionarTipo("PROFESSOR")  // Navega para /login/professor
   * selecionarTipo("ACADEMICO")  // Navega para /login/academico
   */
  const selecionarTipo = (tipo) => {
    /**
     * toLowerCase() converte string para minúsculo
     * "PROFESSOR" → "professor"
     * "ACADEMICO" → "academico"
     * 
     * Template literal constrói URL dinamicamente
     * `/login/${tipo.toLowerCase()}` → "/login/professor"
     */
    navigate(`/login/${tipo.toLowerCase()}`);
  };

  /**
   * ===========================================================================
   * RENDERIZAÇÃO DA PÁGINA
   * ===========================================================================
   * 
   * Design centrado com gradiente colorido de fundo.
   * Card branco centralizado com dois botões grandes.
   */
  return (
    /**
     * Container principal
     * 
     * Classes Tailwind explicadas:
     * - min-h-screen: altura mínima = 100vh (tela inteira)
     * - flex items-center justify-center: centraliza conteúdo vertical e horizontalmente
     * - bg-gradient-to-br: gradiente background diagonal (bottom-right)
     * - from-blue-500 to-purple-600: cores do gradiente
     * 
     * Resultado visual:
     * Tela inteira preenchida com gradiente azul→roxo
     * Conteúdo perfeitamente centralizado
     */
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      
      {/* 
        Card branco centralizado
        
        Classes importantes:
        - bg-white: fundo branco sólido
        - p-12: padding de 3rem (48px) em todos os lados
        - rounded-2xl: bordas bem arredondadas (1rem/16px)
        - shadow-2xl: sombra bem pronunciada (destaque)
        - w-full: largura 100% (até atingir max-w)
        - max-w-2xl: largura máxima de 42rem (672px)
        
        Em telas grandes: 672px de largura, centralizado
        Em telas pequenas: 100% da largura com padding
      */}
      <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-2xl">
        
        {/* 
          ===================================================================
          CABEÇALHO: Título e Subtítulo
          ===================================================================
        */}
        
        {/* 
          Título principal
          text-4xl: tamanho de fonte extra grande (2.25rem/36px)
          font-bold: peso de fonte 700
          text-center: centralizado horizontalmente
          mb-3: margin-bottom de 0.75rem (12px)
        */}
        <h1 className="text-4xl font-bold text-center mb-3 text-gray-800">
          Portal Acadêmico
        </h1>
        
        {/* 
          Subtítulo explicativo
          text-lg: tamanho de fonte grande (1.125rem/18px)
          text-gray-600: cor cinza média
          mb-10: margin-bottom de 2.5rem (40px) - espaço para botões
        */}
        <p className="text-center text-gray-600 mb-10 text-lg">
          Bem-vindo! Selecione o tipo de usuário:
        </p>

        {/* 
          ===================================================================
          BOTÕES DE SELEÇÃO
          ===================================================================
          
          Container dos botões com espaçamento vertical entre eles
          space-y-6: espaço vertical de 1.5rem (24px) entre elementos filhos
        */}
        <div className="space-y-6">
          
          {/* 
            -----------------------------------------------------------------
            BOTÃO: Sou Professor
            -----------------------------------------------------------------
            
            Botão grande e interativo com ícone e texto.
            Cor azul para identificar professores.
            
            onClick chama selecionarTipo("PROFESSOR")
            que redireciona para /login/professor
          */}
          <button
            onClick={() => selecionarTipo('PROFESSOR')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 px-8 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center justify-center space-x-4"
            aria-label="Entrar como Professor"
          >
            {/* 
              Ícone SVG de graduação/capelo
              
              Representa professores/educação
              w-8 h-8: tamanho 2rem (32px)
              fill="currentColor": herda cor do texto (branco)
            */}
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            
            {/* 
              Texto do botão
              text-2xl: tamanho de fonte extra grande (1.5rem/24px)
            */}
            <span className="text-2xl">Sou Professor</span>
          </button>

          {/* 
            -----------------------------------------------------------------
            BOTÃO: Sou Acadêmico
            -----------------------------------------------------------------
            
            Similar ao botão de professor, mas:
            - Cor verde (diferenciação visual)
            - Ícone de pessoa (representa estudante)
            - Redireciona para /login/academico
          */}
          <button
            onClick={() => selecionarTipo('ACADEMICO')}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 px-8 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center justify-center space-x-4"
            aria-label="Entrar como Acadêmico"
          >
            {/* 
              Ícone SVG de pessoa
              Representa estudantes/acadêmicos
            */}
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
            </svg>
            
            {/* Texto do botão */}
            <span className="text-2xl">Sou Acadêmico</span>
          </button>
        </div>

        {/* 
          ===================================================================
          RODAPÉ: Texto informativo
          ===================================================================
          
          Pequeno texto auxiliar na parte inferior do card
        */}
        <p className="text-center text-gray-500 text-sm mt-6">
          Selecione seu perfil para acessar o sistema
        </p>
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * DETALHES DE DESIGN E UX
 * =============================================================================
 * 
 * CORES E SIGNIFICADO:
 * - Azul (Professor): Tradicionalmente associado a profissionalismo, confiança
 * - Verde (Acadêmico): Associado a crescimento, aprendizado, juventude
 * - Gradiente de fundo: Moderno, vibrante, chama atenção
 * - Branco do card: Limpeza, foco, contraste com o fundo
 * 
 * INTERATIVIDADE:
 * - hover:bg-*-700: Escurece ao passar mouse (feedback visual)
 * - hover:scale-105: Aumenta levemente ao passar mouse (efeito zoom)
 * - transform transition: Animação suave das mudanças
 * - shadow-lg: Sombra dá impressão de profundidade/clicabilidade
 * 
 * ACESSIBILIDADE:
 * - aria-label: Descreve função do botão para leitores de tela
 * - Botões grandes: Fáceis de clicar (mobile-friendly)
 * - Alto contraste: Texto branco em fundo colorido
 * - Navegação por teclado: Tab para focar, Enter para clicar
 * 
 * RESPONSIVIDADE:
 * - max-w-2xl: Limita largura em telas grandes (não fica gigante)
 * - w-full: Ocupa 100% em telas pequenas
 * - p-12: Padding adequado em todas as telas
 * - flex flex-col: Layout vertical funciona em qualquer tamanho
 * 
 * =============================================================================
 */
