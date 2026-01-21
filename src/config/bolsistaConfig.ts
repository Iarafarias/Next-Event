// Imports para dependências
import { PostgresRelatorioRepository } from '../infrastructure/relatorio/repositories/postgresRelatorioRepository';
import { PostgresAvaliacaoTutoriaRepository } from '../infrastructure/avaliacaoTutoria/repositories/PostgresAvaliacaoTutoriaRepository';
import { PostgresFormAcompanhamentoRepository } from '../infrastructure/formAcompanhamento/repositories/PostgresFormAcompanhamentoRepository';
import { PostgresCertificateRepository } from '../infrastructure/certificate/repositories/postgresCertificateRepository';
import { PostgresTutorRepository } from '../infrastructure/user/repositories/PostgresTutorRepository';
import { PostgresAlunoRepository } from '../infrastructure/aluno/repositories/PostgresAlunoRepository';

import { GenerateRelatorioConsolidadoUseCase } from '../application/relatorio/use-cases/GenerateRelatorioConsolidadoUseCase';
import { BolsistaViewDataUseCase } from '../application/user/use-cases/BolsistaViewDataUseCase';

import { BolsistaController } from '../presentation/user/controllers/BolsistaController';

// Inicializar repositories
const relatorioRepository = new PostgresRelatorioRepository();
const avaliacaoTutoriaRepository = new PostgresAvaliacaoTutoriaRepository();
const formAcompanhamentoRepository = new PostgresFormAcompanhamentoRepository();
const certificateRepository = new PostgresCertificateRepository();
const tutorRepository = new PostgresTutorRepository();
const alunoRepository = new PostgresAlunoRepository();

// Inicializar use cases
const generateRelatorioConsolidadoUseCase = new GenerateRelatorioConsolidadoUseCase(
  relatorioRepository,
  avaliacaoTutoriaRepository,
  formAcompanhamentoRepository,
  certificateRepository,
  tutorRepository,
  alunoRepository
);

const bolsistaViewDataUseCase = new BolsistaViewDataUseCase(
  alunoRepository,
  tutorRepository,
  certificateRepository,
  formAcompanhamentoRepository
);

// Inicializar controllers
const bolsistaController = new BolsistaController(
  bolsistaViewDataUseCase,
  generateRelatorioConsolidadoUseCase
);

// Importar e criar as rotas
import createBolsistaRoutes from '../presentation/bolsista/routes/bolsistaRoutes';
import createRelatorioConsolidadoRoutes from '../presentation/relatorio/routes/relatorioConsolidadoRoutes';

export const bolsistaRoutes = createBolsistaRoutes(bolsistaController);
export const relatorioConsolidadoRoutes = createRelatorioConsolidadoRoutes(generateRelatorioConsolidadoUseCase);