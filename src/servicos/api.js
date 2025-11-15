import axios from 'axios';

// Cria uma instância do Axios pré-configurada
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// ========== SERVIÇO DE AUTENTICAÇÃO ==========
export const autenticacaoServico = {
    // POST - Login
    login: (credenciais) => api.post('/auth/login', credenciais),
};

// ========== SERVIÇO DE TURMAS ==========
export const turmaServico = {
    // GET (Buscar por lista)
    listarTodas: () => api.get('/turmas'),
    
    // GET (Consulta por nome)
    buscarPorNome: (nome) => api.get(`/turmas/buscar?nome=${nome}`),
    
    // POST (Salvar)
    criar: (dadosTurma) => api.post('/turmas', dadosTurma),
    
    // PUT (Editar)
    atualizar: (id, dadosTurma) => api.put(`/turmas/${id}`, dadosTurma),
    
    // DELETE (Excluir)
    excluir: (id) => api.delete(`/turmas/${id}`),

    // --- Funcionalidades Extras ---
    matricularAcademico: (idTurma, idAcademico) =>
        api.post(`/turmas/${idTurma}/matricular/${idAcademico}`),
        
    removerAcademico: (idTurma, idAcademico) =>
        api.delete(`/turmas/${idTurma}/remover/${idAcademico}`)
};