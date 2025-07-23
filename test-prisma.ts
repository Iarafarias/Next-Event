import { PrismaClient } from '@prisma/client';

// Teste para verificar os tipos disponíveis do Prisma
const prisma = new PrismaClient();

// Verificar se notification existe
console.log(typeof prisma.notification);

// Listar todas as propriedades do prisma
console.log('Propriedades do prisma:', Object.keys(prisma));

export {};
