export interface IStorageService {
  uploadFile(file: Express.Multer.File): Promise<string>;
  deleteFile(filePath: string): Promise<void>;
  getPhysicalPath(urlPath: string): string;
} 