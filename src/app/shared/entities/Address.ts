import {AuditEntity} from './';

export class Address extends AuditEntity {
    primaryNumber: string = '';
    preDirectional: string = '';
    streetName: string = '';
    suffix: string = '';
    postDirectional: string = '';
    city: string = '';
    zipCode: string = '';
    zipCodeExtension: string = '';

    get fullAddress() {
        return this.primaryNumber + this.preDirectional + this.streetName + this.suffix + this.postDirectional;
    }
}