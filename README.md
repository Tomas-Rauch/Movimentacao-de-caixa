# Gerenciador de Fluxo de Caixa

## Introdução

O Gerenciador de Fluxo de Caixa é uma aplicação web full-stack projetada para oferecer um controle financeiro centralizado e eficiente. Com uma interface intuitiva, o sistema permite que administradores gerenciem usuários e que todos os membros da equipe colaborem em um único balanço financeiro, visualizando todas as transações de entrada e saída de forma unificada.

A aplicação conta com um sistema de autenticação seguro, perfis de usuário (Admin e Funcionário) e funcionalidades específicas para cada nível de acesso, garantindo tanto a colaboração quanto a segurança dos dados.

---

## Observações Importantes (ATENÇÃO)

- **Para fazer login na conta principal de admin, utilize as credencias que enviamos nos comentários da atividade no classroom. Logando nessa conta você terá acesso as funcionalidades do projeto, como o CRUD de movimentações financeiras, visualização de saldo total e movimentações, listagem, criação e edição de usuários no sistema, etc. 
- **Essa conta é a principal conta de admin do sistema, nela é possível criar novos usuários, podendo ser outros admins ou funcionários comuns, e também editar e excluir usuários já existentes, e essa conta de admin principal não tem como ser excluída também.

- **Para testar a recuperação de senha, pode ser utilizando qualquer email de contas cadastradas na aplicação, caso o email realmente exista, será enviado um link para a recuperação de email. 

-- **ATENÇÃO: O EMAIL DE RECUPERAÇÃO DE SENHA PROVAVELMENTE IRÁ CAIR NA CAIXA DE SPAM, ENTÃO É NECESSÁRIO OLHAR LÁ PARA VER O EMAIL E CRIAR UMA SENHA NOVA.

Depois de acessar o link para criar uma senha nova, você será direcionado para uma nova página, onde você digita e confirma a senha nova, então você deverá voltar para a aplicação principal na tela de login para fazer login novamente com a senha nova que foi definida e o email. 

-- **Como falamos no comentário enviado no classroom, criamos um gmail para você acessar caso queira testar a recuperação de senha nele, enviamos as credenciais do gmail lá no comentário, é só fazer login normalmente, não é necessária autenticação em 2 fatores. Depois de logado no gmail, a mensagem de recuperação de senha provavelmente irá estar na caixa de SPAM, então tem que conferir lá.


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
- **Railway:** Frontend e backend do projeto estão hospedados no railway.

---

## 📝 Estrutura do Projeto

O projeto é organizado em duas pastas principais:

- **/frontend:** Contém toda a aplicação React, incluindo páginas, componentes, estilos e serviços de API.
- **/backend:** Contém a API Node.js/Express, com controladores, serviços, rotas e middlewares para lidar com a lógica de negócio e a comunicação com o banco de dados.