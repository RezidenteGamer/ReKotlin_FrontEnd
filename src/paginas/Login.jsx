import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { autenticacaoServico } from '../servicos/api';
import { useAuth } from '../AuthContext';

/**
 * Página de Login
 * Autentica usuários (Professor ou Acadêmico) no sistema
 */
export function Login() {
  const { tipo } = useParams(); // "professor" ou "academico"
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const tipoUsuario = tipo.toUpperCase(); // Converte para "PROFESSOR" ou "ACADEMICO"
  const nomeExibicao = tipo === 'professor' ? 'Professor' : 'Acadêmico';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const resposta = await autenticacaoServico.login({
        email,
        senha,
        tipoUsuario
      });

      // Salva os dados do usuário no contexto
      login(resposta.data);

      // Redireciona para a home
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        setErro('Email, senha ou tipo de usuário incorretos');
      } else {
        setErro('Erro ao conectar com o servidor');
      }
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
      <div className="bg-white p-12 rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <div className={`inline-block p-4 rounded-full mb-4 ${
            tipo === 'professor' ? 'bg-blue-100' : 'bg-green-100'
          }`}>
            <svg className={`w-12 h-12 ${
              tipo === 'professor' ? 'text-blue-600' : 'text-green-600'
            }`} fill="currentColor" viewBox="0 0 20 20">
              {tipo === 'professor' ? (
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              ) : (
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
              )}
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Login {nomeExibicao}</h1>
          <p className="text-gray-600 mt-2">Entre com suas credenciais</p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={`seu.email@${tipo === 'professor' ? 'professor' : 'aluno'}.com`}
              required
            />
          </div>

          {/* Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-2">
              Senha
            </label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {erro}
            </div>
          )}

          {/* Botão de submit */}
          <button
            type="submit"
            disabled={carregando}
            className={`w-full py-3 rounded-lg font-semibold text-white shadow-lg transform transition ${
              tipo === 'professor'
                ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                : 'bg-green-600 hover:bg-green-700 hover:scale-105'
            } disabled:bg-gray-400 disabled:cursor-not-allowed`}
          >
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {/* Link para voltar */}
        <div className="text-center mt-6">
          <Link 
            to="/selecionar-tipo" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            ← Voltar para seleção de tipo
          </Link>
        </div>

        {/* Dica de teste */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold mb-1">💡 Dica para testes:</p>
          <p className="text-xs text-gray-500">
            Use os usuários que você criou no banco de dados
          </p>
        </div>
      </div>
    </div>
  );
}