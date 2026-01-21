import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkCursos() {
  try {
    const cursos = await prisma.curso.findMany({
      orderBy: { codigo: 'asc' }
    });
    
    console.log('Cursos cadastrados:');
    cursos.forEach(curso => {
      console.log(`- ${curso.codigo}: ${curso.nome}`);
    });
    
  } catch (error) {
    console.error('Erro ao buscar cursos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCursos();