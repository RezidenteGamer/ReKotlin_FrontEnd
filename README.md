# 🎓 Portal Acadêmico - Front-end

Interface web moderna para gerenciamento acadêmico desenvolvida com **React + Tailwind CSS**.

## Tecnologias

- **React** 18
- **React Router DOM** 6
- **Axios** (requisições HTTP)
- **Tailwind CSS** (estilização)
- **Vite** (build tool)

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) 18+ 
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## Instalação

### 1. Instalar dependências

```bash
# Navegar até a pasta do projeto
cd portal-academico-frontend

# Instalar dependências
npm install
```

### 2. Configurar URL da API

O front-end está configurado para se conectar ao back-end em `http://localhost:8080`.

Se o back-end estiver em outra porta, edite o arquivo `src/servicos/api.js`:

```javascript
const api = axios.create({
    baseURL: 'http://localhost:8080/api', // Altere aqui se necessário
    headers: {
        'Content-Type': 'application/json',
    }
});
```

## Como Executar

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação abrirá automaticamente em: **http://localhost:5173**

### Build para Produção

```bash
# Gerar build otimizado
npm run build

# Preview do build
npm run preview
```

## Verificar se está funcionando

1. Certifique-se que o **back-end está rodando** (porta 8080)
2. Acesse http://localhost:5173
3. Deve aparecer a tela de **"Seleção de Tipo de Usuário"**

## Estrutura do Projeto

```
src/
├── componentes/       # Componentes reutilizáveis
│   └── LayoutBase.jsx    # Layout principal com navegação
├── paginas/          # Páginas da aplicação
│   ├── ListaTurmas.jsx      # Lista todas as turmas
│   ├── FormularioTurma.jsx  # Criar/editar turmas
│   ├── SelecionarTipo.jsx   # Escolher tipo de usuário
│   └── Login.jsx            # Tela de login
├── roteamento/       # Configuração de rotas
│   └── RotasApp.jsx
├── servicos/         # Integração com API
│   └── api.js
├── AuthContext.jsx   # Contexto de autenticação global
├── main.jsx         # Ponto de entrada
└── index.css        # Estilos globais
```

## 🎨 Funcionalidades

### Para Todos os Usuários
-  Login com seleção de tipo (Professor/Acadêmico)
-  Visualizar lista de turmas
-  Buscar turmas por nome
-  Logout

### Para Professores
-  Criar novas turmas
-  Editar turmas existentes
-  Excluir turmas
-  Visualizar alunos matriculados

### Para Acadêmicos
-  Matricular-se em turmas
-  Visualizar turmas disponíveis

## 👥 Credenciais de Teste

 **Importante:** O back-end deve ter usuários cadastrados!

**Professor:**
- Email: `joao.silva@professor.com`
- Senha: `123456`

**Acadêmico:**
- Email: `pedro.oliveira@aluno.com`
- Senha: `123456`

## Comunicação com o Back-end

O front-end se comunica com o back-end através de:

```javascript
// Exemplo de requisição
import { turmaServico } from '../servicos/api';

// Listar turmas
const turmas = await turmaServico.listarTodas();

// Criar turma
await turmaServico.criar({
  nome: "Programação Web",
  descricao: "Curso de desenvolvimento",
  professorId: 1
});
```

## Problemas Comuns

### Erro: "Network Error" ou "CORS"

**Causa:** Back-end não está rodando ou CORS não está configurado.

**Solução:**
1. Certifique-se que o back-end está rodando em `http://localhost:8080`
2. Verifique a configuração de CORS no back-end em `ConfiguracaoSeguranca.kt`

### Tela em branco

**Causa:** Erro no console do navegador.

**Solução:**
1. Abra o Console (F12)
2. Verifique se há erros em vermelho
3. Certifique-se que todos os arquivos estão nos lugares corretos

### "Cannot find module"

**Causa:** Dependências não instaladas.

**Solução:**
```bash
# Deletar node_modules e reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Login não funciona

**Causa:** Back-end não tem usuários cadastrados ou não está rodando.

**Solução:**
1. Verifique se o back-end está rodando
2. Execute o SQL de criação de usuários no PostgreSQL
3. Tente fazer login com as credenciais corretas

## Fluxo de Uso

### Primeiro Acesso

1. Acesse http://localhost:5173
2. Selecione **"Sou Professor"** ou **"Sou Acadêmico"**
3. Faça login com as credenciais de teste
4. Explore as funcionalidades!

### Professor criando uma turma

1. Faça login como professor
2. Clique em **"Criar Turma"**
3. Preencha nome e descrição
4. Clique em **"Criar Turma"**
5. A turma aparecerá na lista

### Acadêmico se matriculando

1. Faça login como acadêmico
2. Visualize as turmas disponíveis
3. Clique em **"Matricular-se"** na turma desejada
4. Confirmação aparecerá na tela

## Segurança

**Este é um projeto acadêmico!**


## Responsividade

A aplicação é totalmente responsiva e funciona em:
-  Desktop (1920px+)
-  Laptop (1366px)
-  Tablet (768px)
-  Mobile (375px)

## Customização

### Alterar cores

Edite o arquivo `tailwind.config.js` (se existir) ou use as classes do Tailwind:

```javascript
// Exemplo: mudar cor primária de azul para roxo
className="bg-blue-500"  →  className="bg-purple-500"
```

### Adicionar novo componente

```javascript
// src/componentes/MeuComponente.jsx
export function MeuComponente() {
  return (
    <div className="p-4">
      Meu novo componente!
    </div>
  );
}
```

## Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Gera build de produção
npm run preview  # Preview do build de produção
npm run lint     # Verifica erros de código (se configurado)
```

## Observações

- O sistema usa `localStorage` para salvar dados do usuário logado
- Para logout completo, limpe o localStorage: `localStorage.clear()`
- As rotas são protegidas: apenas usuários logados podem acessar

## Licença

Este projeto foi desenvolvido para fins acadêmicos.
