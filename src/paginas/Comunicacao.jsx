import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { useEffect, useState } from "react";
import { api } from "../servicos/api";

export function Comunicacao() {

  // constantes
  const { idTurma } = useParams();
  const { usuario, ehProfessor } = useAuth();
  const navigate = useNavigate();
  
  // estados
  const [carregando, setCarregando] = useState(false);
  const [assunto, setAssunto] = useState('');
  const [msg, setMsg] = useState('');
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);

  async function setaListaEmails() {
    // se for aluno vai dar o email do professor da turma;
    // se for professor vai dar os emails dos alunos da turma;
    const response = await api.get(`/email/${idTurma}/emails`, {
      params: { isProfessor: ehProfessor() }
    })

    setEmails(response.data.emails);
  }

  useEffect(() => {
    setaListaEmails();
  }, [])

  async function lidarComSubmit(evento) {

    const remetente = usuario.email;
    const destinatario = email;

    const response = await api.post("/email/enviar", {
      remetente,
      destinatario,
      assunto,
      mensagem: msg,
    })

    console.log(response.data);

  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Email {ehProfessor() ? 'aos alunos' : 'ao professor'}
        </h1>
        <p className="text-gray-600">
          Se comunique com {ehProfessor() ? 'seus alunos' : 'seu professor'}
        </p>
      </div>

      <form
        onSubmit={lidarComSubmit}
        className="bg-white p-10 rounded-lg shadow-md"
      >

        <div className="mb-6">
          <label
            htmlFor="destinatario" 
            className="block text-gray-700 font-semibold mb-2"
          >
            Destinatário *
          </label>
          <select
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecione o destinatário</option>

            {emails.map((emailItem, index) => (
              <option key={index} value={emailItem}>
                {emailItem}
              </option>
            ))} 
          </select>
        </div>

        <div className="mb-6">
          {/* Label com acessibilidade (htmlFor vincula ao input) */}
          <label 
            htmlFor="nome" 
            className="block text-gray-700 font-semibold mb-2"
          >
            Assunto *
          </label>
          
          <input
            type="text"
            id="nome"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={assunto}
            onChange={(e) => setAssunto(e.target.value)}
            placeholder="O assunto principal do email"
            required  // HTML5 validation - campo obrigatório
            aria-required="true"  // Acessibilidade
          />
        </div>

        <div className="mb-6">
          <label 
            htmlFor="descricao" 
            className="block text-gray-700 font-semibold mb-2"
          >
            Mensagem
          </label>
          
          <textarea
            id="mensagem"
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Conteudo do email aqui"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"  // type="button" evita submit do form
            onClick={() => navigate('/')}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition"
            disabled={carregando}  // Desabilita se estiver salvando
          >
            Cancelar
          </button>

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
                Enviando
              </span>
            ) : (
              'Enviar'
            )}
          </button>
        </div>

      </form>
    </div>
  )
} 