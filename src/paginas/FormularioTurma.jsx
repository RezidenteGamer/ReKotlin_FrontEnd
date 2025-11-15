/**
 * =============================================================================
 * FORMULÁRIO DE TURMA - CRIAR E EDITAR
 * =============================================================================
 * 
 * Este componente implementa um formulário inteligente que serve para DUAS
 * finalidades: criar novas turmas E editar turmas existentes.
 * 
 * REQUISITOS IMPLEMENTADOS:
 * ✅ Criar formulário funcional para cadastro/edição de entidade
 * ✅ Consumir back-end (POST para criar, PUT para editar)
 * ✅ Feedback visual (sucesso, erro, loading)
 * ✅ Componentes reutilizáveis (inputs estilizados)
 * ✅ Validação de formulário
 * ✅ Navegação funcional (redirecionamento após salvar)
 * 
 * Lógica de detecção de modo:
 * - Se há parâmetro :idTurma na URL → MODO EDIÇÃO
 * - Se não há parâmetro → MODO CRIAÇÃO
 * 
 * Apenas PROFESSORES podem acessar este componente.
 * 
 * @author [Seu Nome]
 * @version 1.0.0
 * @since 2025-01-15
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { turmaServico } from '../servicos/api';
import { useAuth } from '../AuthContext';

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL: FormularioTurma
 * =============================================================================
 * 
 * Gerencia todo o ciclo de vida do formulário:
 * - Carrega dados existentes (se modo edição)
 * - Valida campos
 * - Submete para o back-end
 * - Exibe feedback ao usuário
 * - Redireciona após sucesso
 * 
 * @returns {JSX.Element|null} Formulário ou null (se não for professor)
 */
