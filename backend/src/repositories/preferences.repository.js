import { prisma } from '../db/prisma.js';

export async function getUserPreferences(userId) {
  return await prisma.userPreferences.findUnique({
    where: { userId },
  });
}

export async function createUserPreferences(userId, preferences) {
  return await prisma.userPreferences.create({
    data: { userId, ...preferences },
  });
}

export async function deleteUserPreferences(userId) {
  return await prisma.userPreferences.delete({
    where: { userId },
  });
}

export async function updateUserPreferences(userId, preferences) {
  return await prisma.userPreferences.update({
    where: { userId },
    data: preferences,
  });
}
