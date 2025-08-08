import { IPDFProcessor, PDFInformation } from '../../../domain/certificate/services/IPDFProcessor';
import pdf from 'pdf-parse';
import * as fs from 'fs/promises';

export class PDFProcessorService implements IPDFProcessor {
  async extractInformation(filePath: string): Promise<PDFInformation> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);

      const text = data.text;
      const workloadMatch = text.match(/\b(?:com\s+)?carga\s+horária\s+de\s*(\d+)\s*horas?\b/i);
      const dateMatch = text.match(/(\d+)\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+a\s+(\d+)\s+de\s+(janeiro|fevereiro|março|abril|maio|junho|julho|agosto|setembro|outubro|novembro|dezembro)\s+de\s+(\d{4})/i);

      if (!workloadMatch || !dateMatch) {
        throw new Error(`Could not extract required information from PDF. Text: ${text.substring(0, 200)}...`);
      }

      const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

      const startMonth = monthNames.indexOf(dateMatch[2].toLowerCase()) + 1;
      const endMonth = monthNames.indexOf(dateMatch[4].toLowerCase()) + 1;
      const year = parseInt(dateMatch[5]);

      return {
        workload: parseInt(workloadMatch[1]),
        month: startMonth,
        endMonth: endMonth,
        year: year
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to process PDF: ${error.message}`);
      }
      throw new Error('Failed to process PDF');
    }
  }
} 