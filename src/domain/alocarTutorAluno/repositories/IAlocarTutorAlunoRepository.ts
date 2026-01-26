import { CreateAlocarTutorAlunoDTO } from '../../../application/alocarTutorAluno/dtos/CreateAlocarTutorAlunoDTO';
import { UpdateAlocarTutorAlunoDTO } from '../../../application/alocarTutorAluno/dtos/UpdateAlocarTutorAlunoDTO';
import { AlocarTutorAlunoResponseDTO } from '../../../application/alocarTutorAluno/dtos/AlocarTutorAlunoResponseDTO';

export interface IAlocarTutorAlunoRepository {
  create(data: CreateAlocarTutorAlunoDTO): Promise<AlocarTutorAlunoResponseDTO>;
  update(id: string, data: UpdateAlocarTutorAlunoDTO): Promise<AlocarTutorAlunoResponseDTO | null>;
  getById(id: string): Promise<AlocarTutorAlunoResponseDTO | null>;
  list(filters?: { tutorId?: string; bolsistaId?: string; periodoId?: string }): Promise<AlocarTutorAlunoResponseDTO[]>;
  delete(id: string): Promise<void>;

}
