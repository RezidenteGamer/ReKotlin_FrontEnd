/**
 * =============================================================================
 * PÁGINA DE LOGIN
 * =============================================================================
 * 
 * Tela de autenticação que permite professores e acadêmicos fazerem login.
 * 
 * FUNCIONALIDADE EXTRA: Sistema completo de autenticação
 * 
 * REQUISITOS IMPLEMENTADOS:
 * Criar formulário funcional
 * Consumir back-end (POST para autenticação)
 * Feedback visual (erro, loading)
 * Navegação funcional (redireciona após sucesso)
 * Layout responsivo e organizado
 * 
 * Fluxo de autenticação:
 * 1. Usuário escolhe tipo em /selecionar-tipo
 * 2. É redirecionado para /login/professor ou /login/academico
 * 3. Preenche email e senha
 * 4. Submit envia credenciais para back-end
 * 5. Back-end valida e retorna dados do usuário
 * 6. Dados são salvos no AuthContext (estado global + localStorage)
 * 7. Usuário é redirecionado para home (/)
 * 
 * Design adaptativo:
 * - Cor e ícone mudam baseado no tipo (azul para professor, verde para acadêmico)
 * - Mensagens personalizadas
 * - Placeholders contextuais
 * 
 * @author [Seu Nome]
 * @version 1.0.0
 * @since 2025-01-15
 */

import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { autenticacaoServico } from '../servicos/api';
import { useAuth } from '../AuthContext';

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL: Login
 * =============================================================================
 * 
 * Gerencia todo o processo de autenticação:
 * - Captura credenciais do usuário
 * - Envia para back-end
 * - Trata sucesso/erro
 * - Salva sessão
 * - Redireciona usuário
 * 
 * @returns {JSX.Element} Tela de login completa
 */
