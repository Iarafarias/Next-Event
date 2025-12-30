import { Certificate } from '../entities/Certificate';

export interface ICertificateRepository {
  create(certificate: Certificate): Promise<Certificate>;
  findById(id: string): Promise<Certificate | null>;
  findByUserId(userId: string): Promise<Certificate[]>;
  update(certificate: Certificate): Promise<Certificate>;
  delete(id: string): Promise<void>;
  findAll(): Promise<Certificate[]>;
  findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]>;
  findByUserIdAndStatus(userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]>;

  listByCoordenador(coordenadorId: string): Promise<Certificate[]>;
  listByTutor(tutorId: string): Promise<Certificate[]>;
  listByBolsista(bolsistaId: string): Promise<Certificate[]>;

  validarPorCoordenador(certificadoId: string, coordenadorId: string, aprovado: boolean, comentarios?: string): Promise<void>;
  emitirPorTutor(tutorId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate>;
  solicitarPorBolsista(bolsistaId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate>;
} 