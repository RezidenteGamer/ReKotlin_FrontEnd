/**
 * =============================================================================
 * LISTA DE TURMAS - PÁGINA PRINCIPAL
 * =============================================================================
 * 
 * Esta é a página inicial da aplicação que exibe todas as turmas cadastradas.
 * 
 * REQUISITOS IMPLEMENTADOS:
 *  Exibir lista de entidades (cards) com dados vindos do back-end
 *  Implementar busca/filtro de entidades (por nome)
 *  Permitir exclusão diretamente pela interface
 *  Feedback visual (loading, erro, sucesso)
 *  Componentes reutilizáveis (CardTurma)
 *  FUNCIONALIDADE EXTRA: Sistema de matrícula para acadêmicos
 * 
 * Funcionalidades por tipo de usuário:
 * - PROFESSOR: Ver todas as turmas, editar suas turmas, excluir suas turmas
 * - ACADÊMICO: Ver todas as turmas, matricular-se em turmas
 * - NÃO LOGADO: Apenas visualizar (sem ações)
 * 
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, turmaServico } from '../servicos/api';
import { useAuth } from '../AuthContext';

/**
 * =============================================================================
 * COMPONENTE: CardTurma (Reutilizável)
 * =============================================================================
 * 
 * Componente responsável por exibir uma turma individual em formato de card.
 * Este é um exemplo de COMPONENTE REUTILIZÁVEL (requisito do trabalho).
 * 
 * Benefícios de componentes reutilizáveis:
 * - Código mais organizado e limpo
 * - Facilita manutenção (mudança em um lugar afeta todos os cards)
 * - Permite testar o componente isoladamente
 * - Promove consistência visual na aplicação
 * 
 * @param {Object} props - Propriedades do componente
 * @param {Object} props.turma - Objeto com dados da turma
 * @param {number} props.turma.id - ID único da turma
 * @param {string} props.turma.nome - Nome da turma
 * @param {string} props.turma.descricao - Descrição da turma
 * @param {string} props.turma.nomeProfessor - Nome do professor responsável
 * @param {number} props.turma.quantidadeAlunos - Número de alunos matriculados
 * @param {Function} props.aoExcluir - Callback chamada ao clicar em "Excluir"
 * @param {Function} props.aoMatricular - Callback chamada ao clicar em "Matricular"
 * @param {boolean} props.ehProfessor - Se o usuário atual é professor
 * @param {boolean} props.ehAcademico - Se o usuário atual é acadêmico
 * 
 * @example
 * <CardTurma 
 *   turma={turmaObj} 
 *   aoExcluir={handleExcluir}
 *   aoMatricular={handleMatricular}
 *   ehProfessor={true}
 *   ehAcademico={false}
 * />
 */
