import {Component, ViewEncapsulation, OnInit} from '@angular/core';
import {Routes, Router, ROUTER_DIRECTIVES} from '@angular/router';

import {ErrorComponent} from './app/error/error.component';
import {LoginComponent} from './app/login/login.component';
//import { AuthorizedRouterOutlet } from './app/login/authorized.router.outlet';
//import {ShellComponent} from './app/workspace/shell.component';
import {ShellComponent} from './app/shared/layout/index';
import {UserService} from './app/services';
declare var jQuery:any;

@Component({
    selector: 'body',
    directives: [ROUTER_DIRECTIVES],
    template: require('./app.component.html'),
    styles: [
        require('./scss/app.scss'),
        require('../node_modules/simplebar/dist/simplebar.css')
    ],
    encapsulation: ViewEncapsulation.None,
    providers: [UserService]
})
@Routes([
    {path: '/app', component: ShellComponent}, //, name: 'App', useAsDefault: true  },
    {path: '/error', component: ErrorComponent}, //, name: 'ErrorPage' },
    {path: '/login', component: LoginComponent}, //name: 'LoginPage'}
])
export class AppComponent implements OnInit {
    constructor(
        private router:Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        if (this.userService.loggedIn) {
            this.router.navigate(['/app']);
        } else {
            this.router.navigate(['/login']);
        }
    }
}
