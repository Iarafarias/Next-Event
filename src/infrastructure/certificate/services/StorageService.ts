import { IStorageService } from '../../../domain/certificate/services/IStorageService';
import * as fs from 'fs/promises';
import * as path from 'path';

export class StorageService implements IStorageService {
  private readonly uploadDir = 'uploads/certificates';

  constructor() {
    // Ensure upload directory exists
    fs.mkdir(this.uploadDir, { recursive: true }).catch(console.error);
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(this.uploadDir, fileName);

    try {
      await fs.rename(file.path, filePath);
      return filePath;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to store file: ${error.message}`);
      }
      throw new Error('Failed to store file');
    }
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