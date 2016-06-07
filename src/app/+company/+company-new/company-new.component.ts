import {Component,OnInit} from "@angular/core";
import {ControlGroup, Control, Validators} from '@angular/common';
import {Router} from '@angular/router';
import {Panel, FormAdressComponent, FormPhoneComponent, FormWebAddressComponent} from "../../shared/components";
import {CompanyService} from "../shared/company.service";
import {HttpClient} from "../../shared/services/http-client.service";
import {ToastsManager} from '../../../vendor/ng2-toastr/ng2-toastr';

@Component({
  selector: 'company-new',
  template: require('./company-new.component.html'),
  styles: [require('./company-new.component.scss')],
  directives: [Panel, FormAdressComponent, FormPhoneComponent, FormWebAddressComponent],
  providers: [CompanyService, HttpClient]
})
export class CompanyNewComponent implements OnInit{
  form:ControlGroup;
  pendingData: any = {
    company: {},
    address: {},
    phoneNumber: {},
    webAddress: {}
  };
  
  constructor(private companyService: CompanyService,
              private router:Router,
              public toastr: ToastsManager) {
  }

  ngOnInit() {
    this.form = new ControlGroup({
      name: new Control('', Validators.compose([Validators.required])),
      stockSymbol: new Control('', Validators.compose([Validators.required])),
    });

    this.form.valueChanges.debounceTime(400).distinctUntilChanged().subscribe(
        value => {
          this.OnFormChanged({valid:this.form.valid,value:value}, 'company'); 
        }
    )
  }

  OnFormChanged(e: any, type: string): void {
    this.pendingData[type] = e;
  }

  SaveCompany(): void {
    if(this.pendingData.company.valid && this.pendingData.address.valid && this.pendingData.phoneNumber.valid && this.pendingData.webAddress.valid) {
      this.companyService.createCompany(this.pendingData.company.value,this.pendingData.phoneNumber.value,this.pendingData.webAddress.value,this.pendingData.address.value)
          .subscribe(
              response => {
                this.toastr.success('the company has been created successfully.');
                this.router.navigate(['/app/company/' + response.company.id]);
              }
          )
    }
  }
}
