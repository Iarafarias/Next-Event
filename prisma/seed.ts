import { PrismaClient, StatusAtivacao, TipoUsuario } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário coordenador padrão
  const coordenadorUser = await prisma.usuario.upsert({
    where: { email: 'coordenador@nextcertify.com' },
    update: {},
    create: {
      nome: 'Coordenador Principal',
      email: 'coordenador@nextcertify.com',
      senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
      status: StatusAtivacao.ATIVO,
      coordenador: {
        create: {
          area: 'Tecnologia da Informação',
          nivel: 'Senior'
        }
      }
    },
  })

  // Criar período de tutoria padrão
  const periodoTutoria = await prisma.periodoTutoria.upsert({
    where: { id: 'periodo-2025-1' },
    update: {},
    create: {
      id: 'periodo-2025-1',
      nome: 'Período 2025.1',
      dataInicio: new Date('2025-01-01'),
      dataFim: new Date('2025-06-30'),
      ativo: true,
      descricao: 'Primeiro período de tutoria de 2025'
    }
  })

  // Criar cargas horárias mínimas
  const cargasMinimas = [
    { categoria: 'EVENTOS', horas: 40 },
    { categoria: 'MONITORIA', horas: 60 },
    { categoria: 'ESTUDOS_INDIVIDUAIS', horas: 20 }
  ]

  for (const carga of cargasMinimas) {
    await prisma.cargaHorariaMinima.upsert({
      where: {
        periodoId_categoria: {
          periodoId: periodoTutoria.id,
          categoria: carga.categoria as any
        }
      },
      update: {},
      create: {
        periodoId: periodoTutoria.id,
        categoria: carga.categoria as any,
        horasMinimas: carga.horas,
        descricao: `Carga mínima para ${carga.categoria.toLowerCase()}`
      }
    })
  }

  console.log('✅ Seed concluído com sucesso!')
  console.log('📧 Coordenador: coordenador@nextcertify.com | Senha: password')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro no seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })