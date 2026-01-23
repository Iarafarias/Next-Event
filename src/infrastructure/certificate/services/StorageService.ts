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

  async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete file: ${error.message}`);
      }
      throw new Error('Failed to delete file');
    }
  }
} 