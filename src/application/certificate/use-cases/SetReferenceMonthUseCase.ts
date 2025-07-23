interface SetReferenceMonthDTO {
  month: number;
  year: number;
}

export class SetReferenceMonthUseCase {
  private static referenceMonth: number | null = null;
  private static referenceYear: number | null = null;

  execute(data: SetReferenceMonthDTO): void {
    if (data.month < 1 || data.month > 12) {
      throw new Error('Invalid month. Must be between 1 and 12');
    }

    if (data.year < 2000) {
      throw new Error('Invalid year');
    }

    SetReferenceMonthUseCase.referenceMonth = data.month;
    SetReferenceMonthUseCase.referenceYear = data.year;
  }

  static getCurrentReference(): { month: number; year: number } | null {
    if (this.referenceMonth === null || this.referenceYear === null) {
      return null;
    }

    return {
      month: this.referenceMonth,
      year: this.referenceYear
    };
  }
} 