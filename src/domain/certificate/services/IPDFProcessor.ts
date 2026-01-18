export interface PDFInformation {
  workload: number;
  day: number;
  month: number;
  endDay: number;
  endMonth: number;
  year: number;
  title?: string;
}

export interface IPDFProcessor {
  extractInformation(filePath: string): Promise<PDFInformation>;
}