function CardTurma({ turma, aoExcluir, aoMatricular, ehProfessor, ehAcademico, inscrito }) {
  
  const exportarAlunos = async (idTurma) => {
    const response = await api.get(`turmas/${idTurma}/alunos/pdf`, {
      responseType: "blob"
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "alunos.pdf");
    document.body.appendChild(link);
    link.click();
  }

  return (
    /**
     * Card principal
     * Classes Tailwind explicadas:
     * - bg-white: fundo branco
     * - shadow-lg: sombra grande (destaque)
     * - rounded-lg: bordas arredondadas
     * - p-6: padding de 1.5rem (24px) em todos os lados
     * - hover:shadow-xl: sombra extra grande ao passar o mouse
     * - transition: animação suave das mudanças
     */
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
      <div className="flex justify-between items-start">
        {/* 
          ===================================================================
          SEÇÃO ESQUERDA: Informações da turma
          ===================================================================
        */}
        <div className="flex-grow">
          {/* Título da turma */}
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {turma.nome}
          </h3>
          
          {/* Nome do professor responsável */}
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Professor:</span> {turma.nomeProfessor}
          </p>
          
          {/* Descrição da turma (pode ser vazia) */}
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Descrição:</span>{' '}
            {turma.descricao || 'Sem descrição'}
          </p>
          
          {/* 
            Contador de alunos com ícone SVG
            O ícone é inline e renderizado como SVG para melhor performance
          */}
          <div className="flex items-center mt-3">
            {/* Ícone de grupo de pessoas */}
            <svg 
              className="w-5 h-5 text-blue-500 mr-2" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            
            {/* 
              Texto com pluralização correta
              Operador ternário: se quantidade === 1, usa "aluno", senão "alunos"
            */}
            <span className="text-gray-700 font-medium">
              {turma.quantidadeAlunos} {turma.quantidadeAlunos === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>
        </div>

        {/* 
          ===================================================================
          SEÇÃO DIREITA: Botões de ação (contextuais por tipo de usuário)
          ===================================================================
          
          Renderização condicional baseada no tipo de usuário:
          - Acadêmico vê apenas "Matricular-se"
          - Professor vê "Editar" e "Excluir"
          - Visitante não logado não vê botões
        */}
        <div className="flex flex-col space-y-2 ml-4">
          
          {/* 
            -------------------------------------------------------------------
            BOTÃO PARA ACADÊMICOS: Matricular-se
            -------------------------------------------------------------------
            
            Este botão implementa a FUNCIONALIDADE EXTRA de matrícula.
            Só aparece se ehAcademico === true
          */}
          {ehAcademico && (
            <>
              <button
                onClick={() => {
                  if (!inscrito) {
                    aoMatricular(turma.id)
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
                aria-label={`Matricular-se na turma ${turma.nome}`}
              >
                {inscrito ? 'Matriculado' : 'Matricular-se'}
              </button>
            </>
          )}

          {/* 
            -------------------------------------------------------------------
            BOTÕES PARA PROFESSORES: Editar e Excluir
            -------------------------------------------------------------------
            
            Estes botões só aparecem se ehProfessor === true
            Implementam os requisitos de EDITAR e EXCLUIR entidades
          */}
          {ehProfessor && (
            <>
              {/* 
                Botão Editar
                Usa <Link> do React Router para navegação
                Redireciona para /turma/editar/:id
              */}
              <Link
                to={`/turma/editar/${turma.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium text-center transition transform hover:scale-105"
                aria-label={`Editar turma ${turma.nome}`}
              >
                Editar
              </Link>
              
              {/* 
                Botão Excluir
                Chama a função aoExcluir passada via props
                A função mostrará confirmação antes de excluir
              */}
              <button
                onClick={() => aoExcluir(turma.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
                aria-label={`Excluir turma ${turma.nome}`}
              >
                Excluir
              </button>
              <button
                onClick={() => exportarAlunos(turma.id)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
                aria-label={`Exportar alunos ${turma.nome}`}
              >
                Exportar Alunos
              </button>
            </>

          )}
          <Link
            to={`/turma/comunicacao/${turma.id}`}
            className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 text-center rounded-lg font-medium transition transform hover:scale-105"
          >
            Comunicação
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * =============================================================================
 * COMPONENTE PRINCIPAL: ListaTurmas
 * =============================================================================
 * 
 * Este é o componente principal que gerencia toda a lógica da página.
 * 
 * Responsabilidades:
 * - Buscar turmas do back-end
 * - Gerenciar estados de loading e erro
 * - Implementar busca/filtro
 * - Lidar com exclusão de turmas
 * - Lidar com matrícula de acadêmicos
 * - Renderizar a lista de cards
 * 
 * @returns {JSX.Element} Página completa com lista de turmas
 */
export function ListaTurmas() {
  /**
   * ---------------------------------------------------------------------------
   * ESTADOS DO COMPONENTE
   * ---------------------------------------------------------------------------
   * 
   * Estados gerenciam dados que podem mudar ao longo do tempo.
   * Quando um estado muda, o React re-renderiza o componente.
   */
  
  /**
   * Lista de turmas retornada do back-end
   * Inicializa como array vazio para evitar erros ao mapear
   * 
   * @type {Array<Object>}
   */
  const [turmas, setTurmas] = useState([]);
  
  /**
   * Indica se está carregando dados do servidor
   * Usado para exibir spinner de loading
   * 
   * @type {boolean}
   */
  const [loading, setLoading] = useState(true);
  
  /**
   * Armazena mensagem de erro (se houver)
   * null = sem erro
   * string = mensagem de erro a ser exibida
   * 
   * @type {string|null}
   */
  const [erro, setErro] = useState(null);
  
  /**
   * Termo digitado pelo usuário na busca
   * String vazia = mostrar todas as turmas
   * 
   * @type {string}
   */
  const [termoBusca, setTermoBusca] = useState('');

  /**
   * ---------------------------------------------------------------------------
   * CONTEXTO DE AUTENTICAÇÃO
   * ---------------------------------------------------------------------------
   * 
   * Obtém informações do usuário logado e funções helper
   * Usado para mostrar/ocultar botões baseado no tipo de usuário
   */
  const { usuario, ehProfessor, ehAcademico } = useAuth();

  /**
   * ===========================================================================
   * FUNÇÃO: carregarTurmas
   * ===========================================================================
   * 
   * Função assíncrona que busca turmas do back-end.
   * 
   * Lógica:
   * 1. Se termoBusca não estiver vazio: busca por nome (filtro)
   * 2. Se termoBusca estiver vazio: busca todas as turmas
   * 3. Atualiza o estado com os resultados
   * 4. Trata erros exibindo mensagem amigável
   * 
   * REQUISITOS IMPLEMENTADOS:
   * Buscar lista de entidades do back-end (GET)
   * Implementar busca/filtro por nome
   * Feedback visual (loading, erro)
   * 
   * @async
   * @returns {Promise<void>}
   */
  async function carregarTurmas() {
    try {
      // Ativa o estado de loading (mostra spinner)
      setLoading(true);
      
      // Limpa erro anterior (se houver)
      setErro(null);

      /**
       * Renderização condicional da requisição:
       * - Se há termo de busca: usa buscarPorNome (filtro)
       * - Se não há: usa listarTodas (todas as turmas)
       * 
       * Operador ternário: condição ? valorSeTrue : valorSeFalse
       */
      const resposta = termoBusca
        ? await turmaServico.buscarPorNome(termoBusca)  // GET /api/turmas/buscar?nome=...
        : await turmaServico.listarTodas();              // GET /api/turmas

      /**
       * Atualiza o estado com os dados retornados
       * resposta.data contém o array de turmas
       * Isso dispara re-renderização do componente
       */
      setTurmas(resposta.data);
      
    } catch (e) {
      /**
       * Tratamento de erro
       * Se a requisição falhar (servidor fora, rede, etc),
       * exibe mensagem amigável ao usuário
       */
      setErro('Falha ao carregar turmas. Tente novamente.');
      console.error('Erro ao carregar turmas:', e);
      
    } finally {
      /**
       * finally sempre executa, independente de sucesso ou erro
       * Desativa o loading para parar o spinner
       */
      setLoading(false);
    }
  }

  /**
   * ---------------------------------------------------------------------------
   * EFFECT: Carrega turmas ao montar o componente
   * ---------------------------------------------------------------------------
   * 
   * useEffect com array de dependências vazio ([]) executa UMA VEZ
   * quando o componente é montado (aparece na tela).
   * 
   * É aqui que fazemos a requisição inicial para popular a lista.
   */
  useEffect(() => {
    carregarTurmas();
  }, []); // Array vazio = executa apenas na montagem

  /**
   * ===========================================================================
   * FUNÇÃO: lidarComExclusao
   * ===========================================================================
   * 
   * Exclui uma turma após confirmação do usuário.
   * 
   * REQUISITO IMPLEMENTADO:
   * Permitir exclusão de entidade diretamente pela interface (DELETE)
   * Feedback visual (confirmação, sucesso, erro)
   * 
   * Fluxo:
   * 1. Mostra confirmação ao usuário (window.confirm)
   * 2. Se confirmar: faz requisição DELETE para o back-end
   * 3. Se sucesso: recarrega a lista
   * 4. Se erro: exibe mensagem
   * 
   * @async
   * @param {number} id - ID da turma a ser excluída
   * @returns {Promise<void>}
   */
  async function lidarComExclusao(id) {
    /**
     * window.confirm() mostra diálogo de confirmação nativo do navegador
     * Retorna true se o usuário clicar "OK", false se clicar "Cancelar"
     * 
     * IMPORTANTE: Em produção, considere usar um modal customizado mais bonito
     */
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        /**
         * Faz requisição DELETE para o back-end
         * DELETE /api/turmas/:id
         * 
         * O back-end remove a turma do banco de dados
         */
        await turmaServico.excluir(id);
        
        /**
         * Feedback de sucesso
         * alert() é simples mas funcional
         * Em produção, use toast notifications (react-toastify, etc)
         */
        alert('Turma excluída com sucesso!');
        
        /**
         * Recarrega a lista para mostrar as turmas atualizadas
         * (sem a turma que foi excluída)
         */
        carregarTurmas();
        
      } catch (e) {
        /**
         * Se houver erro (turma não existe, sem permissão, etc)
         * exibe mensagem de erro
         */
        alert('Erro ao excluir turma.');
        console.error('Erro ao excluir:', e);
      }
    }
  }

  /**
   * ===========================================================================
   * FUNÇÃO: lidarComMatricula
   * ===========================================================================
   * 
   * Matricula um acadêmico em uma turma.
   * 
   * FUNCIONALIDADE EXTRA implementada aqui!
   * Permite que acadêmicos se matriculem em turmas com um clique.
   * 
   * Validações:
   * - Usuário deve estar logado
   * - Usuário deve ser acadêmico
   * - Turma deve existir
   * - Acadêmico não pode estar matriculado duas vezes
   * 
   * @async
   * @param {number} idTurma - ID da turma para matrícula
   * @returns {Promise<void>}
   */
  async function lidarComMatricula(idTurma) {
    /**
     * Validação: verifica se há usuário logado
     * Se não houver, exibe alerta e interrompe execução
     */
    if (!usuario) {
      alert('Você precisa estar logado para se matricular!');
      return; // Early return - para execução aqui
    }

    try {
      /**
       * Faz requisição POST para matricular
       * POST /api/turmas/:idTurma/matricular/:idAcademico
       * 
       * O back-end:
       * 1. Valida se a turma existe
       * 2. Valida se o acadêmico existe
       * 3. Adiciona à lista de matriculados
       * 4. Retorna dados atualizados
       */
      await turmaServico.matricularAcademico(idTurma, usuario.id);
      
      /**
       * Feedback de sucesso
       */
      alert('Matrícula realizada com sucesso!');
      
      /**
       * Recarrega a lista para atualizar a contagem de alunos
       * O card mostrará o número atualizado de alunos matriculados
       */
      carregarTurmas();
      
    } catch (e) {
      /**
       * Tratamento de erros específicos
       * HTTP 404 = Turma ou acadêmico não encontrado
       * Outros erros = Pode já estar matriculado ou erro genérico
       */
      if (e.response?.status === 404) {
        alert('Turma ou acadêmico não encontrado.');
      } else {
        alert('Erro ao realizar matrícula. Você já está matriculado.');
      }
      console.error('Erro ao matricular:', e);
    }
  }

  /**
   * ===========================================================================
   * RENDERIZAÇÃO DO COMPONENTE
   * ===========================================================================
   * 
   * Aqui definimos o JSX (HTML + JavaScript) que será renderizado.
   * A renderização é CONDICIONAL baseada nos estados.
   */
  return (
    <div className="max-w-7xl mx-auto">
      
      {/* 
        =====================================================================
        SEÇÃO: Cabeçalho com mensagem personalizada
        =====================================================================
      */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Turmas Disponíveis
        </h1>
        
        {/* 
          Mensagem contextual baseada no usuário logado
          Operador ternário com template literal
        */}
        <p className="text-gray-600">
          {usuario 
            ? `Bem-vindo, ${usuario.nome}! ${
                ehAcademico() 
                  ? 'Matricule-se em uma turma abaixo.' 
                  : 'Gerencie suas turmas.'
              }`
            : 'Faça login para interagir com as turmas.'}
        </p>
      </div>

      {/* 
        =====================================================================
        SEÇÃO: Barra de busca/filtro
        =====================================================================
        
        REQUISITO IMPLEMENTADO:
        Implementar busca/filtro de entidades (por nome)
      */}
      <div className="mb-6 flex space-x-2">
        {/* 
          Input de busca
          Controlled component: valor vem do estado termoBusca
        */}
        <input
          type="text"
          placeholder="Buscar turma por nome..."
          className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          onKeyPress={(e) => {
            // Permite buscar pressionando Enter
            if (e.key === 'Enter') carregarTurmas();
          }}
          aria-label="Campo de busca de turmas"
        />
        
        {/* Botão de buscar */}
        <button
          onClick={carregarTurmas}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md font-medium transition transform hover:scale-105"
          aria-label="Buscar turmas"
        >
          🔍 Buscar
        </button>
        
        {/* 
          Botão de limpar busca (só aparece se há termo de busca)
          Renderização condicional: {condicao && <elemento>}
        */}
        {termoBusca && (
          <button
            onClick={() => {
              setTermoBusca(''); // Limpa o input
              setTimeout(carregarTurmas, 100); // Recarrega após limpar
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md font-medium transition"
            aria-label="Limpar busca"
          >
            Limpar
          </button>
        )}
      </div>

      {/* 
        =====================================================================
        SEÇÃO: Feedback de Loading
        =====================================================================
        
        REQUISITO IMPLEMENTADO:
        Feedback visual - loading
        
        Só renderiza se loading === true
      */}
      {loading && (
        <div className="text-center py-12">
          {/* Spinner animado usando apenas CSS do Tailwind */}
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-4">Carregando turmas...</p>
        </div>
      )}

      {/* 
        =====================================================================
        SEÇÃO: Feedback de Erro
        =====================================================================
        
        REQUISITO IMPLEMENTADO:
        ✅ Feedback visual - mensagem de erro
        
        Só renderiza se erro !== null
      */}
      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          {erro}
        </div>
      )}

      {/* 
        =====================================================================
        SEÇÃO: Lista de turmas
        =====================================================================
        
        REQUISITO IMPLEMENTADO:
        ✅ Exibir lista de entidades (cards) com dados do back-end
        
        Só renderiza se NÃO está loading e NÃO há erro
      */}
      {!loading && !erro && (
        <div className="grid grid-cols-1 gap-6">
          {/* 
            Caso especial: lista vazia
            Mostra mensagem amigável se não houver turmas
          */}
          {turmas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              {/* Ícone SVG de "vazio" */}
              <svg 
                className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                fill="currentColor" 
                viewBox="0 0 20 20"
              >
                <path 
                  fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
                  clipRule="evenodd"
                />
              </svg>
              
              {/* Mensagem contextual */}
              <p className="text-gray-500 text-lg">
                {termoBusca 
                  ? 'Nenhuma turma encontrada com esse nome.' 
                  : 'Nenhuma turma cadastrada ainda.'}
              </p>
              
              {/* 
                Se for professor e não há busca ativa,
                mostra botão para criar primeira turma
              */}
              {ehProfessor() && !termoBusca && (
                <Link 
                  to="/turma/nova"
                  className="inline-block mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition"
                >
                  Criar primeira turma
                </Link>
              )}
            </div>
          ) : (
            /**
             * Renderização da lista de turmas
             * 
             * map() cria um array de componentes CardTurma
             * Cada turma vira um card individual
             * 
             * IMPORTANTE: key={turma.id} é obrigatório
             * O React usa isso para otimizar re-renderizações
             */
            turmas.map((turma) => (
              <CardTurma
                key={turma.id}                  // Identificador único (obrigatório)
                turma={turma}                   // Dados da turma
                aoExcluir={lidarComExclusao}   // Função de callback
                aoMatricular={lidarComMatricula} // Função de callback
                ehProfessor={ehProfessor()}    // Boolean
                ehAcademico={ehAcademico()}    // Boolean
                inscrito={turma.inscrito}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}