import { prisma } from '../db/prisma.js';

// register
export async function createUser (email, passwordHash) {
  return await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
}

// login and registeration
export async function findUserByEmail (email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

// login and user management (in the future)
export async function findUserById (id) {
  return await prisma.user.findUnique({
    where: { id },
  });
}

// user management (in the future) not usable for now, but will be needed for admin panel and user self-service

export async function deleteUser (id) {
  return await prisma.user.delete({
    where: { id },
  });
}

// user management (in the future) not usable for now, but will be needed for admin panel and user self-service

export async function updateUser (id, data) {
  return await prisma.user.update({
    where: { id },
    data,
  });
}