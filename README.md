 Portal Acadêmico - Back-end

Sistema de gerenciamento acadêmico desenvolvido com **Kotlin + Spring Boot + PostgreSQL**.

## Tecnologias

- **Kotlin** 1.9+
- **Spring Boot** 3.x
- **Spring Data JPA**
- **Spring Security**
- **PostgreSQL** 17
- **Maven**
- **Java** 21

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Java 21](https://www.oracle.com/java/technologies/downloads/#java21)
- [Maven](https://maven.apache.org/download.cgi)
- [PostgreSQL 17](https://www.postgresql.org/download/)
- IDE recomendada: [IntelliJ IDEA](https://www.jetbrains.com/idea/)

## Configuração do Banco de Dados

### 1. Criar o banco de dados

Abra o PostgreSQL (psql ou pgAdmin) e execute:

```sql
CREATE DATABASE reKotlin;
```

### 2. Criar usuário (opcional)

Se quiser usar um usuário diferente do padrão:

```sql
CREATE USER seu_usuario WITH PASSWORD 'sua_senha';
GRANT ALL PRIVILEGES ON DATABASE reKotlin TO seu_usuario;
```

### 3. Configurar credenciais

Edite o arquivo `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/reKotlin
spring.datasource.username=postgres  # Seu usuário
spring.datasource.password=root      # Sua senha
```

### 4. Popular com dados de teste

Execute este SQL para criar usuários de teste:

```sql
-- Professor 1
INSERT INTO usuario (tipo_usuario, email, nome, senha_plana) 
VALUES ('PROFESSOR', 'joao.silva@professor.com', 'Prof. João Silva', '123456');

INSERT INTO professor (id, departamento) 
VALUES ((SELECT id FROM usuario WHERE email = 'joao.silva@professor.com'), 'Ciência da Computação');

-- Acadêmico 1
INSERT INTO usuario (tipo_usuario, email, nome, senha_plana) 
VALUES ('ACADEMICO', 'pedro.oliveira@aluno.com', 'Pedro Oliveira', '123456');

INSERT INTO academico (id, matricula) 
VALUES ((SELECT id FROM usuario WHERE email = 'pedro.oliveira@aluno.com'), '2024001');
```

## Como Executar

### Opção 1: Via IntelliJ IDEA (Recomendado)

1. Abra o projeto no IntelliJ
2. Aguarde o Maven baixar as dependências
3. Clique com botão direito em `PortalAcademicoApplication.kt`
4. Selecione **"Run 'PortalAcademicoApplication'"**

### Opção 2: Via linha de comando

```bash
# Navegar até a pasta do projeto
cd caminho/para/portalAcademico

# Compilar e executar
mvn spring-boot:run
```

### Opção 3: Gerar JAR e executar

```bash
# Compilar
mvn clean package

# Executar o JAR
java -jar target/portalAcademico-0.0.1-SNAPSHOT.jar
```

## Verificar se está funcionando

- A aplicação deve iniciar na porta **8080**
- Acesse: http://localhost:8080/api/turmas
- Deve retornar uma lista vazia `[]` ou as turmas cadastradas

## Estrutura do Projeto

```
src/main/kotlin/com.reKotlin.portalAcademico/
├── configuracao/      # Configurações de segurança e CORS
├── controlador/       # Controllers REST (endpoints da API)
├── dto/              # Data Transfer Objects
├── modelo/           # Entidades JPA (Usuario, Professor, Academico, Turma)
├── repositorio/      # Repositories (acesso ao banco)
└── servico/          # Lógica de negócio
```

## Endpoints da API

### Turmas

- `GET /api/turmas` - Listar todas as turmas
- `GET /api/turmas/buscar?nome=X` - Buscar turmas por nome
- `POST /api/turmas` - Criar nova turma
- `PUT /api/turmas/{id}` - Atualizar turma
- `DELETE /api/turmas/{id}` - Excluir turma
- `POST /api/turmas/{idTurma}/matricular/{idAcademico}` - Matricular acadêmico
- `DELETE /api/turmas/{idTurma}/remover/{idAcademico}` - Remover acadêmico

### Autenticação

- `POST /api/auth/login` - Fazer login

**Exemplo de body para criar turma:**
```json
{
  "nome": "Programação Web",
  "descricao": "Curso de desenvolvimento web full-stack",
  "professorId": 1
}
```

## Problemas Comuns

### Erro: "Connection refused" ao PostgreSQL

**Solução:** Certifique-se que o PostgreSQL está rodando:

# Windows
# Procure por "Services" e verifique se PostgreSQL está rodando
```

### Erro: "Port 8080 already in use"

**Solução:** Outra aplicação está usando a porta 8080. Encerre-a ou mude a porta em `application.properties`:

```properties
server.port=8081
```

### Erro ao conectar com banco de dados

**Solução:** Verifique se:
1. PostgreSQL está rodando
2. Banco de dados `reKotlin` existe
3. Usuário e senha estão corretos em `application.properties`

## Credenciais de Teste

**Professor:**
- Email: `joao.silva@professor.com`
- Senha: `123456`

**Acadêmico:**
- Email: `pedro.oliveira@aluno.com`
- Senha: `123456`

## 📝 Observações

⚠️ **Este é um projeto acadêmico!** 
