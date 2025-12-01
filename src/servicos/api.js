/**
 * =============================================================================
 * SERVIÇO DE COMUNICAÇÃO COM A API (Back-end)
 * =============================================================================
 * 
 * Este arquivo centraliza TODAS as requisições HTTP para o back-end.
 * Utiliza a biblioteca Axios para fazer chamadas REST de forma simplificada.
 * 
 * Benefícios dessa abordagem:
 * - Evita duplicação de código (URL base configurada uma vez)
 * - Facilita manutenção (mudança de URL em um único lugar)
 * - Consistência nas requisições (headers padrão)
 * - Facilita debug e tratamento de erros centralizado
 * 
 * @author [Seu Nome]
 * @version 1.0.0
 * @since 2025-01-15
 */

import axios from 'axios';

/**
 * =============================================================================
 * CONFIGURAÇÃO DA INSTÂNCIA AXIOS
 * =============================================================================
 * 
 * Criamos uma instância customizada do Axios com configurações pré-definidas.
 * Isso evita ter que repetir a URL base e headers em cada requisição.
 */
export const api = axios.create({
    /**
     * URL base do back-end
     * Todas as requisições serão feitas para: http://localhost:8080/api/...
     * 
     * IMPORTANTE: Se o back-end estiver em outra porta ou servidor,
     * basta alterar aqui que todas as requisições serão atualizadas.
     */
    baseURL: 'http://localhost:8080/api',
    
    /**
     * Headers padrão enviados em TODAS as requisições
     * Content-Type: application/json indica que estamos enviando/recebendo JSON
     */
    headers: {
        'Content-Type': 'application/json',
    }
});

/**
 * =============================================================================
 * SERVIÇO DE AUTENTICAÇÃO
 * =============================================================================
 * 
 * Agrupa todas as operações relacionadas à autenticação de usuários.
 * Permite login de professores e acadêmicos no sistema.
 */
export const autenticacaoServico = {
    /**
     * Realiza o login de um usuário (Professor ou Acadêmico)
     * 
     * @param {Object} credenciais - Objeto com dados de login
     * @param {string} credenciais.email - Email do usuário
     * @param {string} credenciais.senha - Senha do usuário
     * @param {string} credenciais.tipoUsuario - Tipo: "PROFESSOR" ou "ACADEMICO"
     * 
     * @returns {Promise} Promise que resolve com os dados do usuário autenticado
     * 
     * @example
     * const dados = await autenticacaoServico.login({
     *   email: "professor@email.com",
     *   senha: "123456",
     *   tipoUsuario: "PROFESSOR"
     * });
     * console.log(dados.data); // { id: 1, nome: "João", tipoUsuario: "PROFESSOR", ... }
     */
    login: (credenciais) => api.post('/auth/login', credenciais),
};

/**
 * =============================================================================
 * SERVIÇO DE TURMAS
 * =============================================================================
 * 
 * Agrupa TODAS as operações CRUD relacionadas a turmas.
 * Implementa os métodos HTTP: GET, POST, PUT, DELETE
 * 
 * Padrão REST implementado:
 * - GET    /turmas           → Listar todas
 * - GET    /turmas/buscar    → Buscar por filtro
 * - POST   /turmas           → Criar nova
 * - PUT    /turmas/{id}      → Atualizar existente
 * - DELETE /turmas/{id}      → Excluir
 */