export function Login() {
  /**
   * ---------------------------------------------------------------------------
   * PARÂMETROS DA URL
   * ---------------------------------------------------------------------------
   * 
   * Extrai :tipo da URL /login/:tipo
   * 
   * Possíveis valores:
   * - "professor" → /login/professor
   * - "academico" → /login/academico
   * 
   * Este valor determina:
   * - Cor do tema (azul vs verde)
   * - Ícone exibido
   * - Placeholder do email
   * - Tipo enviado ao back-end
   */
  const { tipo } = useParams();
  
  /**
   * ---------------------------------------------------------------------------
   * HOOKS DE NAVEGAÇÃO E AUTENTICAÇÃO
   * ---------------------------------------------------------------------------
   */
  
  /**
   * Hook para navegação programática
   * Usado para redirecionar após login bem-sucedido
   */
  const navigate = useNavigate();
  
  /**
   * Hook do contexto de autenticação
   * Fornece função login() para salvar dados do usuário
   */
  const { login } = useAuth();

  /**
   * ---------------------------------------------------------------------------
   * ESTADOS DO FORMULÁRIO
   * ---------------------------------------------------------------------------
   * 
   * Controlled components: React controla o valor de cada input
   */
  
  /**
   * Email digitado pelo usuário
   * Exemplo: "professor@email.com"
   * 
   * @type {string}
   */
  const [email, setEmail] = useState('');
  
  /**
   * Senha digitada pelo usuário
   * Exemplo: "123456"
   * IMPORTANTE: Em produção, nunca armazene senhas em texto plano!
   * 
   * @type {string}
   */
  const [senha, setSenha] = useState('');
  
  /**
   * Mensagem de erro a ser exibida
   * Vazio = sem erro
   * String = erro a ser mostrado ao usuário
   * 
   * @type {string}
   */
  const [erro, setErro] = useState('');
  
  /**
   * Indica se está processando login
   * true = mostra "Entrando..." e desabilita botão
   * false = mostra "Entrar" e habilita botão
   * 
   * @type {boolean}
   */
  const [carregando, setCarregando] = useState(false);

  /**
   * ---------------------------------------------------------------------------
   * VARIÁVEIS DERIVADAS
   * ---------------------------------------------------------------------------
   * 
   * Valores calculados a partir dos estados/parâmetros existentes
   */
  
  /**
   * Converte tipo da URL para formato esperado pelo back-end
   * 
   * URL contém: "professor" ou "academico" (minúsculo)
   * Back-end espera: "PROFESSOR" ou "ACADEMICO" (maiúsculo)
   * 
   * @type {string}
   */
  const tipoUsuario = tipo.toUpperCase();
  
  /**
   * Nome exibido na interface
   * Usado em títulos e mensagens
   * 
   * Operador ternário: condição ? valorSeTrue : valorSeFalse
   * 
   * @type {string}
   */
  const nomeExibicao = tipo === 'professor' ? 'Professor' : 'Acadêmico';

  /**
   * ===========================================================================
   * FUNÇÃO: handleSubmit
   * ===========================================================================
   * 
   * Processa o envio do formulário de login.
   * 
   * REQUISITOS IMPLEMENTADOS:
   * Consumir back-end com POST
   * Feedback visual (loading, erro)
   * Salvar dados de autenticação
   * Navegação funcional (redirecionar após sucesso)
   * 
   * Fluxo completo:
   * 1. Previne reload da página
   * 2. Limpa erros anteriores
   * 3. Ativa loading
   * 4. Monta objeto com credenciais
   * 5. Envia POST para /api/auth/login
   * 6. Se sucesso:
   *    - Salva dados no AuthContext
   *    - Redireciona para home
   * 7. Se erro:
   *    - Exibe mensagem apropriada
   *    - Desativa loading
   * 
   * @async
   * @param {Event} e - Evento de submit do formulário
   * @returns {Promise<void>}
   */
  const handleSubmit = async (e) => {
    /**
     * Previne comportamento padrão do form
     * Sem isso, a página recarregaria ao submeter
     */
    e.preventDefault();
    
    // Limpa mensagem de erro anterior (se houver)
    setErro('');
    
    // Ativa estado de loading
    setCarregando(true);

    try {
      /**
       * -----------------------------------------------------------------------
       * REQUISIÇÃO: POST /api/auth/login
       * -----------------------------------------------------------------------
       * 
       * Envia credenciais para o back-end validar.
       * 
       * Body da requisição (JSON):
       * {
       *   "email": "usuario@email.com",
       *   "senha": "123456",
       *   "tipoUsuario": "PROFESSOR" ou "ACADEMICO"
       * }
       * 
       * Resposta esperada (se sucesso):
       * {
       *   "id": 1,
       *   "email": "usuario@email.com",
       *   "nome": "João Silva",
       *   "tipoUsuario": "PROFESSOR",
       *   "departamento": "Ciência da Computação"  // ou matricula se acadêmico
       * }
       */
      const resposta = await autenticacaoServico.login({
        email,
        senha,
        tipoUsuario
      });

      /**
       * -----------------------------------------------------------------------
       * SUCESSO: Salvar sessão e redirecionar
       * -----------------------------------------------------------------------
       * 
       * Se chegou aqui, autenticação foi bem-sucedida.
       * 
       * login() do AuthContext:
       * 1. Salva dados no estado React (re-renderiza componentes)
       * 2. Salva dados no localStorage (persiste entre sessões)
       */
      login(resposta.data);

      /**
       * Redireciona para home (/)
       * Usuário verá ListaTurmas com navbar personalizada
       */
      navigate('/');

    } catch (error) {
      /**
       * -----------------------------------------------------------------------
       * ERRO: Tratar e exibir mensagem apropriada
       * -----------------------------------------------------------------------
       * 
       * Possíveis erros:
       * - 401 Unauthorized: Credenciais incorretas
       * - 500 Server Error: Erro no back-end
       * - Network Error: Servidor fora do ar
       */
      
      /**
       * Verifica status HTTP do erro
       * 
       * error.response?.status usa optional chaining (?.)
       * Se error.response for undefined, retorna undefined sem erro
       */
      if (error.response?.status === 401) {
        /**
         * 401 = Não autorizado
         * Credenciais inválidas ou tipo de usuário errado
         */
        setErro('Email, senha ou tipo de usuário incorretos');
      } else {
        /**
         * Outros erros
         * Geralmente problemas de conexão ou servidor
         */
        setErro('Erro ao conectar com o servidor');
      }
    } finally {
      /**
       * finally sempre executa, independente de sucesso ou erro
       * 
       * Desativa loading para reabilitar o botão
       * (Só desabilita se houver erro; se sucesso, página já mudou)
       */
      setCarregando(false);
    }
  };

  /**
   * ===========================================================================
   * RENDERIZAÇÃO DA PÁGINA
   * ===========================================================================
   * 
   * Design adaptativo que muda cores baseado no tipo de usuário:
   * - Professor: tons de azul
   * - Acadêmico: tons de verde
   */
  return (
    /**
     * Container principal
     * 
     * Classes Tailwind:
     * - min-h-screen: altura mínima = 100vh (tela inteira)
     * - flex items-center justify-center: centraliza conteúdo
     * - bg-gradient-to-br: gradiente diagonal
     * - from-blue-500 to-purple-600: cores do gradiente
     */
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      
      {/* 
        Card branco centralizado com formulário
        
        Classes importantes:
        - max-w-2xl: largura máxima de 42rem (672px)
        - w-full: 100% de largura até atingir max-w
        - shadow-2xl: sombra bem pronunciada
      */}
      <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-2xl">
        
        {/* 
          ===================================================================
          CABEÇALHO: Ícone + Título
          ===================================================================
        */}
        <div className="text-center mb-10">
          
          {/* 
            Container do ícone
            Fundo colorido baseado no tipo (azul ou verde)
            
            Template literal com operador ternário:
            `classe ${condicao ? 'se-true' : 'se-false'}`
          */}
          <div className={`inline-block p-5 rounded-full mb-4 ${
            tipo === 'professor' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            
            {/* 
              Ícone SVG
              Também muda cor baseado no tipo
            */}
            <svg 
              className={`w-16 h-16 ${
                tipo === 'professor' ? 'text-blue-600' : 'text-green-600'
              }`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              {/* 
                Path do ícone muda baseado no tipo:
                - Professor: ícone de graduação/capelo
                - Acadêmico: ícone de pessoa
              */}
              {tipo === 'professor' ? (
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              ) : (
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              )}
            </svg>
          </div>
          
          {/* Título com tipo de usuário */}
          <h1 className="text-4xl font-bold text-gray-800">
            Login {nomeExibicao}
          </h1>
          
          {/* Subtítulo */}
          <p className="text-gray-600 mt-3 text-lg">
            Entre com suas credenciais
          </p>
        </div>

        {/* 
          ===================================================================
          FORMULÁRIO DE LOGIN
          ===================================================================
        */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 
            -----------------------------------------------------------------
            CAMPO: Email
            -----------------------------------------------------------------
          */}
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Email
            </label>
            
            {/* 
              Input de email
              
              Atributos importantes:
              - type="email": validação HTML5 de formato de email
              - required: campo obrigatório
              - value={email}: controlled component
              - onChange: atualiza estado a cada tecla
            */}
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`seu.email@${tipo === 'professor' ? 'professor' : 'aluno'}.com`}
              required
              aria-required="true"
            />
          </div>

          {/* 
            -----------------------------------------------------------------
            CAMPO: Senha
            -----------------------------------------------------------------
          */}
          <div>
            <label 
              htmlFor="senha" 
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Senha
            </label>
            
            {/* 
              Input de senha
              
              type="password" oculta caracteres digitados
            */}
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
              aria-required="true"
            />
          </div>

          {/* 
            -----------------------------------------------------------------
            FEEDBACK: Mensagem de erro
            -----------------------------------------------------------------
            
            REQUISITO IMPLEMENTADO:
            ✅ Feedback visual - mensagem de erro
            
            Só renderiza se houver erro
            Renderização condicional: {condicao && <elemento>}
          */}
          {erro && (
            <div 
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg"
              role="alert"
            >
              {erro}
            </div>
          )}

          {/* 
            -----------------------------------------------------------------
            BOTÃO DE SUBMIT
            -----------------------------------------------------------------
            
            Cor muda baseado no tipo (azul para professor, verde para acadêmico)
            Desabilita durante processamento (carregando === true)
          */}
          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transform transition ${
              tipo === 'professor'
                ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
            } disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none`}
          >
            {/* 
              Texto muda baseado no estado de carregamento
              Se carregando: "Entrando..."
              Se não: "Entrar"
            */}
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* 
          ===================================================================
          LINK: Voltar para seleção de tipo
          ===================================================================
          
          Permite que o usuário volte caso tenha escolhido tipo errado
        */}
        <div className="text-center mt-6">
          <Link 
            to="/selecionar-tipo" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Voltar para seleção de tipo
          </Link>
        </div>

        {/* 
          ===================================================================
          DICA: Credenciais de teste
          ===================================================================
          
          Card informativo com dica para facilitar testes
          Ajuda avaliadores/desenvolvedores a testarem o sistema
        */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-1">
            💡 Dica para testes:
          </p>
          <p className="text-xs text-gray-500">
            Use os usuários que você criou no banco de dados
          </p>
        </div>
      </div>
    </div>
  );
}


