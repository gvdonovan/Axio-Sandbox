import {Address, PhoneNumber, Property, WebAddress} from "./property.interface";

export interface Company {
  id: number;
  name: string;
  stockSymbol: string;
  address: Address;
  phoneNumber: PhoneNumber;
  webAddress: WebAddress;
  properties: Property[];
}
