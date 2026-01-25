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
      if ((file as any).path) {
        await fs.rename((file as any).path, filePath);
      } else if ((file as any).buffer) {
        await fs.writeFile(filePath, (file as any).buffer);
      } else {
        throw new Error('No file data available to store');
      }
      return `/uploads/certificates/${fileName}`;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to store file: ${error.message}`);
      }
      throw new Error('Failed to store file');
    }
  }

  getPhysicalPath(urlPath: string): string {
    const fileName = urlPath.replace('/uploads/certificates/', '');
    return path.join(this.uploadDir, fileName);
  }

  async deleteFile(filePathOrUrl: string): Promise<void> {
    try {
      // Se for uma URL, converte para caminho físico
      const physicalPath = filePathOrUrl.includes('/uploads/certificates/')
        ? this.getPhysicalPath(filePathOrUrl)
        : filePathOrUrl;

      await fs.unlink(physicalPath);
    } catch (error: any) {
      // Ignora erro se o arquivo já não existir
      if (error.code === 'ENOENT') {
        return;
      }

      console.error(`Falha ao excluir arquivo: ${error.message}`);
    }
  }
}
