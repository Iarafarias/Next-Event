import { PrismaClient, StatusAtivacao, TipoUsuario } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed do banco de dados...')

  // Criar usuário coordenador padrão
  const coordenadorUser = await prisma.usuario.upsert({
    where: { email: 'coordenador@nextcertify.com' },
    update: {},
    include: { coordenador: true },
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

  // Criar um curso de exemplo
  const curso = await prisma.curso.upsert({
    where: { codigo: 'CC-101' },
    update: {},
    create: {
      nome: 'Ciência da Computação - Exemplo',
      codigo: 'CC-101',
      descricao: 'Curso de teste para validação das funcionalidades',
      ativo: true
    }
  })

  // Criar um tutor de exemplo
  const tutorUser = await prisma.usuario.upsert({
    where: { email: 'tutor@nextcertify.com' },
    update: {},
    include: { tutor: true },
    create: {
      nome: 'Tutor Exemplo',
      email: 'tutor@nextcertify.com',
      senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      status: StatusAtivacao.ATIVO,
      tutor: {
        create: {
          area: 'Programação',
          nivel: 'Junior'
        }
      }
    }
  })

  // Criar um bolsista de exemplo (usuário + perfil bolsista)
  const bolsistaUser = await prisma.usuario.upsert({
    where: { email: 'bolsista@nextcertify.com' },
    update: {},
    include: { bolsista: true },
    create: {
      nome: 'Bolsista Exemplo',
      email: 'bolsista@nextcertify.com',
      senha: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
      matricula: '2025001',
      status: StatusAtivacao.ATIVO,
      bolsista: {
        create: {
          anoIngresso: 2025,
          curso: 'Ciência da Computação'
        }
      }
    }
  })

  // Vincular aluno (perfil Aluno) ao bolsistaUser
  const aluno = await prisma.aluno.upsert({
    where: { usuarioId: bolsistaUser.id },
    update: {},
    create: {
      usuarioId: bolsistaUser.id,
      cursoId: curso.id,
      matricula: '2025001',
      tipoAcesso: 'ACESSO_BOLSISTA'
    }
  })

  // Criar um certificado de exemplo para o bolsista
  const certificado = await prisma.certificado.upsert({
    where: { arquivoUrl: 'uploads/exemplo-certificado.pdf' },
    update: {},
    create: {
      bolsistaId: bolsistaUser.bolsista?.id || (await prisma.bolsista.findUnique({ where: { usuarioId: bolsistaUser.id } }))?.id!,
      titulo: 'Participação em Evento Exemplo',
      instituicao: 'Universidade Exemplo',
      cargaHoraria: 8,
      categoria: 'EVENTOS',
      dataInicio: new Date('2025-03-01'),
      dataFim: new Date('2025-03-01'),
      arquivoUrl: 'uploads/exemplo-certificado.pdf',
      status: 'PENDENTE'
    }
  })

  // Criar um formulário de acompanhamento de exemplo
  await prisma.formAcompanhamento.upsert({
    where: { id: 'form-exemplo-1' },
    update: {},
    create: {
      id: 'form-exemplo-1',
      tutorId: tutorUser.tutor?.id || (await prisma.tutor.findUnique({ where: { usuarioId: tutorUser.id } }))?.id!,
      bolsistaId: bolsistaUser.bolsista?.id || (await prisma.bolsista.findUnique({ where: { usuarioId: bolsistaUser.id } }))?.id!,
      periodoId: periodoTutoria.id,
      conteudo: { observacao: 'Formulário de exemplo inserido pelo seed' }
    }
  })

  // Alocar tutor ao bolsista no período
  await prisma.alocarTutorAluno.upsert({
    where: { id: 'alocacao-exemplo-1' },
    update: {},
    create: {
      id: 'alocacao-exemplo-1',
      tutorId: tutorUser.tutor?.id || (await prisma.tutor.findUnique({ where: { usuarioId: tutorUser.id } }))?.id!,
      bolsistaId: bolsistaUser.bolsista?.id || (await prisma.bolsista.findUnique({ where: { usuarioId: bolsistaUser.id } }))?.id!,
      periodoId: periodoTutoria.id,
      dataInicio: new Date(),
      ativo: true
    }
  })

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