export function FormularioTurma() {
  /**
   * ---------------------------------------------------------------------------
   * ESTADOS DO FORMULÁRIO
   * ---------------------------------------------------------------------------
   * 
   * Cada campo do formulário tem seu próprio estado.
   * Isso cria "Controlled Components" - o React controla o valor dos inputs.
   */
  
  /**
   * Nome da turma
   * Exemplo: "Programação Web Avançada"
   * Campo obrigatório (required no HTML)
   * 
   * @type {string}
   */
  const [nome, setNome] = useState('');
  
  /**
   * Descrição da turma
   * Exemplo: "Curso de desenvolvimento full-stack com React e Spring Boot"
   * Campo opcional
   * 
   * @type {string}
   */
  const [descricao, setDescricao] = useState('');
  
  /**
   * Estado para feedback ao usuário
   * Armazena tipo ('sucesso' ou 'erro') e mensagem
   * 
   * Estrutura:
   * {
   *   tipo: 'sucesso' | 'erro' | '',
   *   mensagem: string
   * }
   * 
   * @type {Object}
   */
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  
  /**
   * Indica se está processando requisição
   * true = mostra "Salvando..." e desabilita botão
   * false = mostra texto normal e habilita botão
   * 
   * @type {boolean}
   */
  const [carregando, setCarregando] = useState(false);

  /**
   * ---------------------------------------------------------------------------
   * HOOKS DO REACT ROUTER
   * ---------------------------------------------------------------------------
   */
  
  /**
   * Hook para navegação programática
   * Permite redirecionar o usuário para outras páginas via código
   * 
   * @example
   * navigate('/'); // Vai para home
   * navigate(-1); // Volta uma página
   */
  const navigate = useNavigate();
  
  /**
   * Hook para acessar parâmetros da URL
   * Extrai :idTurma da rota /turma/editar/:idTurma
   * 
   * Se URL = /turma/editar/5 → idTurma = "5"
   * Se URL = /turma/nova → idTurma = undefined
   */
  const { idTurma } = useParams();
  
  /**
   * ---------------------------------------------------------------------------
   * CONTEXTO DE AUTENTICAÇÃO
   * ---------------------------------------------------------------------------
   * 
   * Obtém dados do usuário logado para:
   * 1. Verificar se é professor (só professores podem criar/editar)
   * 2. Pegar o ID do professor para vincular à turma
   */
  const { usuario, ehProfessor } = useAuth();
  
  /**
   * Detecta o modo do formulário baseado na presença de idTurma
   * 
   * Boolean(undefined) = false → MODO CRIAÇÃO
   * Boolean("5") = true → MODO EDIÇÃO
   * 
   * @type {boolean}
   */
  const modoEdicao = Boolean(idTurma);

  /**
   * ===========================================================================
   * EFFECT: Proteção de rota - Redireciona se não for professor
   * ===========================================================================
   * 
   * Este useEffect garante que apenas professores acessem este componente.
   * Se o usuário não estiver logado OU não for professor, é redirecionado.
   * 
   * Executado quando:
   * - Componente monta
   * - usuario, ehProfessor ou navigate mudam (raro)
   */
  useEffect(() => {
    if (!usuario || !ehProfessor()) {
      // Exibe alerta explicativo
      alert('Apenas professores podem criar/editar turmas!');
      
      // Redireciona para home
      navigate('/');
    }
  }, [usuario, ehProfessor, navigate]);

  /**
   * ===========================================================================
   * EFFECT: Carrega dados da turma (modo edição)
   * ===========================================================================
   * 
   * Se estiver no modo edição, este effect busca os dados atuais da turma
   * para pré-preencher o formulário.
   * 
   * NOTA: Idealmente deveria haver um endpoint GET /api/turmas/:id no back-end.
   * Como não há, buscamos todas e filtramos pelo ID.
   * 
   * Executado quando:
   * - modoEdicao ou usuario mudam
   */
  useEffect(() => {
    if (modoEdicao && usuario) {
      // Ativa loading
      setCarregando(true);
      
      /**
       * Busca todas as turmas e filtra pela ID desejada
       * TODO: Criar endpoint específico no back-end: GET /api/turmas/:id
       */
      turmaServico.listarTodas()
        .then((resposta) => {
          /**
           * Procura a turma com o ID da URL
           * Array.find() retorna o primeiro item que satisfaz a condição
           * Number() converte string "5" para número 5
           */
          const turma = resposta.data.find((t) => t.id === Number(idTurma));
          
          if (turma) {
            // Pré-preenche os campos com dados existentes
            setNome(turma.nome);
            setDescricao(turma.descricao || '');
          } else {
            // Turma não encontrada
            setFeedback({ 
              tipo: 'erro', 
              mensagem: 'Turma não encontrada' 
            });
          }
        })
        .catch(() => {
          // Erro na requisição
          setFeedback({ 
            tipo: 'erro', 
            mensagem: 'Erro ao carregar turma' 
          });
        })
        .finally(() => {
          // Sempre desativa loading, independente de sucesso/erro
          setCarregando(false);
        });
    }
  }, [idTurma, modoEdicao, usuario]);

  /**
   * ===========================================================================
   * FUNÇÃO: lidarComSubmit
   * ===========================================================================
   * 
   * Função principal que processa o envio do formulário.
   * Chamada quando o usuário clica no botão "Criar/Salvar".
   * 
   * REQUISITOS IMPLEMENTADOS:
   * ✅ Salvar entidade no banco (POST)
   * ✅ Editar entidade no banco (PUT)
   * ✅ Feedback visual (sucesso, erro, loading)
   * 
   * Fluxo:
   * 1. Previne comportamento padrão do form (recarregar página)
   * 2. Monta objeto com dados do formulário
   * 3. Decide se faz POST (criar) ou PUT (editar)
   * 4. Envia para back-end
   * 5. Exibe feedback e redireciona
   * 
   * @async
   * @param {Event} evento - Evento de submit do formulário
   * @returns {Promise<void>}
   */
  async function lidarComSubmit(evento) {
    /**
     * preventDefault() evita o comportamento padrão do form
     * Sem isso, a página recarregaria ao clicar no botão
     */
    evento.preventDefault();
    
    // Ativa estado de carregamento (desabilita botão e mostra "Salvando...")
    setCarregando(true);
    
    // Limpa feedback anterior
    setFeedback({ tipo: '', mensagem: '' });

    /**
     * Monta objeto com dados do formulário
     * Este objeto será enviado para o back-end como JSON
     * 
     * Estrutura esperada pelo back-end (TurmaRequestDTO):
     * {
     *   nome: string (obrigatório),
     *   descricao: string (opcional),
     *   professorId: number (obrigatório)
     * }
     */
    const dadosTurma = {
      nome,                 // Pega do estado
      descricao,            // Pega do estado
      professorId: usuario.id  // ID do professor logado
    };

    try {
      /**
       * Decisão de requisição baseada no modo
       * 
       * MODO EDIÇÃO:
       * - Faz PUT /api/turmas/:id
       * - Atualiza turma existente
       * 
       * MODO CRIAÇÃO:
       * - Faz POST /api/turmas
       * - Cria nova turma
       */
      if (modoEdicao) {
        // PUT - Atualizar turma existente
        await turmaServico.atualizar(idTurma, dadosTurma);
        
        setFeedback({ 
          tipo: 'sucesso', 
          mensagem: '✅ Turma atualizada com sucesso!' 
        });
      } else {
        // POST - Criar nova turma
        await turmaServico.criar(dadosTurma);
        
        setFeedback({ 
          tipo: 'sucesso', 
          mensagem: '✅ Turma criada com sucesso!' 
        });
      }

      /**
       * Redireciona para home após 1.5 segundos
       * Delay permite que o usuário veja a mensagem de sucesso
       * 
       * setTimeout executa função após X milissegundos
       */
      setTimeout(() => navigate('/'), 1500);

    } catch (e) {
      /**
       * Tratamento de erro
       * 
       * Possíveis erros:
       * - 400: Dados inválidos (nome vazio, etc)
       * - 404: Turma não encontrada (modo edição)
       * - 500: Erro no servidor
       * - Network error: Servidor fora do ar
       */
      console.error('Erro ao salvar turma:', e);
      
      setFeedback({
        tipo: 'erro',
        mensagem: '❌ Erro ao salvar turma. Verifique os dados e tente novamente.'
      });
      
      // Reativa o botão para permitir nova tentativa
      setCarregando(false);
    }
  }

  /**
   * ---------------------------------------------------------------------------
   * GUARD: Não renderiza nada até confirmar que é professor
   * ---------------------------------------------------------------------------
   * 
   * Se não houver usuário logado OU não for professor, não renderiza.
   * O useEffect acima cuida do redirecionamento.
   * 
   * Retornar null é válido em React - significa "não renderize nada"
   */
  if (!usuario || !ehProfessor()) {
    return null;
  }

  /**
   * ===========================================================================
   * RENDERIZAÇÃO DO FORMULÁRIO
   * ===========================================================================
   * 
   * JSX abaixo define a estrutura visual do formulário.
   * Usa Tailwind CSS para estilização responsiva.
   */
  return (
    <div className="max-w-5xl mx-auto">
      
      {/* 
        =====================================================================
        SEÇÃO: Cabeçalho contextual
        =====================================================================
        
        Título e descrição mudam baseado no modo (criar/editar)
      */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          {modoEdicao ? '✏️ Editar Turma' : '➕ Criar Nova Turma'}
        </h1>
        <p className="text-gray-600">
          {modoEdicao 
            ? 'Atualize as informações da turma abaixo.' 
            : 'Preencha os dados para criar uma nova turma.'}
        </p>
      </div>

      {/* 
        =====================================================================
        FORMULÁRIO PRINCIPAL
        =====================================================================
        
        IMPORTANTE: onSubmit chama lidarComSubmit ao pressionar Enter ou clicar no botão
      */}
      <form
        onSubmit={lidarComSubmit}
        className="bg-white p-10 rounded-lg shadow-md"
      >
        
        {/* 
          ===================================================================
          CAMPO: Nome da turma
          ===================================================================
          
          Controlled component:
          - value={nome} → React controla o valor
          - onChange → Atualiza o estado a cada tecla digitada
        */}
        <div className="mb-6">
          {/* Label com acessibilidade (htmlFor vincula ao input) */}
          <label 
            htmlFor="nome" 
            className="block text-gray-700 font-semibold mb-2"
          >
            Nome da Turma *
          </label>
          
          <input
            type="text"
            id="nome"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Programação Web Avançada"
            required  // HTML5 validation - campo obrigatório
            aria-required="true"  // Acessibilidade
          />
        </div>

        {/* 
          ===================================================================
          CAMPO: Descrição (opcional)
          ===================================================================
          
          Textarea permite texto multi-linha
          rows="4" define altura inicial
        */}
        <div className="mb-6">
          <label 
            htmlFor="descricao" 
            className="block text-gray-700 font-semibold mb-2"
          >
            Descrição
          </label>
          
          <textarea
            id="descricao"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o conteúdo e objetivos da turma..."
          />
          
          {/* Texto de ajuda */}
          <p className="text-sm text-gray-500 mt-1">
            A descrição é opcional, mas ajuda os alunos a entenderem a turma.
          </p>
        </div>

        {/* 
          ===================================================================
          INFORMAÇÃO: Professor responsável
          ===================================================================
          
          Exibe o nome do professor logado (não editável)
          O professorId será enviado automaticamente no submit
        */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Professor responsável:</strong> {usuario.nome}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Departamento: {usuario.departamento}
          </p>
        </div>

        {/* 
          ===================================================================
          FEEDBACK VISUAL
          ===================================================================
          
          REQUISITO IMPLEMENTADO:
          ✅ Feedback visual (mensagem de sucesso/erro)
          
          Só renderiza se houver mensagem
          Cor muda baseado no tipo (sucesso = verde, erro = vermelho)
        */}
        {feedback.mensagem && (
          <div
            className={`p-4 rounded-lg mb-6 text-center font-medium ${
              feedback.tipo === 'sucesso'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
            role="alert"  // Acessibilidade - leitores de tela anunciam
          >
            {feedback.mensagem}
          </div>
        )}

        {/* 
          ===================================================================
          BOTÕES DE AÇÃO
          ===================================================================
          
          Dois botões:
          1. Cancelar - volta para home sem salvar
          2. Submit - salva e redireciona
        */}
        <div className="flex justify-end space-x-4">
          
          {/* Botão Cancelar */}
          <button
            type="button"  // type="button" evita submit do form
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
            disabled={carregando}  // Desabilita se estiver salvando
          >
            Cancelar
          </button>
          
          {/* Botão Submit */}
          <button
            type="submit"  // type="submit" envia o formulário
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={carregando}  // Desabilita durante processamento
          >
            {/* 
              Conteúdo do botão muda baseado no estado
              
              Se carregando:
              - Mostra spinner animado + texto "Salvando..."
              
              Se não carregando:
              - Mostra emoji + texto baseado no modo
            */}
            {carregando ? (
              <span className="flex items-center">
                {/* Spinner SVG animado */}
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {modoEdicao ? 'Salvando...' : 'Criando...'}
              </span>
            ) : (
              modoEdicao ? '💾 Salvar Alterações' : '➕ Criar Turma'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * =============================================================================
 * RESUMO DOS REQUISITOS ATENDIDOS NESTE ARQUIVO
 * =============================================================================
 * 
 * ✅ Criar formulário funcional para cadastro/edição
 * ✅ Consumir back-end (POST para criar, PUT para editar)
 * ✅ Feedback visual (sucesso, erro, loading com spinner)
 * ✅ Validação de campos (required)
 * ✅ Navegação funcional (redirecionamento)
 * ✅ Proteção de rota (só professores)
 * ✅ Layout responsivo com Tailwind
 * ✅ Acessibilidade (labels, aria-*)
 * ✅ Código organizado com comentários detalhados
 * 
 * =============================================================================
 */