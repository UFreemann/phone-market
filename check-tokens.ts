import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const tokens = await prisma.passwordResetToken.findMany();
  console.log('--- ACTIVE TOKENS ---');
  console.log(tokens);
}
main();
