import {AuditEntity} from './';

export class PhoneNumber extends AuditEntity{
    primaryNumber: string = '';
    extension: string = '';
}