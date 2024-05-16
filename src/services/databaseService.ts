import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Exemplo: ler todos os usuários do banco de dados
async function getUsers() {
  const users = await prisma.users.findMany();
  return users;
}

// Exemplo: criar um novo usuário no banco de dados
async function createUser(name: string, email: string, password: string) {
  const newUser = await prisma.users.create({
    data: {
      name,
      email,
      password,
    },
  });
  return newUser;
}

// Exemplo: atualizar um usuário existente no banco de dados
async function updateUser(id: string, newData: { name?: string; email?: string }) {
  const updatedUser = await prisma.users.update({
    where: { id },
    data: newData,
  });
  return updatedUser;
}

// Exemplo: excluir um usuário existente no banco de dados
async function deleteUser(id: string) {
  const deletedUser = await prisma.users.delete({
    where: { id },
  });
  return deletedUser;
}

export async function getPatients() {
  return prisma.patients.findMany();
}

// Exemplo de uso:
// async function main() {
//   const newUser = await createUser('John Doe', 'john@example.com', 'password123');
//   console.log('Novo usuário criado:', newUser);

//   const users = await getUsers();
//   console.log('Todos os usuários:', users);
// }

// main().catch((error) => {
//   console.error('Erro:', error);
// });
