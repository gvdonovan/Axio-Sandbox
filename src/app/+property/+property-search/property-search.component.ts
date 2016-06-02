import { Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {Http} from "@angular/http";
import {ControlGroup, FormBuilder, Control, Validators} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Subscription} from "rxjs/Subscription";
import {
    TYPEAHEAD_DIRECTIVES,
    DROPDOWN_DIRECTIVES,
    CollapseDirective,
    PAGINATION_DIRECTIVES, DATEPICKER_DIRECTIVES
} from 'ng2-bootstrap/ng2-bootstrap';

import {STATES, MARKETS, SUBMARKETS, OCCUPANCY_STATUS} from '../../shared/data';
import {SearchService, PropertySearchFormStore} from "../../shared/services";
import {Panel} from '../../shared/components';
import {SearchFormValidator, CommonValidator, ValidationResult} from '../shared';

@Component({
    selector: 'ax-property',
    template: require('./property-search.component.html'),
    styles: [ require('./property-search.component.scss') ],
    directives: [
        TYPEAHEAD_DIRECTIVES,
        DROPDOWN_DIRECTIVES,
        DATEPICKER_DIRECTIVES,
        CollapseDirective,
        PAGINATION_DIRECTIVES,
        Panel,
        ROUTER_DIRECTIVES
    ]
})
export class PropertySearchComponent  implements OnInit, OnDestroy{
    public totalItems: number = 64;
    public currentPage: number = 4;
    public searchActive: boolean = false;
    public isCollapsed: boolean = false;

    public serchResultsFields = ['name','address','levels','units'];

    private searchResults: Array<Object> = [];
    private form: ControlGroup;
    private searchResultSubscriber: Subscription;

    public typeaheads: Object = {
        countyName: {
            model: '',
            typeahead: () => {
                let currentState = this._.find(STATES, {id: this.form.find('stateProvinceId').value});
                if (currentState) {
                    return this._.map(currentState.counties, 'name');
                }
                else {
                    return [];
                }
            }
        },
        stateProvinceId: {
            model: '',
            typeahead: () => {
                return this._.map(STATES, 'name');
            },
            typeaheadOnSelect: (e: any) => {
                let currentState = this._.find(STATES, {name: e.item});
                if(currentState) {
                    (<Control>this.form.find('stateProvinceId')).updateValue(currentState.id);
                }
            },
            transform: (stateProvinceId) => {
                return this._.find(STATES, {id: stateProvinceId}).name;
            }
        },
        marketId: {
            model: '',
            typeahead: () => {
                return this._.map(MARKETS, 'name');
            },
            typeaheadOnSelect: (e: any) => {
                let currentMarket = this._.find(MARKETS, {name: e.item});
                if(currentMarket) {
                    (<Control>this.form.find('marketId')).updateValue(currentMarket.id);
                }
            },
            transform: (marketId) => {
                return this._.find(MARKETS, {id: marketId}).name;
            }
        },
        submarketId: {
            model: '',
            typeahead: () => {
                let currentMarket = this._.find(MARKETS,{id: this.form.find('marketId').value});
                if(currentMarket){
                    return this._.map(currentMarket.submarkets, 'name');
                }
                else {
                    return [];
                }
            },
            typeaheadOnSelect: (e: any) => {
                let currentMarket = this._.find(MARKETS,{id: this.form.find('marketId').value});
                if(currentMarket) {
                    let currentSubmarket = this._.find(currentMarket.submarkets, {name: e.item});
                    if(currentSubmarket) {
                        (<Control>this.form.find('submarketId')).updateValue(currentSubmarket.id);
                    }
                }
            },
            transform: (submarketId) => {
                return this._.find(SUBMARKETS, {id: submarketId}).name;
            }
        },
        occupancyStatusId: {
            model:'',
            typeahead: () => {
                return this._.map(OCCUPANCY_STATUS, 'name');
            },
            typeaheadOnSelect: (e: any) => {
                let currentStats = this._.find(OCCUPANCY_STATUS, {name: e.item});
                if(currentStats) {
                    (<Control>this.form.find('occupancyStatusId')).updateValue(currentStats.id);
                }
            },
            transform: (occupancyStatusId) => {
                return this._.find(OCCUPANCY_STATUS, {id: occupancyStatusId}).name;
            }
        }
    };

    typeaheadOnSelect(e: any, name: string, value: string): void {
        (<Control>this.form.find(name)).updateValue(e.item);
    }
    
    typeaheadOnValueChanged(name: string, value: string): void {
        if(!value) {
            (<Control>this.form.find(name)).updateValue(value);
        }
    }

