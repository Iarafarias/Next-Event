import { Request, Response } from 'express';
import { CreateCertificateUseCase } from '../../../application/certificate/use-cases/CreateCertificateUseCase';
import { UpdateCertificateStatusUseCase } from '../../../application/certificate/use-cases/UpdateCertificateStatusUseCase';
import { ListUserCertificatesUseCase } from '../../../application/certificate/use-cases/ListUserCertificatesUseCase';
import { DeleteCertificateUseCase } from '../../../application/certificate/use-cases/DeleteCertificateUseCase';
import { PostgresCertificateRepository } from '../../../infrastructure/certificate/repositories/postgresCertificateRepository';
import { UploadCertificateUseCase } from '../../../application/certificate/use-cases/UploadCertificateUseCase';
import { GenerateReportUseCase } from '../../../application/certificate/use-cases/GenerateReportUseCase';
import { GenerateUserReportUseCase } from '../../../application/certificate/use-cases/GenerateUserReportUseCase';
import { SetReferenceMonthUseCase } from '../../../application/certificate/use-cases/SetReferenceMonthUseCase';
import { AuthenticatedRequest } from '../../types/AuthenticatedRequest';
import { IStorageService } from '../../../domain/certificate/services/IStorageService';
import { IPDFProcessor } from '../../../domain/certificate/services/IPDFProcessor';
import { SendCertificateValidationNotificationUseCase } from '../../../application/notification/use-cases/SendCertificateValidationNotificationUseCase';
import { CreateNotificationUseCase } from '../../../application/notification/use-cases/CreateNotificationUseCase';
import { PostgresNotificationRepository } from '../../../infrastructure/notification/repositories/PostgresNotificationRepository';

export class CertificateController {
  private readonly createCertificateUseCase: CreateCertificateUseCase;
  private readonly updateCertificateStatusUseCase: UpdateCertificateStatusUseCase;
  private readonly listUserCertificatesUseCase: ListUserCertificatesUseCase;
  private readonly deleteCertificateUseCase: DeleteCertificateUseCase;
  private readonly generateUserReportUseCase: GenerateUserReportUseCase;

  constructor(
    private readonly uploadCertificateUseCase: UploadCertificateUseCase,
    private readonly generateReportUseCase: GenerateReportUseCase,
    private readonly setReferenceMonthUseCase: SetReferenceMonthUseCase,
    private readonly storageService: IStorageService,
    private readonly pdfProcessor: IPDFProcessor
  ) {
    const repository = new PostgresCertificateRepository();
    const notificationRepository = new PostgresNotificationRepository();
    const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository);
    const sendNotificationUseCase = new SendCertificateValidationNotificationUseCase(createNotificationUseCase);

    this.createCertificateUseCase = new CreateCertificateUseCase(repository, storageService, pdfProcessor);
    this.updateCertificateStatusUseCase = new UpdateCertificateStatusUseCase(repository, sendNotificationUseCase);
    this.listUserCertificatesUseCase = new ListUserCertificatesUseCase(repository);
    this.deleteCertificateUseCase = new DeleteCertificateUseCase(repository);
    this.generateUserReportUseCase = new GenerateUserReportUseCase(repository);
  }

  async create(request: Request, response: Response): Promise<Response> {
    try {
      const { id: userId } = (request as AuthenticatedRequest).user;
      const certificate = await this.uploadCertificateUseCase.execute({
        ...request.body,
        userId,
        file: (request as any).file
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

      return response.json({ certificates });
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async delete(request: AuthenticatedRequest, response: Response): Promise<Response> {
    try {
      const { id } = request.params;
      const { role } = request.user;

      await this.deleteCertificateUseCase.execute({
        id,
        userId: role === 'admin' ? undefined : request.user.id
      });

      return response.status(204).send();
    } catch (error: any) {
      return response.status(400).json({ error: error.message });
    }
  }

  async setReferenceMonth(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { month, year } = req.body;

      if (!month || !year) {
        return res.status(400).json({ error: 'Mês e ano são obrigatórios' });
      }

      await this.setReferenceMonthUseCase.execute({ month: Number(month), year: Number(year) });

      return res.status(200).json({
        message: 'Mês de referência definido com sucesso'
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async getCurrentReferenceMonth(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const setReferenceUseCase = new SetReferenceMonthUseCase();
      const reference = await setReferenceUseCase.getCurrentReference();

      if (!reference) {
        return res.status(404).json({
          error: 'Nenhum mês de referência configurado',
          reference: null
        });
      }

      return res.status(200).json({
        message: 'Mês de referência recuperado com sucesso',
        reference: reference
      });
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async upload(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo fornecido' });
      }

      const { title, description, institution, workload, startDate, endDate } = req.body;

      const certificate = await this.uploadCertificateUseCase.execute({
        userId: req.user.id,
        file: req.file,
        title,
        description,
        institution,
        workload: workload ? parseInt(workload) : undefined,
        startDate,
        endDate
      });

      return res.status(201).json(certificate);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async generateReport(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      const { month, year } = req.query;
      const userId = req.params.userId;

      // Se tem userId nos parâmetros, é um relatório individual
      if (userId) {
        const userReport = await this.generateUserReportUseCase.execute(userId);
        return res.status(200).json(userReport);
      }

      // Se não tem userId, é relatório geral (requer month e year)
      if (!month || !year) {
        return res.status(400).json({ error: 'Mês e ano são obrigatórios para relatórios gerais' });
      }

      const report = await this.generateReportUseCase.execute({
        month: parseInt(month as string),
        year: parseInt(year as string)
      });

      return res.status(200).json(report);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  async downloadCertificate(req: AuthenticatedRequest, res: Response): Promise<Response | void> {
    try {
      const { id } = req.params;
      const { id: userId, role } = req.user;

      const repository = new PostgresCertificateRepository();
      const certificate = await repository.findById(id);

      if (!certificate) {
        return res.status(404).json({ error: 'Certificado não encontrado' });
      }
      if (role !== 'admin' && certificate.userId !== userId) {
        return res.status(403).json({ error: 'Acesso negado' });
      }

      const fs = require('fs').promises;
      const path = require('path');

      let filePath: string;
      if (certificate.certificateUrl.startsWith('/uploads/')) {
        filePath = path.resolve(certificate.certificateUrl.substring(1));
      } else {
        filePath = path.resolve(certificate.certificateUrl);
      }

      try {
        await fs.access(filePath);

        return res.download(filePath, `certificate-${certificate.id}.pdf`, (err) => {
          if (err && !res.headersSent) {
            return res.status(500).json({ error: 'Falha ao baixar o arquivo' });
          }
        });
      } catch (fileError) {
        return res.status(404).json({ error: 'Arquivo do certificado não encontrado' });
      }
    } catch (error) {
      if (error instanceof Error) {
        return res.status(400).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
