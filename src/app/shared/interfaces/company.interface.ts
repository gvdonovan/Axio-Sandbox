import {Address, PhoneNumber, Property} from "./property.interface";

export interface Company {
  id: number;
  name: string;
  stockSymbol: string;
  address: Address;
  phoneNumber: PhoneNumber;
  properties: Property[];
}