/**
 * =============================================================================
 * FLUXO COMPLETO DE AUTENTICAÇÃO
 * =============================================================================
 * 
 * 1. Usuário acessa /selecionar-tipo
 *    └─> Escolhe "Sou Professor"
 * 
 * 2. Navega para /login/professor
 *    └─> Preenche email e senha
 *    └─> Clica em "Entrar"
 * 
 * 3. handleSubmit é executado
 *    └─> POST /api/auth/login
 *    └─> Body: { email, senha, tipoUsuario: "PROFESSOR" }
 * 
 * 4. Back-end valida credenciais
 *    └─> Se inválido: retorna 401
 *    └─> Se válido: retorna dados do usuário
 * 
 * 5. Front-end recebe resposta
 *    └─> login(resposta.data) salva no contexto
 *    └─> Estado React atualizado
 *    └─> localStorage atualizado
 * 
 * 6. navigate('/') redireciona para home
 *    └─> RotaProtegida detecta usuário logado
 *    └─> Permite acesso
 *    └─> Renderiza ListaTurmas com navbar personalizada
 * 
 * 7. Usuário está autenticado!
 *    └─> Pode navegar entre páginas protegidas
 *    └─> Sessão persiste ao recarregar página
 *    └─> Logout remove dados e volta ao login
 * 
 * =============================================================================
 */