export const turmaServico = {
    /**
     * -------------------------------------------------------------------------
     * GET - Listar todas as turmas cadastradas
     * -------------------------------------------------------------------------
     * 
     * Busca TODAS as turmas do banco de dados sem filtros.
     * Usado na tela inicial para exibir a lista completa.
     * 
     * @returns {Promise<Array>} Promise que resolve com array de turmas
     * 
     * @example
     * const response = await turmaServico.listarTodas();
     * console.log(response.data); // [{ id: 1, nome: "Turma A", ... }, ...]
     */
    listarTodas: () => api.get('/turmas'),
    
    /**
     * -------------------------------------------------------------------------
     * GET - Buscar turmas por nome (filtro)
     * -------------------------------------------------------------------------
     * 
     * Busca turmas cujo nome contenha o texto informado.
     * A busca é case-insensitive (ignora maiúsculas/minúsculas).
     * Implementa o requisito: "Fazer uma consulta (por nome, valor, etc)"
     * 
     * @param {string} nome - Texto para buscar no nome das turmas
     * 
     * @returns {Promise<Array>} Promise que resolve com array de turmas filtradas
     * 
     * @example
     * // Buscar turmas que contenham "web" no nome
     * const response = await turmaServico.buscarPorNome("web");
     * console.log(response.data); // [{ id: 1, nome: "Desenvolvimento Web", ... }]
     */
    buscarPorNome: (nome) => api.get(`/turmas/buscar?nome=${nome}`),
    
    /**
     * -------------------------------------------------------------------------
     * POST - Criar uma nova turma
     * -------------------------------------------------------------------------
     * 
     * Cria uma nova turma no banco de dados.
     * Apenas professores podem criar turmas.
     * Implementa o requisito: "Salvar ao menos uma entidade no banco"
     * 
     * @param {Object} dadosTurma - Dados da turma a ser criada
     * @param {string} dadosTurma.nome - Nome da turma (obrigatório)
     * @param {string} dadosTurma.descricao - Descrição da turma (opcional)
     * @param {number} dadosTurma.professorId - ID do professor responsável (obrigatório)
     * 
     * @returns {Promise<Object>} Promise que resolve com os dados da turma criada
     * 
     * @example
     * const novaTurma = await turmaServico.criar({
     *   nome: "Programação Web",
     *   descricao: "Curso de desenvolvimento web full-stack",
     *   professorId: 1
     * });
     * console.log(novaTurma.data); // { id: 5, nome: "Programação Web", ... }
     */
    criar: (dadosTurma) => api.post('/turmas', dadosTurma),
    
    /**
     * -------------------------------------------------------------------------
     * PUT - Atualizar uma turma existente
     * -------------------------------------------------------------------------
     * 
     * Atualiza os dados de uma turma já cadastrada.
     * Apenas o professor responsável pode editar a turma.
     * Implementa o requisito: "Editar ao menos uma entidade no banco"
     * 
     * @param {number} id - ID da turma a ser atualizada
     * @param {Object} dadosTurma - Novos dados da turma
     * @param {string} dadosTurma.nome - Novo nome
     * @param {string} dadosTurma.descricao - Nova descrição
     * @param {number} dadosTurma.professorId - ID do professor responsável
     * 
     * @returns {Promise<Object>} Promise que resolve com os dados atualizados
     * 
     * @example
     * const turmaAtualizada = await turmaServico.atualizar(5, {
     *   nome: "Programação Web Avançada",
     *   descricao: "Versão avançada do curso",
     *   professorId: 1
     * });
     */
    atualizar: (id, dadosTurma) => api.put(`/turmas/${id}`, dadosTurma),
    
    /**
     * -------------------------------------------------------------------------
     * DELETE - Excluir uma turma
     * -------------------------------------------------------------------------
     * 
     * Remove permanentemente uma turma do banco de dados.
     * ATENÇÃO: Esta ação não pode ser desfeita!
     * Implementa o requisito: "Excluir ao menos uma entidade no banco"
     * 
     * @param {number} id - ID da turma a ser excluída
     * 
     * @returns {Promise<void>} Promise que resolve quando a exclusão é concluída
     * 
     * @example
     * await turmaServico.excluir(5);
     * console.log("Turma excluída com sucesso!");
     */
    excluir: (id) => api.delete(`/turmas/${id}`),

    /**
     * =========================================================================
     * FUNCIONALIDADES EXTRAS - Gestão de Matrículas
     * =========================================================================
     * 
     * Implementam os requisitos de "funcionalidades extras de relevância".
     * Permitem que acadêmicos entrem/saiam de turmas.
     */

    /**
     * -------------------------------------------------------------------------
     * POST - Matricular um acadêmico em uma turma
     * -------------------------------------------------------------------------
     * 
     * Adiciona um acadêmico à lista de alunos matriculados em uma turma.
     * Funcionalidade Extra 1: "Acadêmicos podem entrar em turmas"
     * 
     * Regras de negócio:
     * - Apenas acadêmicos podem se matricular
     * - Um acadêmico não pode se matricular duas vezes na mesma turma
     * 
     * @param {number} idTurma - ID da turma
     * @param {number} idAcademico - ID do acadêmico que deseja se matricular
     * 
     * @returns {Promise<Object>} Promise com dados atualizados da turma
     * 
     * @example
     * // Acadêmico de ID 3 se matricula na turma de ID 1
     * const resultado = await turmaServico.matricularAcademico(1, 3);
     * console.log(resultado.data.quantidadeAlunos); // 5 (incrementado)
     */
    matricularAcademico: (idTurma, idAcademico) =>
        api.post(`/turmas/${idTurma}/matricular/${idAcademico}`),
        
    /**
     * -------------------------------------------------------------------------
     * DELETE - Remover um acadêmico de uma turma
     * -------------------------------------------------------------------------
     * 
     * Remove um acadêmico da lista de alunos matriculados.
     * Funcionalidade Extra 2: "Professores podem remover acadêmicos"
     * 
     * Regras de negócio:
     * - Apenas o professor responsável pela turma pode remover alunos
     * - O acadêmico removido perde acesso aos materiais da turma
     * 
     * @param {number} idTurma - ID da turma
     * @param {number} idAcademico - ID do acadêmico a ser removido
     * 
     * @returns {Promise<Object>} Promise com dados atualizados da turma
     * 
     * @example
     * // Professor remove o acadêmico de ID 3 da turma de ID 1
     * await turmaServico.removerAcademico(1, 3);
     * console.log("Acadêmico removido com sucesso!");
     */
    removerAcademico: (idTurma, idAcademico) =>
        api.delete(`/turmas/${idTurma}/remover/${idAcademico}`)
};

/**
 * =============================================================================
 * OBSERVAÇÕES IMPORTANTES
 * =============================================================================
 * 
 * 1. TRATAMENTO DE ERROS:
 *    - Todos os métodos retornam Promises
 *    - Use try/catch nos componentes para capturar erros
 *    - Erros comuns: 404 (não encontrado), 500 (erro no servidor), 401 (não autorizado)
 * 
 * 2. CORS:
 *    - O back-end deve ter CORS configurado para aceitar http://localhost:5173
 *    - Caso contrário, todas as requisições falharão
 * 
 * 3. ESTRUTURA DE RESPOSTA:
 *    - Axios encapsula a resposta em um objeto com propriedade 'data'
 *    - Sempre acesse response.data para obter os dados reais
 * 
 * 4. REQUISIÇÕES ASSÍNCRONAS:
 *    - Todos os métodos são assíncronos (retornam Promise)
 *    - Use async/await ou .then() para lidar com respostas
 * 
 * @example Exemplo completo de uso com tratamento de erro
 * async function carregarTurmas() {
 *   try {
 *     const response = await turmaServico.listarTodas();
 *     console.log('Turmas:', response.data);
 *   } catch (erro) {
 *     if (erro.response?.status === 404) {
 *       console.error('Endpoint não encontrado');
 *     } else if (erro.response?.status === 500) {
 *       console.error('Erro no servidor');
 *     } else {
 *       console.error('Erro desconhecido:', erro);
 *     }
 *   }
 * }
 */