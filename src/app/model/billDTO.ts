import { BillPersonDTO } from "./billPersonDTO";

export class BillDTO {
    billPerson: BillPersonDTO[];
    creditSalaryOverall: number;
    creditBenefitOverall: number;
    creditOtherOverall: number;
    creditOverall: number;
    billOverall:number;
}