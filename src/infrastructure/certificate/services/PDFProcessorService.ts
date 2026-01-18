import { IPDFProcessor, PDFInformation } from '../../../domain/certificate/services/IPDFProcessor';
import pdf from 'pdf-parse';
import * as fs from 'fs/promises';

export class PDFProcessorService implements IPDFProcessor {
  async extractInformation(filePath: string): Promise<PDFInformation> {
    try {
      const dataBuffer = await fs.readFile(filePath);
      const data = await pdf(dataBuffer);

      const text = data.text.replace(/\s+/g, ' ');

      // 1. Extração de Carga Horária
      const workloadMatch = text.match(/carga\s+horária\s+de\s*(\d+)\s*horas?/i);

      // 2. Extração de Datas (Ex: 31 de março a 31 de julho de 2025)
      const dateRegex = /(\d+)\s+de\s+([a-zç]+)(?:\s+de\s+(\d{4}))?\s+a\s+(\d+)\s+de\s+([a-zç]+)\s+de\s+(\d{4})/i;
      const dateMatch = text.match(dateRegex);

      // 3. Extração de Título
      // Tenta ser mais específico para o formato do usuário (UFC Crateús)
      let title = '';
      // Regex melhorada: tenta capturar o que vem depois de prefixos comuns, mas antes de "do(a)" ou "no período"
      const titleRegex = /(?:participou da?|apresentação oral|projeto|curso|título)\s+(?:apresentação oral\s+|da atividade\s+)?(.*?)(?:\s+do\(a\)|\s+no\(a\)|\s+na\s+Universidade|\s+promovido|\s+realizado|\s+com carga|\s+no período)/i;
      const titleMatch = text.match(titleRegex);
      if (titleMatch) {
        title = titleMatch[1].trim()
          .replace(/^apresentação oral\s+/i, '') // Remove prefixo redundante caso escape do grupo anterior
          .replace(/^da atividade\s+/i, '');
      }

      if (titleMatch) {
        title = titleMatch[1].trim()
          .replace(/^apresentação oral\s+/i, '') // Remove prefixo redundante caso escape do grupo anterior
          .replace(/^da atividade\s+/i, '');
      }

      if (!workloadMatch || !dateMatch) {
        throw new Error(`Não foi possível extrair as informações necessárias. Texto: ${text.substring(0, 150)}...`);
      }

      const monthNames = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

      const startDay = parseInt(dateMatch[1]);
      const startMonth = monthNames.indexOf(dateMatch[2].toLowerCase()) + 1;
      const endDay = parseInt(dateMatch[4]);
      const endMonth = monthNames.indexOf(dateMatch[5].toLowerCase()) + 1;
      const year = parseInt(dateMatch[6]);

      return {
        workload: parseInt(workloadMatch[1]),
        day: startDay,
        month: startMonth,
        endDay: endDay,
        endMonth: endMonth,
        year: year,
        title: title || undefined
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Falha ao processar PDF: ${error.message}`);
      }
      throw new Error('Falha ao processar PDF');
    }
  }
}