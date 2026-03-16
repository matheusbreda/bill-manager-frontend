import { DurationTypeEnum, ValueTypeEnum } from "./credit";
import { Person } from "./person";

export class Debit {
    id: number;
    name: string;
    value: number;
    valueType: ValueTypeEnum;
    duration: number;
    durationType: DurationTypeEnum;
    date: Date;
    annotation: string;
    person: Person;
}
