import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { turmaServico } from '../servicos/api';
import { useAuth } from '../AuthContext';

/**
 * Formulário para criar e editar turmas
 * Apenas professores podem acessar este componente
 */
export function FormularioTurma() {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [feedback, setFeedback] = useState({ tipo: '', mensagem: '' });
  const [carregando, setCarregando] = useState(false);

  const navigate = useNavigate();
  const { idTurma } = useParams();
  const { usuario, ehProfessor } = useAuth();
  const modoEdicao = Boolean(idTurma);

  // Redireciona se não for professor
  useEffect(() => {
    if (!usuario || !ehProfessor()) {
      alert('Apenas professores podem criar/editar turmas!');
      navigate('/');
    }
  }, [usuario, ehProfessor, navigate]);

  /**
   * Carrega dados da turma se for modo de edição
   */
  useEffect(() => {
    if (modoEdicao && usuario) {
      setCarregando(true);
      turmaServico.listarTodas()
        .then((resposta) => {
          const turma = resposta.data.find((t) => t.id === Number(idTurma));
          if (turma) {
            setNome(turma.nome);
            setDescricao(turma.descricao || '');
          } else {
            setFeedback({ tipo: 'erro', mensagem: 'Turma não encontrada' });
          }
        })
        .catch(() => {
          setFeedback({ tipo: 'erro', mensagem: 'Erro ao carregar turma' });
        })
        .finally(() => setCarregando(false));
    }
  }, [idTurma, modoEdicao, usuario]);

  /**
   * Submete o formulário (criar ou atualizar)
   */
  async function lidarComSubmit(evento) {
    evento.preventDefault();
    setCarregando(true);
    setFeedback({ tipo: '', mensagem: '' });

    const dadosTurma = {
      nome,
      descricao,
      professorId: usuario.id // Pega o ID do professor logado
    };

    try {
      if (modoEdicao) {
        await turmaServico.atualizar(idTurma, dadosTurma);
        setFeedback({ tipo: 'sucesso', mensagem: '✅ Turma atualizada com sucesso!' });
      } else {
        await turmaServico.criar(dadosTurma);
        setFeedback({ tipo: 'sucesso', mensagem: '✅ Turma criada com sucesso!' });
      }

      // Redireciona após 1.5 segundos
      setTimeout(() => navigate('/'), 1500);
    } catch (e) {
      console.error('Erro ao salvar turma:', e);
      setFeedback({
        tipo: 'erro',
        mensagem: '❌ Erro ao salvar turma. Verifique os dados e tente novamente.'
      });
      setCarregando(false);
    }
  }

  if (!usuario || !ehProfessor()) {
    return null; // Não renderiza nada até redirecionar
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Cabeçalho */}
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

      {/* Formulário */}
      <form
        onSubmit={lidarComSubmit}
        className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto"
      >
        {/* Campo: Nome */}
        <div className="mb-6">
          <label htmlFor="nome" className="block text-gray-700 font-semibold mb-2">
            Nome da Turma *
          </label>
          <input
            type="text"
            id="nome"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex: Programação Web Avançada"
            required
          />
        </div>

        {/* Campo: Descrição */}
        <div className="mb-6">
          <label htmlFor="descricao" className="block text-gray-700 font-semibold mb-2">
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
          <p className="text-sm text-gray-500 mt-1">
            A descrição é opcional, mas ajuda os alunos a entenderem a turma.
          </p>
        </div>

        {/* Informação do professor */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Professor responsável:</strong> {usuario.nome}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Departamento: {usuario.departamento}
          </p>
        </div>

        {/* Feedback visual */}
        {feedback.mensagem && (
          <div
            className={`p-4 rounded-lg mb-6 text-center font-medium ${
              feedback.tipo === 'sucesso'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {feedback.mensagem}
          </div>
        )}

        {/* Botões de ação */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
            disabled={carregando}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={carregando}
          >
            {carregando ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
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