import { ICertificateRepository } from '../../src/domain/certificate/repositories/ICertificateRepository';
import { Certificate } from '../../src/domain/certificate/entities/Certificate';

export class InMemoryCertificateRepository implements ICertificateRepository {
    public certificates: Certificate[] = [];

    async create(certificate: Certificate): Promise<Certificate> {
        if (!certificate.id) certificate.id = Math.random().toString(36).substring(7);
        this.certificates.push(certificate);
        return certificate;
    }

    async findById(id: string): Promise<Certificate | null> {
        return this.certificates.find(c => c.id === id) || null;
    }

    async findByUserId(userId: string): Promise<Certificate[]> {
        return this.certificates.filter(c => c.userId === userId);
    }

    async update(certificate: Certificate): Promise<Certificate> {
        const index = this.certificates.findIndex(c => c.id === certificate.id);
        if (index !== -1) {
            this.certificates[index] = certificate;
        }
        return certificate;
    }

    async delete(id: string): Promise<void> {
        this.certificates = this.certificates.filter(c => c.id !== id);
    }

    async findAll(): Promise<Certificate[]> {
        return this.certificates;
    }

    async findByStatus(status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
        return this.certificates.filter(c => c.status === status);
    }

    async findByUserIdAndStatus(userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<Certificate[]> {
        return this.certificates.filter(c => c.userId === userId && c.status === status);
    }

    async listByCoordenador(coordenadorId: string): Promise<Certificate[]> {
        return this.certificates; 
    }

    async listByTutor(tutorId: string): Promise<Certificate[]> {
        return this.certificates;
    }

    async listByBolsista(bolsistaId: string): Promise<Certificate[]> {
        return this.certificates.filter(c => c.userId === bolsistaId);
    }

    async validarPorCoordenador(certificadoId: string, coordenadorId: string, aprovado: boolean, comentarios?: string): Promise<void> {
        const cert = this.certificates.find(c => c.id === certificadoId);
        if (cert) {
            cert.status = aprovado ? 'approved' : 'rejected';
            cert.adminComments = comentarios;
        }
    }

    async emitirPorTutor(tutorId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
        const novoCert = new Certificate(dados as any);
        return this.create(novoCert);
    }

    async solicitarPorBolsista(bolsistaId: string, dados: Omit<Certificate, 'id'>): Promise<Certificate> {
        const novoCert = new Certificate(dados as any);
        return this.create(novoCert);
    }
}