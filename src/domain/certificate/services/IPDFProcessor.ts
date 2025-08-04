export interface PDFInformation {
  workload: number;
  month: number;
  endMonth: number;
  year: number;
}

export interface IPDFProcessor {
  extractInformation(filePath: string): Promise<PDFInformation>;
} 