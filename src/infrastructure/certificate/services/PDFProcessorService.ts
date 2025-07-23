import { IPDFProcessor, PDFInformation } from '../../../domain/certificate/services/IPDFProcessor';
import pdf from 'pdf-parse';
import * as fs from 'fs/promises';

export class PDFProcessorService implements IPDFProcessor {
  async extractInformation(filePath: string): Promise<PDFInformation> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);

      // Extract information from PDF text
      // This is a simplified example - you'll need to implement proper text parsing
      const text = data.text;
      
      // Example parsing logic - adjust according to your PDF format
      const workloadMatch = text.match(/Carga horária:\s*(\d+)/i);
      const dateMatch = text.match(/Data:\s*(\d{2})\/(\d{2})\/(\d{4})/i);

      if (!workloadMatch || !dateMatch) {
        throw new Error('Could not extract required information from PDF');
      }

      return {
        workload: parseInt(workloadMatch[1]),
        month: parseInt(dateMatch[2]),
        year: parseInt(dateMatch[3])
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process PDF: ${error.message}`);
      }
      throw new Error('Failed to process PDF');
    }
  }
} 