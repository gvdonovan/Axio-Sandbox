import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import { UserService } from '../services';

@Component({
  directives: [
    ROUTER_DIRECTIVES,
  ],
  selector: '[login]',
  host: {
    '[class]' : "'app, login-page'"
  },
  template: require('./login.component.html')
})
export class LoginComponent {
  constructor(
    private userService: UserService
  ) { }

	login(username: string, password: string) {
      this.userService.login(username, password);
	}
}
