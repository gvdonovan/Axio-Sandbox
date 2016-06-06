import {Address, PhoneNumber, Property, WebAddress} from "./property.interface";

export interface Company {
  id: number;
  name: string;
  stockSymbol: string;
  address: Address;
  phoneNumber: PhoneNumber;
  webAddress: WebAddress;
  properties: CompanyOwnedProperty[];
}

export interface CompanyOwnedProperty {
  startDate: Date;
  endDate: Date;
  type: string;
  property: Property
}