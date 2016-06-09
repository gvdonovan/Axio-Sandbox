import {Injectable, Inject} from '@angular/core';

@Injectable()
export class FactoryService {

  constructor(@Inject('moment') public moment, @Inject('_') public _) {

  }
}