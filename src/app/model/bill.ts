import { DurationTypeEnum, ValueTypeEnum } from "./credit";

export class Bill {
    id: number;
    name: string;
    value: number;
    valueType: ValueTypeEnum;
    duration: number;
    durationType: DurationTypeEnum;
    date: Date;
    annotation: string;
}
