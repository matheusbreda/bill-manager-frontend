import { Bill } from "./bill";
import { BillPersonDTO } from "./billPersonDTO";

export class BillDTO {
    billList: Bill[];
    billPersonDTO: BillPersonDTO[];
    creditSalaryOverall: number;
    creditBenefitOverall: number;
    creditOtherOverall: number;
    creditOverall: number;
    marketOverall:number;
    billOverall:number;
}