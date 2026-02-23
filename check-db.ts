import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const users = await prisma.user.findMany();
    console.log('--- USERS FOUND ---');
    console.log(users);
    console.log('-------------------');
  } catch (e) {
    console.error('Error connecting:', e);
  } finally {
    await prisma.$disconnect();
  }
}

main();
