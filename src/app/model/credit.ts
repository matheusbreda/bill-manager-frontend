import { Person } from "./person";

export enum CreditTypeEnum {
  SALARY = 'SALARY',
  BENEFIT = 'BENEFIT',
  OTHER = 'OTHER',
}

export enum ValueTypeEnum {
    FIXED = 'FIXED',
    VARIABLE = 'VARIABLE',
}

export enum DurationTypeEnum {
    MONTH = 'MONTH',
    YEAR = 'YEAR',
}

export class Credit {
    id: number;
    creditType: CreditTypeEnum;
    value: number;
    valueType: ValueTypeEnum;
    duration: number;
    durationType: DurationTypeEnum;
    date: Date;
    annotation: string;
    person: Person;
}
