import { IStorageService } from '../../../domain/certificate/services/IStorageService';
import * as fs from 'fs/promises';
import * as path from 'path';

export class StorageService implements IStorageService {
  private readonly uploadDir = 'uploads/certificates';

  constructor() {
    fs.mkdir(this.uploadDir, { recursive: true }).catch(console.error);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fs.rename(file.path, filePath);
      return `/uploads/certificates/${fileName}`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Falha ao salvar o arquivo: ${error.message}`);
      }
      throw new Error('Falha ao salvar o arquivo');
    }
  }

  getPhysicalPath(urlPath: string): string {
    const fileName = urlPath.replace('/uploads/certificates/', '');
    return path.join(this.uploadDir, fileName);
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      // Se o caminho começar com /uploads/, resolve para o caminho físico
      const physicalPath = filePath.startsWith('/uploads/')
        ? this.getPhysicalPath(filePath)
        : filePath;

      await fs.unlink(physicalPath);
    } catch (error) {
      if (error instanceof Error && (error as any).code !== 'ENOENT') {
        throw new Error(`Falha ao excluir o arquivo: ${error.message}`);
      }
      // Se não existir (ENOENT), ignoramos o erro silenciosamente
    }
  }
} 