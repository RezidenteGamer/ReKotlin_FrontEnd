import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { turmaServico } from '../servicos/api';
import { useAuth } from '../AuthContext';

/**
 * Componente de Card para exibir uma turma
 * Mostra ações diferentes dependendo do tipo de usuário
 */
function CardTurma({ turma, aoExcluir, aoMatricular, ehProfessor, ehAcademico }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition">
      <div className="flex justify-between items-start">
        {/* Informações da turma */}
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{turma.nome}</h3>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Professor:</span> {turma.nomeProfessor}
          </p>
          <p className="text-gray-600 mb-1">
            <span className="font-medium">Descrição:</span> {turma.descricao || 'Sem descrição'}
          </p>
          <div className="flex items-center mt-3">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
            </svg>
            <span className="text-gray-700 font-medium">
              {turma.quantidadeAlunos} {turma.quantidadeAlunos === 1 ? 'aluno' : 'alunos'}
            </span>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col space-y-2 ml-4">
          {/* Botão para ACADÊMICO matricular-se */}
          {ehAcademico && (
            <button
              onClick={() => aoMatricular(turma.id)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
            >
              Matricular-se
            </button>
          )}

          {/* Botões para PROFESSOR editar/excluir */}
          {ehProfessor && (
            <>
              <Link
                to={`/turma/editar/${turma.id}`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium text-center transition transform hover:scale-105"
              >
                Editar
              </Link>
              <button
                onClick={() => aoExcluir(turma.id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition transform hover:scale-105"
              >
                Excluir
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Página principal - Lista de Turmas
 * Exibe todas as turmas disponíveis com busca e ações contextuais
 */
export function ListaTurmas() {
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');

  const { usuario, ehProfessor, ehAcademico } = useAuth();

  /**
   * Carrega a lista de turmas do back-end
   * Aplica filtro por nome se termoBusca não estiver vazio
   */
  async function carregarTurmas() {
    try {
      setLoading(true);
      setErro(null);

      const resposta = termoBusca
        ? await turmaServico.buscarPorNome(termoBusca)
        : await turmaServico.listarTodas();

      setTurmas(resposta.data);
    } catch (e) {
      setErro('Falha ao carregar turmas. Tente novamente.');
      console.error('Erro ao carregar turmas:', e);
    } finally {
      setLoading(false);
    }
  }

  // Carrega as turmas ao montar o componente
  useEffect(() => {
    carregarTurmas();
  }, []);

  /**
   * Exclui uma turma (apenas professores)
   */
  async function lidarComExclusao(id) {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        await turmaServico.excluir(id);
        alert('Turma excluída com sucesso!');
        carregarTurmas();
      } catch (e) {
        alert('Erro ao excluir turma.');
        console.error('Erro ao excluir:', e);
      }
    }
  }

  /**
   * Matricula um acadêmico na turma
   */
  async function lidarComMatricula(idTurma) {
    if (!usuario) {
      alert('Você precisa estar logado para se matricular!');
      return;
    }

    try {
      await turmaServico.matricularAcademico(idTurma, usuario.id);
      alert('Matrícula realizada com sucesso!');
      carregarTurmas(); // Recarrega para atualizar a contagem de alunos
    } catch (e) {
      if (e.response?.status === 404) {
        alert('Turma ou acadêmico não encontrado.');
      } else {
        alert('Erro ao realizar matrícula. Você pode já estar matriculado.');
      }
      console.error('Erro ao matricular:', e);
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Cabeçalho */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Turmas Disponíveis</h1>
        <p className="text-gray-600">
          {usuario 
            ? `Bem-vindo, ${usuario.nome}! ${ehAcademico() ? 'Matricule-se em uma turma abaixo.' : 'Gerencie suas turmas.'}`
            : 'Faça login para interagir com as turmas.'}
        </p>
      </div>

      {/* Barra de busca */}
      <div className="mb-6 flex space-x-2">
        <input
          type="text"
          placeholder="Buscar turma por nome..."
          className="flex-grow px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') carregarTurmas();
          }}
        />
        <button
          onClick={carregarTurmas}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg shadow-md font-medium transition transform hover:scale-105"
        >
          🔍 Buscar
        </button>
        {termoBusca && (
          <button
            onClick={() => {
              setTermoBusca('');
              setTimeout(carregarTurmas, 100);
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg shadow-md font-medium transition"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Feedback de loading e erro */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-500 mt-4">Carregando turmas...</p>
        </div>
      )}

      {erro && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
          {erro}
        </div>
      )}

      {/* Lista de turmas */}
      {!loading && !erro && (
        <div className="grid grid-cols-1 gap-6">
          {turmas.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
              <p className="text-gray-500 text-lg">
                {termoBusca ? 'Nenhuma turma encontrada com esse nome.' : 'Nenhuma turma cadastrada ainda.'}
              </p>
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
            turmas.map((turma) => (
              <CardTurma
                key={turma.id}
                turma={turma}
                aoExcluir={lidarComExclusao}
                aoMatricular={lidarComMatricula}
                ehProfessor={ehProfessor()}
                ehAcademico={ehAcademico()}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}