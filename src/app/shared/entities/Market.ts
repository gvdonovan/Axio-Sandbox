import {AuditEntity} from "./AuditEntity";

export class Market extends AuditEntity{
    marketCode: number = null;
    shortName: string = '';
    name: string = '';
}