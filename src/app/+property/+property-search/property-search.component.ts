import { Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {Http} from "@angular/http";
import {ControlGroup, FormBuilder, Control, Validators} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Subscription} from "rxjs/Subscription";
import {
    TYPEAHEAD_DIRECTIVES,
    DROPDOWN_DIRECTIVES,
    CollapseDirective,
    PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';

import {STATES, MARKETS, OCCUPANCY_STATUS} from '../../shared/data';
import {PaginatePipe} from '../../shared/pipes';
import {Property} from '../../shared/interfaces';
import {SearchService} from "../../shared/services";
import {SearchFormValidator, CommonValidator, ValidationResult} from '../shared';

@Component({
    selector: 'ax-property',
    template: require('./property-search.component.html'),
    styles: [ require('./property-search.component.scss') ],
    directives: [TYPEAHEAD_DIRECTIVES, DROPDOWN_DIRECTIVES, CollapseDirective, PAGINATION_DIRECTIVES, ROUTER_DIRECTIVES],
    pipes: [PaginatePipe]
})
export class PropertySearchComponent  implements OnInit, OnDestroy{
    public totalItems: number = 64;
    public currentPage: number = 4;
    public searchActive: boolean = false;
    public isCollapsed: boolean = false;

    fields: Object[] = [
        {
            className: 'row',
            fieldGroups: [
                {
                    className: 'col-lg-2',
                    type: 'input',
                    key: 'streetName',
                    templateOptions: {
                        type: 'text',
                        label: 'Street',
                        placeholder: '',
                        required: true
                    }
                },
                {
                    className: 'col-lg-1',
                    type: 'input',
                    key: 'cityName',
                    templateOptions: {
                        type: 'text',
                        label: 'City',
                        placeholder: '',
                        options: (context): Function => {return function ():Promise<Object[]> {
                            let currentState = context._.find(STATES,{name: context.form.find('state').value});
                            return context.http.get('http://localhost:59176/api/properties/cities/' + currentState.id).map((response) => {return response.json();}).toPromise();
                        } },
                        disabled: () => {
                            return !this.form.find('state').value; }
                    },
                },
                {
                    className: 'col-lg-1',
                    type: 'typeahead',
                    key: 'countyName',
                    templateOptions: {
                        type: 'text',
                        label: 'County',
                        placeholder: '',
                        options: () => {
                            let currentState = this._.find(STATES,{name: this.form.find('state').value});
                            if(currentState){
                                return this._.map(currentState.counties, 'name');
                            }
                            else {
                                return [];
                            }
                        },
                        disabled: () => {
                            return !this.form.find('state').value;
                        }
                    }
                },
                {
                    className: 'col-lg-1',
                    type: 'typeahead',
                    key: 'state',
                    templateOptions: {
                        type: 'text',
                        label: 'State',
                        placeholder: '',
                        options: () => {return this._.map(STATES, 'name');}
                    },
                    validator: []
                },
                {
                    className: 'col-lg-1',
                    type: 'input',
                    key: 'zipCode',
                    templateOptions: {
                        type: 'number',
                        label: 'Zipcode',
                        placeholder: ''
                    },
                    validator: [CommonValidator.ZipcodeField]
                },
                {
                    className: 'col-lg-1',
                    type: 'typeahead',
                    key: 'occNoteId',
                    templateOptions: {
                        type: 'number',
                        label: 'OccNote Id',
                        placeholder: '',
                        options: () => { return ['1', '2', '3', '4', '22', '25', '45']; }
                    }
                },
                {
                    className: 'col-lg-2',
                    type: 'typeahead',
                    key: 'market',
                    templateOptions: {
                        type: 'text',
                        label: 'Market',
                        placeholder: '',
                        options: () => { return this._.map(MARKETS, 'name'); }
                    }
                },
                {
                    className: 'col-lg-1',
                    type: 'input',
                    key: 'msaId',
                    templateOptions: {
                        type: 'number',
                        label: 'MSA ID',
                        placeholder: ''
                    }
                },
                {
                    className: 'col-lg-2',
                    type: 'typeahead',
                    key: 'submarket',
                    templateOptions: {
                        type: 'text',
                        label: 'Submarket',
                        placeholder: '',
                        options: () => {
                            let currentMarket = this._.find(MARKETS,{name: this.form.find('market').value});
                            if(currentMarket){
                                return this._.map(currentMarket.submarkets, 'name');
                            }
                            else {
                                return [];
                            }
                        },
                        disabled: () => {
                            return !this.form.find('market').value;
                        }
                    }
                }
            ]
        },
        {
            className: 'row',
            fieldGroups: [
                {
                    className: 'col-lg-1 field-joined-group-left',
                    type: 'input',
                    key: 'yearBuiltFrom',
                    templateOptions: {
                        type: 'number',
                        label: 'Year Built',
                        placeholder: 'From...'
                    },
                    validator: [function(control: Control): ValidationResult{
                        return SearchFormValidator.StartField(
                            control,
                            <Control>control.root.find('yearBuiltTo')
                        );
                    }]
                },
                {
                    className: 'col-lg-1 field-joined-group-right',
                    type: 'input',
                    key: 'yearBuiltTo',
                    templateOptions: {
                        type: 'number',
                        label: '&nbsp;',
                        placeholder: 'To...'
                    },
                    validator: [function(control: Control): ValidationResult{
                        return SearchFormValidator.EndField(
                            <Control>control.root.find('yearBuiltFrom'),
                            control);
                    }]
                },
                {
                    className: 'col-lg-1 field-joined-group-left',
                    type: 'input',
                    key: 'lastRehabFrom',
                    templateOptions: {
                        type: 'number',
                        label: 'Last Renovation',
                        placeholder: 'From...'
                    }
                },
                {
                    className: 'col-lg-1 field-joined-group-right',
                    type: 'input',
                    key: 'lastRehabTo',
                    templateOptions: {
                        type: 'number',
                        label: '&nbsp;',
                        placeholder: 'To...'
                    }
                },
                {
                    className: 'col-lg-1 field-joined-group-left',
                    type: 'input',
                    key: 'unitsFrom',
                    templateOptions: {
                        type: 'number',
                        label: 'Units',
                        placeholder: 'From...'
                    }
                },
                {
                    className: 'col-lg-1 field-joined-group-right',
                    type: 'input',
                    key: 'unitsTo',
                    templateOptions: {
                        type: 'number',
                        label: '&nbsp;',
                        placeholder: 'To...'
                    }
                },
                {
                    className: 'col-lg-1 field-joined-group-left',
                    type: 'input',
                    key: 'levelsFrom',
                    templateOptions: {
                        type: 'number',
                        label: 'Levels',
                        placeholder: 'From...'
                    }
                },
                {
                    className: 'col-lg-1 field-joined-group-right',
                    type: 'input',
                    key: 'levelsTo',
                    templateOptions: {
                        type: 'number',
                        label: '&nbsp;',
                        placeholder: 'To...'
                    }
                }

            ]
        }
    ];

    typeaheads: Object = {
        countyName: {
            model: '',
            typeahead: () => {
                let currentState = this._.find(STATES, {id: this.form.find('stateId').value});
                if (currentState) {
                    return this._.map(currentState.counties, 'name');
                }
                else {
                    return [];
                }
            }
        },
        stateId: {
            model: '',
            typeahead: () => {
                return this._.map(STATES, 'name');
            },
            typeaheadOnSelect: (e: any) => {
                let currentState = this._.find(STATES, {name: e.item});
                if(currentState) {
                    (<Control>this.form.find('stateId')).updateValue(currentState.id);
                }
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
            }
        }
    };

    model: Object = {
        county: '',
        state: '',
        market: '',
        submarket:''
    };

    private searchResults: Array<Property> = [];
    private form: ControlGroup;
    private searchResultSubscriber: Subscription;

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
        this._.each(this.form.controls, (control: Control) => {
            control.updateValue('');
            control.setErrors(null);
        });
    }

    private search(): void {
        this.searchActive = true;
        this.isCollapsed = true;
        this.searchService.advancedSearch(this.form.value)
            .subscribe(
                _searchResults => {
                    if(_searchResults && _searchResults.length > 0) {
                        this.searchService.setSearchResults(_searchResults);
                    }}
            );
    }

    public pageChanged(e): void {
        console.log(e);
    }

    private initializeForm(builder: FormBuilder, _): void {

        this.form = builder.group(_.reduce(
            _.flatten(_.map(this.fields, 'fieldGroups')),
            (result, value, key) => {
                if (value.validator && value.validator.length > 0) {
                    result[value.key] = ['', value.validator[0]];
                } else {
                    result[value.key] = [''];
                }
                return result;
            }, {}));
    }

    constructor(private builder: FormBuilder, @Inject('_') private _,
                private searchService: SearchService,
                private http: Http) {
        //this.initializeForm(builder, _);
        this.form = builder.group({

            propertyName: '',
            streetName: '',
            cityName: '',
            countyName: '',
            stateId: '',
            zipCode: ['', CommonValidator.ZipcodeField],

            marketId: '',
            submarketId: '',
            fipsCode: ['', CommonValidator.FipsCodeField],
            occupancyStatusId: '',
            phone: '',
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
            ]
        });

        this.searchResultSubscriber = searchService.searchResult$
            .subscribe(
                _searchResults => {
                    if(_searchResults && _searchResults.length > 0) {
                        this.searchActive = true;
                        this.isCollapsed = true;
                        this.totalItems = _searchResults.length;
                        this.currentPage = 1;
                        this.searchResults = _searchResults;
                    }
                }
            );
    }

    ngOnInit(): void {

    }

    ngOnDestroy(): void {
        this.searchResultSubscriber.unsubscribe();
    }
}