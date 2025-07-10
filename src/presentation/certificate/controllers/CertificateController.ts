import { Request, Response } from 'express';
import { CreateCertificateUseCase } from '../../../application/certificate/use-cases/CreateCertificateUseCase';
import { UpdateCertificateStatusUseCase } from '../../../application/certificate/use-cases/UpdateCertificateStatusUseCase';
import { ListUserCertificatesUseCase } from '../../../application/certificate/use-cases/ListUserCertificatesUseCase';
import { GenerateUserReportUseCase } from '../../../application/certificate/use-cases/GenerateUserReportUseCase';
import { PostgresCertificateRepository } from '../../../infrastructure/certificate/repositories/postgresCertificateRepository';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    role: 'admin' | 'participant';
  };
}

export class CertificateController {
  private createCertificateUseCase: CreateCertificateUseCase;
  private updateCertificateStatusUseCase: UpdateCertificateStatusUseCase;
  private listUserCertificatesUseCase: ListUserCertificatesUseCase;
  private generateUserReportUseCase: GenerateUserReportUseCase;

  constructor() {
    const repository = new PostgresCertificateRepository();
    this.createCertificateUseCase = new CreateCertificateUseCase(repository);
    this.updateCertificateStatusUseCase = new UpdateCertificateStatusUseCase(repository);
    this.listUserCertificatesUseCase = new ListUserCertificatesUseCase(repository);
    this.generateUserReportUseCase = new GenerateUserReportUseCase(repository);
  }

  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const certificate = await this.createCertificateUseCase.execute({
        ...request.body,
        userId,
      });
      return response.status(201).json(certificate);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async updateStatus(request: Request, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const { status, adminComments } = request.body;
      
      const certificate = await this.updateCertificateStatusUseCase.execute({
        id,
        status,
        adminComments,
      });
      
      return response.json(certificate);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async listUserCertificates(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request.params;
      const { status } = request.query;
      
      const certificates = await this.listUserCertificatesUseCase.execute({
        userId,
        status: status as 'pending' | 'approved' | 'rejected',
      });
      
      return response.json(certificates);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async generateReport(request: Request, response: Response): Promise<Response> {
    try {
      const { userId } = request.params;
      const report = await this.generateUserReportUseCase.execute(userId);
      return response.json(report);
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }
} 