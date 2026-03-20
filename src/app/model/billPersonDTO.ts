import { Credit } from './credit';
import { Debit } from './debit';

export class BillPersonDTO {
    name: string;
    creditList: Credit[];
    creditSalary: number;
    creditBenefit: number;
    creditOther: number;
    creditFull: number;
    debitList: Debit[];
    debitFull: number;
    payable: number;
    percentage: number;
    payableMarket: number;
    percentageMarket: number;
}
