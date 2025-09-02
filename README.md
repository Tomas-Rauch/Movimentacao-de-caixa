# Gerenciador de Fluxo de Caixa

## Introdução

O Gerenciador de Fluxo de Caixa é uma aplicação web full-stack projetada para oferecer um controle financeiro centralizado e eficiente. Com uma interface intuitiva, o sistema permite que administradores gerenciem usuários e que todos os membros da equipe colaborem em um único balanço financeiro, visualizando todas as transações de entrada e saída de forma unificada.

A aplicação conta com um sistema de autenticação seguro, perfis de usuário (Admin e Funcionário) e funcionalidades específicas para cada nível de acesso, garantindo tanto a colaboração quanto a segurança dos dados.

---

## ✨ Funcionalidades

- **Autenticação de Usuários:** Sistema completo de login com tokens JWT (Access e Refresh) e recuperação de senha via e-mail.
- **Dashboard Unificado:** Todas as movimentações financeiras são exibidas em um único dashboard, proporcionando uma visão global do saldo, entradas e saídas para todos os usuários.
- **Criação de Movimentações:** Formulário intuitivo para registrar novas entradas ou saídas, com campos para valor, descrição, categoria e data.
- **Gerenciamento de Perfil:** Usuários podem visualizar seus próprios dados, como nome, e-mail e nível de acesso.
- **Painel de Administração:**
  - **Criação de Novos Usuários:** Administradores podem criar contas para novos funcionários (com perfil de 'admin' ou 'user').
  - **Listagem de Usuários:** Visualização de todos os usuários cadastrados no sistema.
  - **Exclusão de Usuários:** Administradores podem excluir usuários, com regras de negócio que protegem contas críticas e impedem a auto-exclusão.

---

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em duas partes principais: o frontend e o backend, cada um com seu próprio conjunto de tecnologias.

**Frontend:**
- **React:** Biblioteca principal para a construção da interface de usuário.
- **TypeScript:** Para tipagem estática e segurança no código.
- **Vite:** Ferramenta de build e desenvolvimento rápido.
- **React Router:** Para gerenciamento de rotas na aplicação.
- **Lucide React:** Biblioteca de ícones.

**Backend:**
- **Node.js com Express:** Para a construção da API RESTful.
- **TypeScript:** Para um desenvolvimento robusto e seguro no lado do servidor.
- **Supabase:** Utilizado como banco de dados (PostgreSQL) e para facilitar a interação com o banco.
- **JWT (JSON Web Tokens):** Para o sistema de autenticação e autorização.
- **Bcrypt:** Para hashing e segurança das senhas.
- **Nodemailer:** Para o serviço de envio de e-mails de recuperação de senha.

**Ambiente e Orquestração:**
- **Docker & Docker Compose:** Para criar um ambiente de desenvolvimento conteinerizado e consistente.

---

## 🚀 Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- **Node.js e NPM:** [https://nodejs.org/](https://nodejs.org/)
- **Docker e Docker Compose:** [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/Movimentacao-de-caixa.git
cd Movimentacao-de-caixa
```

### 2. Configurar Variáveis de Ambiente (Backend)

O backend precisa de um arquivo `.env` com credenciais para se conectar ao Supabase e outros serviços. Navegue até a pasta `backend` e crie uma cópia do arquivo de exemplo:

```bash
cd backend
cp .env.example .env
```

Agora, abra o arquivo `.env` e preencha as seguintes variáveis com suas credenciais:

```env
# Credenciais do seu projeto Supabase
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-publica

# Chaves secretas para os tokens JWT (use valores longos e aleatórios)
JWT_ACCESS_SECRET=seu_super_secret_access_token
JWT_REFRESH_SECRET=seu_super_secret_refresh_token

# Configuração do seu serviço de e-mail (ex: Mailtrap, SendGrid)
SMTP_HOST=smtp.example.com
SMTP_USER=seu-usuario-smtp
SMTP_PASS=sua-senha-smtp

# Porta em que o backend irá rodar
PORT=3000
```

### 3. Instalar as Dependências

É necessário instalar as dependências para o frontend e o backend separadamente.

```bash
# Na pasta raiz do projeto, instale as dependências do backend
cd backend
npm install

# Volte para a raiz e instale as dependências do frontend
cd ../frontend
npm install
```

### 4. Rodar a Aplicação com Docker Compose

A maneira mais simples de iniciar a aplicação é usando o Docker Compose, que orquestrará os contêineres do frontend e do backend.

Na pasta raiz do projeto, execute o seguinte comando:

```bash
docker-compose up --build
```

Opcionalmente, para rodar em modo "detached" (em segundo plano), use a flag `-d`:

```bash
docker-compose up --build -d
```

Aplicação estará disponível nos seguintes endereços:
- **Frontend:** https://Movimentacao-de-caixa.vercel.app
- **Backend:** https://Movimentacao-de-caixa.onrender.com

---

## 📝 Estrutura do Projeto

O projeto é organizado em duas pastas principais:

- **/frontend:** Contém toda a aplicação React, incluindo páginas, componentes, estilos e serviços de API.
- **/backend:** Contém a API Node.js/Express, com controladores, serviços, rotas e middlewares para lidar com a lógica de negócio e a comunicação com o banco de dados.