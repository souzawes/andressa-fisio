<p align="center">
  <img src="https://i.ibb.co/4VpvmV0/andressa-fisio.png" alt="andressa-fisio" border="0" alt="Logo do Projeto" width="400" height="300">
</p>

# Sistema de Gestão para Clínica de Fisioterapia

Este projeto é um sistema de gestão para clínicas de fisioterapia, projetado para facilitar o cadastro de pacientes, agendamento de consultas e sessões recorrentes, agrupamento de pacientes em turmas, exibição de agenda semanal para fisioterapeutas, visualização de histórico de pacientes e controle financeiro.

## Status do Projeto 

> [!WARNING] 
> Este projeto está atualmente em desenvolvimento. Nem todos os módulos estão concluídos e algumas funcionalidades podem não estar totalmente implementadas ou podem estar sujeitas a mudanças.

## Funcionalidades Principais

- **Cadastro de Pacientes**: Registro de informações detalhadas dos pacientes.
- **Agendamento de Consultas**: Agendamento de consultas e sessões de fisioterapia.
- **Sessões Recorrentes**: Agendamento de sessões recorrentes para tratamentos contínuos.
- **Agrupamento de Pacientes em Turmas**: Criação e gerenciamento de turmas de pacientes para sessões em grupo.
- **Agenda Semanal**: Exibição de uma visão semanal das consultas e sessões para os fisioterapeutas.
- **Histórico dos Pacientes**: Visualização do histórico completo de consultas e tratamentos dos pacientes.
- **Controle Financeiro**: Gerenciamento dos aspectos financeiros da clínica.

## Tecnologias Utilizadas

- **Next.js**: Framework de React para construção da interface do usuário.
- **PostgreSQL**: Banco de dados relacional utilizado para armazenar todas as informações.
- **Prisma**: ORM utilizado para facilitar a interação com o banco de dados.

## Requisitos

- **Node.js** (versão 20 ou superior)
- **PostgreSQL** (versão 12 ou superior)

## Instalação

1. **Clone o Repositório**

   ```bash
   git clone https://github.com/souzawes/andressa-fisio.git
   cd andressa-fisio
   ```

2. Instale as dependêcias

   ```bash
   npm install
   ```

3. Configuração do Banco de Dados

   Configure o banco de dados PostgreSQL e atualize o arquivo .env com suas credenciais de banco de dados.

    ```.env
    DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco"
    ```

4. Migrações do Banco de Dados

    Migrações do Banco de Dados

   ```bash
   npx prisma migrate dev --name init
   ```
   
5. Inicie o Servidor

   ```bash
   npm run dev
   ```

   A aplicação estará disponível em **http://localhost:3000**.


## 
