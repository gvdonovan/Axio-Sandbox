import { Component, Inject, OnInit, OnDestroy} from '@angular/core';
import {ControlGroup, FormBuilder, Control} from '@angular/common';
import {ROUTER_DIRECTIVES} from '@angular/router-deprecated';
import {
  TYPEAHEAD_DIRECTIVES,
  DROPDOWN_DIRECTIVES,
  CollapseDirective,
  PAGINATION_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {STATES} from '../shared/data';
import {MARKETS} from '../shared/data';
import {Property} from '../shared/interfaces';
import {SearchService} from "../shared/services/search.service";
import {Subscription} from "rxjs/Subscription";
import {Http} from "@angular/http";
import {PaginatePipe} from '../shared/pipes';

@Component({
  selector: '<advanced-search></advanced-search>',
  template: require('./advanced-search.component.html'),
  styles: [require('./advanced-search.component.css')],
  directives: [TYPEAHEAD_DIRECTIVES, DROPDOWN_DIRECTIVES, CollapseDirective, PAGINATION_DIRECTIVES, ROUTER_DIRECTIVES],
  pipes: [PaginatePipe]
})
export class AdvancedSearchComponent implements OnInit, OnDestroy{

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
  model: Object = {
    county: '',
    state: '',
    market: '',
    submarket:''
  };

  private savedSearches: Array<StoredSearch> = [];
  private searchResults: Array<Property> = [];
  private form: ControlGroup;
  private searchResultSubscriber: Subscription;

  typeaheadOnSelect(e: any, name: string, value: string): void {
    (<Control>this.form.find(name)).updateValue(e.item);
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

  private saveForm(name: Control): void {
    this.savedSearches.push({name: name.value, value: JSON.stringify(this.form.value)});
  }

  private gotoSearch(search: StoredSearch): void {
    let currentSearch = JSON.parse(search.value);
    let that = this;
    this._.each(currentSearch, (value, name) => {
      (<Control>that.form.find(name)).updateValue(value);
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
    this.initializeForm(builder, _);

    this.searchResultSubscriber = searchService.searchResult$
      .subscribe(
      _searchResults => {
        if(_searchResults && _searchResults.length > 0) {
          this.searchActive = true;
          this.isCollapsed = true;
          this.totalItems = _searchResults.length;
          this.currentPage = 1;
          this.searchResults = _searchResults;
        };
      });
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.searchResultSubscriber.unsubscribe();
  }
}

interface StoredSearch {
  name: string;
  value: string;
}

interface ValidationResult {
  [key: string]: boolean;
}

class CommonValidator {
  static ZipcodeField(control: Control): ValidationResult {
    let ZIPCODE_REGEX = /^\d{5}(?:[-\s]\d{4})?$/i;

    if (control.value) {
      if (!ZIPCODE_REGEX.test(control.value)) {
        return {
          invalidZipcode : true
        };
      }
    }

    return null;
  }
}

class SearchFormValidator {

  static StartField(startField: Control, endField: Control): ValidationResult {
    if (endField && endField.value && startField.value) {
      if (Number(startField.value) > Number(endField.value)) {
        return { invalidStartValue : true};
      }
    }

    return null;
  }

  static EndField(startField: Control, endField: Control): ValidationResult {
    if (startField && startField.value && endField.value) {
      if (Number(endField.value) < Number(startField.value)) {
        return { invalidEndValue : true};
      }
    }

    return null;
  }

}
