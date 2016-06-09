import {AuditEntity,BaseEntity,Address,PhoneNumber,WebAddress} from "./";

class CompanyAddress extends BaseEntity {
    address: Address = new Address();
}

class CompanyPhoneNumber extends BaseEntity {
    phoneNumber: PhoneNumber = new PhoneNumber();
}

class CompanyWebAddress extends BaseEntity {
    webAddress: WebAddress = new WebAddress();
}

export class Company extends AuditEntity {
    name: string = '';
    stockSymbol: string = '';
    address: CompanyAddress = new CompanyAddress();
    phoneNumber: CompanyPhoneNumber = new CompanyPhoneNumber();
    webAddress: CompanyWebAddress = new CompanyWebAddress();
}
