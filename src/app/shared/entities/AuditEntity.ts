import {BaseEntity} from "./BaseEntity";

export class AuditEntity extends BaseEntity {
    public createdOn: Date = new Date();
    public modifiedOn: Date = new Date();
    public rowVersion: string = '';
}