    public getContext():any {
        return this;
    }

    private resetForm(): void {
        // form controls reset
        this._.each(this.form.controls, (control: Control) => {
            control.updateValue('');
            control.setErrors(null);
        });

        //typeahead reset (it does not support ng control for now)
        this._.each(this.typeaheads, (typeahead) => {
            typeahead.model = '';
        });
    }

    private search(): void {
        let formWithoutEmptyValues = this.removeEmptyValues(this.form.value);

        if(this._.keys(formWithoutEmptyValues).length > 0){
            this.searchService.advancedSearch(formWithoutEmptyValues)
                .subscribe(
                    _searchResults => {
                        if(_searchResults.count > 0 && _searchResults.results.length > 0) {
                            this.searchService.setSearchResults(_searchResults);
                        }
                    }
                );

            this.searchFormState.saveState(formWithoutEmptyValues);
        }
    }

    public pageChanged(e): void {
        let formWithoutEmptyValues = this.removeEmptyValues(this.form.value);

        if(this._.keys(formWithoutEmptyValues).length > 0){
            this.searchService.advancedSearch(formWithoutEmptyValues,e.page)
                .subscribe(
                    _searchResults => {
                        if(_searchResults.count > 0 && _searchResults.results.length > 0) {
                            this.searchService.setSearchResults(_searchResults);
                        }
                    }
                );
        }
    }

    constructor(private builder: FormBuilder, 
                @Inject('_') private _,
                @Inject('moment') private moment,
                private searchService: SearchService,
                private http: Http,
                private searchFormState: PropertySearchFormStore) {

        this.form = builder.group({

            propertyName: '',
            streetName: '',
            cityName: '',
            countyName: '',
            stateProvinceId: '',
            zipCode: ['', CommonValidator.ZipcodeField],

            marketId: '',
            submarketId: '',
            fipsCode: ['', CommonValidator.FipsCodeField],
            occupancyStatusId: '',
            phoneNumber: '',
            unformattedAPN: '',

            yearBuiltFrom: ['',
                Validators.compose([
                    Validators.maxLength(4),
                    Validators.minLength(4),
                    function(control: Control): ValidationResult{
                    return SearchFormValidator.StartField(
                        control,
                        <Control>control.root.find('yearBuiltTo')
                    );
            }])],
            yearBuiltTo: ['',
                Validators.compose([
                Validators.maxLength(4),
                Validators.minLength(4),
                function(control: Control): ValidationResult{
                    return SearchFormValidator.EndField(
                        <Control>control.root.find('yearBuiltFrom'),
                        control);
                }])
            ],
            yearRehabFrom: '',
            yearRehabTo: '',
            unitsFrom: '',
            unitsTo: '',

            parcelCountFrom: '',
            parcelCountTo: '',
            floorCountFrom: '',
            floorCountTo: '',
            salePriceFrom: '',
            salePriceTo: '',

            soldFrom: '',
            soldTo: ''
        });
    }

    ngOnInit(): void {
        this.searchResultSubscriber = this.searchService.searchResult$
            .subscribe(
                _searchResults => {
                    if(_searchResults && _searchResults.results.length > 0) {

                        if(!this.searchActive) {
                            this.searchActive = true;
                        }

                        if(!this.isCollapsed) {
                            this.isCollapsed = true;
                        }

                        if(this.totalItems !== _searchResults.count ){
                            this.totalItems = _searchResults.count;
                        }

                        if(this.currentPage !== _searchResults.page) {
                            this.currentPage = _searchResults.page;
                        }

                        this.searchResults = _searchResults.results;
                    }
                }
            );

        let context = this;
        this.searchFormState.states$.subscribe((savedFormValue) => {
            if(!this._.isEqual(this.removeEmptyValues(this.form.value), savedFormValue)) {
             this._.each(savedFormValue, (value,key) => {
                 if(value) {
                     (<Control>this.form.find(key)).updateValue(value);

                     //set value for typeahead
                     if(key in context.typeaheads) {
                         if('transform' in context.typeaheads[key]) {
                             context.typeaheads[key].model = context.typeaheads[key].transform(value);
                         }
                         else {
                             context.typeaheads[key].model = value;
                         }
                     }
                 }
             })
            }
        })
    }

    ngOnDestroy(): void {
        this.searchResultSubscriber.unsubscribe();
    }

    private removeEmptyValues(data: Object): Object {
        return this._.pickBy(data, (value,key) => {
            return value;
        });
    }
}