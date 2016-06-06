import {
  Owner,
  State,
  Address,
  Property,
  County,
  PhoneNumber,
  Market,
  Submarket,
  Stats,
  Coordinate,
  Company,
  CompanyOwnedProperty,
    Units} from '../interfaces';
import {Injectable, Inject} from '@angular/core';
import {WebAddress} from "../interfaces/property.interface";

@Injectable()
export class FactoryService {

  constructor(@Inject('moment') public moment, @Inject('_') public _) {

  }

  createProperty(property): Property {
    let p: Property = {
      id: property.id || property.propertyId,
      name: property.name,
      floorCount: property.floorCount,
      yearBuilt: property.yearBuilt,
      lastRehab: property.lastRehab,
      county: this.createCounty(property.county),
      address: this.createAddress(property.address),
      phoneNumber: this.createPhoneNumber(property.phoneNumber),
      owners: this._.map(property.owners, (owner) => {return this.createOwner(owner); }),
      managers: this._.map(property.managers, (m) => {
        m.startDate = m.startDate ? new Date(m.startDate) : m.startDate;
        m.endDate = m.endDate ? new Date(m.endDate) : m.endDate;
        return m;
      }),
      market: this.createMarket(property.market),
      submarket: this.createSubmarket(property.submarket),
      stats: this.createStats(property.currentStats),
      coordinate: this.createCoordinate(property.coordinates ? property.coordinates[0] : null),
      units: this.createUnits(property.units)
    };
    return p;
  }

  createCompany(company): Company {
    let _company: Company = { 
      id: company.id,
      name: company.name,
      stockSymbol: company.stockSymbol,
      address: this.createAddress(company.address),
      phoneNumber: this.createPhoneNumber(company.phoneNumber),
      webAddress: this.createWebAddress(company.webAddress),
      properties: this._.concat(this._.map(company.owned, (ownedProperty) => { return this.createCompanyOwnedProperty(ownedProperty);}),
                                this._.map(company.managed, (managedProperty) => { return this.createCompanyOwnedProperty(managedProperty); }))
    };

    return _company;
  }

  createCompanyOwnedProperty(property): CompanyOwnedProperty {
    if(! property) {
      return {
        startDate: null,
        endDate: null,
        type: '',
        property: this.createProperty(null)
      }
    }

    let _companyOwnedProperty: CompanyOwnedProperty = {
      startDate: property.startDate,
      endDate: property.endDate,
      type: property.type,
      property: this.createProperty(property.property)
    }

    return _companyOwnedProperty;
  }

  createWebAddress(webAddress): WebAddress {
    if(! webAddress) {
      return  {
        url: null
      }
    }

    let _webAddress: WebAddress = {
      url: webAddress.webAddress.url
    }

    return _webAddress;
  }

  createOwner(owner): Owner {
    if (! owner) {
      return  {
        id: null,
        startDate: null,
        endDate: null,
        percentage: null,
        name: null,
        stockSymbol: null,
        propertyOwnerType: null,
        address: null,
        phoneNumber: null,
        webAddress: null
      };
    }

    let _owner: Owner = {
      id: owner.company.id,
      startDate: owner.startDate !== null ? this.moment(owner.startDate).toDate() : null,
      endDate: owner.endDate !== null ? this.moment(owner.endDate).toDate() : null,
      percentage: owner.percentage,
      name: owner.company.name,
      stockSymbol: owner.company.stockSymbol,
      propertyOwnerType: owner.company.propertyOwnerType,
      address: this.createAddress(owner.company.address),
      phoneNumber: owner.company.phoneNumber,
      webAddress: owner.company.webAddress
    };

    return _owner;
  }

  createState(state): State {
    if (! state) {
      return {
        id: null,
        name: null,
        shortName: null,
        fipsCode: null
      };
    }

    let _state: State = {
      id: state.id,
      name: state.name,
      shortName: state.shortName,
      fipsCode: state.fipsCode
    };

    return _state;
  }

  createCounty(county): County {
    if (! county) {
      return {
        id: null,
        name: null,
        fipsCode: null
      };
    }

    let _county: County = {
      id: county.id,
      name: county.name,
      fipsCode: county.fipsCode
    };

    return _county;
  }

  createAddress(address): Address {
    if (! address) {
      return {
        id: null,
        type: null,
        streetName: null,
        city: null,
        zipCode: null,
        zipCodeExtension: null,
        state: null
      };
    }

    let _address: Address = {
      id: address.address.id,
      type: address.address.propertyAddressType,
      streetName: address.address.streetName,
      city: address.address.city,
      zipCode: address.address.zipCode,
      zipCodeExtension: address.address.zipCodeExtension,
      state: this.createState(address.address.stateProvince)
    };

    return _address;
  }

  createPhoneNumber(phoneNumber): PhoneNumber {
    if (! phoneNumber) {
      return {
        id: null,
        primaryNumber: null,
        extension: null
      };
    }
    let _phone: PhoneNumber = {
      id: phoneNumber.phoneNumber.id,
      primaryNumber: phoneNumber.phoneNumber.primaryNumber,
      extension: phoneNumber.phoneNumber.extension,
      // type: phoneNumber.propertyPhoneNumberType.name
    };

    return _phone;
  }

  createMarket(market): Market {
    if (! market) {
      return {
        id: null,
        marketCode: null,
        shortName: null,
        name: null
      };
    }

    let _market: Market = {
      id: market.market.id,
      marketCode: market.market.marketCode,
      shortName: market.market.shortName,
      name: market.market.name
    };

    return _market;
  }

  createSubmarket(submarket): Submarket {
    if (! submarket) {
      return {
        id: null,
        name: null
      };
    }

    let _submarket: Submarket = {
      id: submarket.submarket.id,
      name: submarket.submarket.name
    };

    return _submarket;
  }

  createStats(stats): Stats {
    if (! stats) {
      return {
        occupancyStatus: null,
        propertyType: null,
        occupancy: null,
        surveyDateTime: null
      };
    }

    let _stats: Stats = {
      occupancyStatus: stats.occupancyStatus.name,
      propertyType: stats.propertyType.name,
      occupancy: stats.occupancy,
      surveyDateTime: stats.surveyDateTime !== null ?
        this.moment(stats.surveyDateTime).toDate() : null
    };

    return _stats;
  }

  createCoordinate(coordinate): Coordinate {
    if (! coordinate) {
      return {
        latitude: null,
        longitude: null
      };
    }

    let _coordinate: Coordinate = {
      latitude: coordinate.latitude,
      longitude: coordinate.longitude
    };

    return _coordinate;
  }

  createUnits(units): Units {
    if(! units) {
      return {
        units: null,
        effectiveRent: null
      }
    };

    let _units: Units = {
      units: units.units,
      effectiveRent: units.effectiveRent
    }

    return _units;
  }
}
