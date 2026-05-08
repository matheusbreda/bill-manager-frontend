import { MonthlyClosurePerson } from './monthlyClosurePerson';

export class MonthlyClosure {
    id?: number;
    month: number;
    year: number;
    closureDate?: string;
    creditSalaryOverall: number;
    creditBenefitOverall: number;
    creditOtherOverall: number;
    creditOverall: number;
    billOverall: number;
    marketOverall: number;
    debitOverall: number;
    remainingOverall: number;
    persons: MonthlyClosurePerson[];
}
