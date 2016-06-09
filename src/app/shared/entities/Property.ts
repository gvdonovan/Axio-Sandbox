import {AuditEntity,BaseEntity,Address,County,PhoneNumber,Market,Submarket,WebAddress,Coordinates,Company} from "./";
import * as moment from 'moment';

class PropertyAddress extends BaseEntity {
    address: Address = new Address();
}

class PropertyPhoneNumber extends BaseEntity {
    phoneNumber: PhoneNumber = new PhoneNumber();
}

class PropertyWebAddress extends BaseEntity {
    webAddress: WebAddress = new WebAddress();
}

class PropertyMarket extends BaseEntity {
    market: Market = new Market();
}

class PropertySubmarket extends BaseEntity {
    submarket: Submarket = new Submarket();
}

class PropertyManager extends BaseEntity {
    startDate: Date = new Date();
    endDate: Date = new Date();
    company: Company = new Company();
}

class PropertyOwnerType extends BaseEntity {
    name: string = '';
}

class PropertyOwner extends BaseEntity {
    startDate: Date = new Date();
    endDate: Date = new Date();
    propertyOwnerType: PropertyOwnerType = new PropertyOwnerType();
    company: Company = new Company();
}

class OccupancyStatus extends BaseEntity{
    name: string = '';
}

class PropertyType extends BaseEntity {
    name: string = '';
}

class UnitMixEstimatedType extends BaseEntity {
    name: string = '';
}

class PropertyStats {
    period: string = '';
    surveyDateTime: Date = new Date();
    occupancy: number = null;
    leasingAgent: string = '';
    isOccupancyEstimated: boolean = false;
    isPreLeaseOccupancyEstimated: boolean = false;
    isStudentCompetitive: boolean = false;
    occupancyStatus: OccupancyStatus = new OccupancyStatus();
    propertyType: PropertyType = new PropertyType();
    unitMixEstimatedType: UnitMixEstimatedType = new UnitMixEstimatedType();
}

class Units {
    units: number = null;
    effectiveRent: number = null;
}

export class Property extends AuditEntity {
    name: string = '';
    floorCount: number = null;
    yearBuilt: number = null;
    lastRennovation: number = null;
    county: County = new County();
    address: PropertyAddress = new PropertyAddress();
    webAddress: PropertyWebAddress = new PropertyWebAddress();
    phoneNumber: PropertyPhoneNumber = new PropertyPhoneNumber();
    market: PropertyMarket = new PropertyMarket();
    submarket: PropertySubmarket = new PropertySubmarket();
    coordinates: Coordinates[] = [new Coordinates()];
    managers: PropertyManager[] = [new PropertyManager()];
    owners: PropertyOwner[] = [new PropertyOwner()];
    units: Units = new Units();
    currentStats: PropertyStats = new PropertyStats();
}

export class NewFactoryService {

    private static parseData(object, json) {
        Object.keys(object)
            .filter((key) => !(object[key] instanceof Object))
            .forEach((key) => object[key] = (json !== null && json.hasOwnProperty(key) ? json[key] : null));

        Object.keys(object)
            .filter((key) => object[key] instanceof  Object)
            .forEach((key) => {
                if(object[key] instanceof Array) {
                    if(json !== null && json.hasOwnProperty(key) && json[key] instanceof Array) {
                        object[key] = json[key].map(value => {
                            let tempObj = new object[key][0].constructor();
                            this.parseData(tempObj,value);
                            return tempObj;
                        });
                    }
                }
                else if (object[key] instanceof Date) {
                    object[key] = (json !== null && json.hasOwnProperty(key) && json[key] !== null
                        ? moment(json[key]).toDate() : null);
                }
                else if(json !== null && json.hasOwnProperty(key)){
                    this.parseData(object[key],json[key]);
                }
            });
    }

    static create(objectClass: any,json: any) {
        let object = new objectClass();
        this.parseData(object,json);

        return object;
    }
}
