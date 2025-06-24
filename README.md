# **Task Manager API 🚀**

**Uma API robusta para gerenciamento de tarefas em equipe**

Desenvolvida com Node.js, TypeScript e Prisma, esta API permite criar e gerenciar tarefas, times e usuários com controle de acesso baseado em roles (admin/member).

---

## **👥 Perfis de Acesso**

### **🛒 Administrador (admin)**  
*Responsável pela gestão completa do sistema*

- Gerencia usuários, times e tarefas  
- Acesso total a toda aplicação

### **📦 Membro (member)**  
*Foco em acompanhamento de tarefas*

- Visualiza times e tarefas atribuídas  
- Atualiza status de tarefas atribuídas e visualiza histórico de tarefas

---

## **🔄 Fluxo de Endpoints**

![Diagrama de Endpoints](https://github.com/user-attachments/assets/c293fcbb-d952-4206-bed4-ef3ef6f36a5d)

*Diagrama completo das relações entre entidades*

---

## **🗃️ Fluxograma do Banco de Dados**

![Fluxo do Banco](https://github.com/user-attachments/assets/141eb420-2d60-458a-8810-e0d2fa51e3f7)

*Fluxograma completo das relações entre as tabelas*

---

## **✨ Funcionalidades**

### **🔐 Autenticação e Usuários**

- ✅ Cadastro de usuários (roles: `admin` ou `member`)  
- 🔑 Login com JWT (token de autenticação)  
- 🛡️ Middleware de autenticação em rotas protegidas  

### **🏢 Gestão de Equipes**

- ➕ Criação de times com nomes únicos  
- 👥 Adição/remoção de membros em times (relação N:M)  
- 🔍 Detalhes do time (membros e contagem de tarefas)  
- ✏️ Atualização de nome e descrição  
- ❌ Exclusão de times  

### **✅ Sistema de Tarefas**

- 📝 CRUD completo de tarefas  
- 🏷️ Controle de **status** e **prioridade**  
- 🔄 Histórico automático de alterações (quem mudou, status anterior e novo)  
- 🔎 Filtros por:
  - Tarefas de um **usuário**
  - Tarefas de um **time**

### **📜 Task History**

- ⏳ Registro automático de alterações de status  
- 📜 Consulta do histórico completo de uma tarefa

---

## **🛠️ Tecnologias Utilizadas**

- Node.js + TypeScript  
- Express  
- PostgreSQL (Docker)  
- Prisma ORM  
- JWT + bcrypt  
- Zod  
- Jest + SuperTest  

### **🔧 Ferramentas Auxiliares**

- Docker (PostgreSQL container)  
- Prisma Studio  
- Insomnia (testes de API)  

### **🚀 Deploy**

- Render

---

## 🏁 Como Rodar o Projeto Localmente
Após clonar o repositório, acesse a pasta do projeto (Edite o arquivo .env com suas credenciais) e execute os comandos abaixo:

  ```sh
  docker-compose up -d
  npm install
  npx prisma migrate dev
  npx prisma generate
  npm run dev
```
Acesse a API no navegador ou via ferramenta de requisições (ex: Insomnia):
http://localhost:3333
