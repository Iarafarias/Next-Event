import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { CreateAvaliacaoTutoriaUseCase } from '../../../../src/application/avaliacaoTutoria/use-cases/CreateAvaliacaoTutoriaUseCase';
import { InMemoryAvaliacaoTutoriaRepository } from '../../../builder/InMemoryAvaliacaoTutoriaRepository';
import { CreateAvaliacaoTutoriaDTO } from '../../../../src/application/avaliacaoTutoria/dtos/CreateAvaliacaoTutoriaDTO';

describe('CreateAvaliacaoTutoriaUseCase', () => {
  let createAvaliacaoTutoriaUseCase: CreateAvaliacaoTutoriaUseCase;
  let avaliacaoTutoriaRepository: InMemoryAvaliacaoTutoriaRepository;

  const validDTO: CreateAvaliacaoTutoriaDTO = {
    usuarioId: 'user-123',
    periodoId: 'periodo-789',
    tipoAvaliador: 'ALUNO',
    comentarioGeral: 'Tutor excelente, muito atencioso.',
    aspectosPositivos: ['Paciência', 'Domínio do conteúdo'],
    aspectosNegativos: ['Nenhum ponto negativo relevante'],
    sugestoesMelhorias: ['Manter o ritmo atual'],
    dificuldadesComunicacao: 'Nenhuma',
    dificuldadesConteudo: 'Baixa',
    dificuldadesMetodologicas: 'Nenhuma',
    dificuldadesRecursos: 'Internet instável as vezes',
    outrasDificuldades: '',
    nivelSatisfacaoGeral: 'MUITO_SATISFEITO',
    recomendariaPrograma: true,
    justificativaRecomendacao: 'Ajuda muito no aprendizado'
  };

  beforeEach(() => {
    avaliacaoTutoriaRepository = new InMemoryAvaliacaoTutoriaRepository();
    createAvaliacaoTutoriaUseCase = new CreateAvaliacaoTutoriaUseCase(avaliacaoTutoriaRepository);
  });

  it('deve criar uma avaliação de tutoria com sucesso', async () => {
    const result = await createAvaliacaoTutoriaUseCase.execute(validDTO);

    expect(result).toHaveProperty('id');
    expect(result.usuarioId).toBe(validDTO.usuarioId);
    
    // Verifica se salvou no repositório
    expect(avaliacaoTutoriaRepository.items).toHaveLength(1);
    
    const savedItem = avaliacaoTutoriaRepository.items[0];
    
    // Verifica campos aninhados na entidade
    expect(savedItem.conteudo.experiencia.comentarioGeral).toBe(validDTO.comentarioGeral);
    expect(savedItem.conteudo.nivelSatisfacaoGeral).toBe(validDTO.nivelSatisfacaoGeral);
  });

  it('deve repassar o erro caso o repositório falhe ao salvar', async () => {
    jest.spyOn(avaliacaoTutoriaRepository, 'save').mockRejectedValueOnce(new Error('Erro de conexão com o banco'));

    await expect(createAvaliacaoTutoriaUseCase.execute(validDTO))
      .rejects
      .toThrow('Erro de conexão com o banco');
  });
});