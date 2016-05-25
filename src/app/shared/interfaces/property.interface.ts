export enum OccupancyStatus {
  Stabilized
}
export enum PropertyType {
  Conventional,
  StudentHousing
}

export interface State {
  id: number;
  name: string;
  shortName: string;
  fipsCode: string;
}

export interface County {
  id: number;
  name: string;
  fipsCode: string;
}

export interface Address {
  id: number;
  type: string;
  streetName: string;
  city: string;
  zipCode: string;
  zipCodeExtension: string;
  state: State;
}

export interface PhoneNumber {
  id: number;
  primaryNumber: string;
  extension: string;
}

export interface Owner {
  id: number;
  startDate: Date;
  endDate: Date;
  propertyOwnerType: string;
  percentage: number;
  name: string;
  stockSymbol: string;
  address: Address;
  phoneNumber: PhoneNumber;
  webAddress: string;
}

export interface Submarket {
  id: number;
  name: string;
}

export interface Market {
  id: number;
  name: string;
  marketCode: number;
  shortName: string;
}

export interface Stats {
  occupancyStatus: string;
  propertyType: string;
  occupancy: number;
  surveyDateTime: Date;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Property {
  id: number;
  name: string;
  floorCount: number;
  yearBuilt: number;
  lastRehab: number;
  county: County;
  address: Address;
  phoneNumber: PhoneNumber;
  owners: Owner[];
  market: Market;
  submarket: Submarket;
  stats: Stats;
  coordinate: Coordinate;
}