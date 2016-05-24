// import {Directive, Attribute, ViewContainerRef, DynamicComponentLoader} from '@angular/core';
// import {Router, RouterOutlet, ComponentInstruction} from '@angular/router-deprecated';
// import { UserService } from '../services';
//
//
// @Directive({
//   selector: 'authorized-router-outlet'
// })
// export class AuthorizedRouterOutlet extends RouterOutlet {
//   publicRoutes: any;
//   private parentRouter: Router;
//
//   constructor(
//     _elementRef: ViewContainerRef,
//     _loader: DynamicComponentLoader,
//     _parentRouter: Router,
//     @Attribute('name') nameAttr: string,
//     private userService: UserService
//   ) {
//     super(_elementRef, _loader, _parentRouter, nameAttr);
//
//     this.parentRouter = _parentRouter;
//     this.publicRoutes = ['signup', 'login'];
//   }
//
//   activate(instruction: ComponentInstruction) {
//     if (this._canActivate(instruction.urlPath)) {
//       return super.activate(instruction);
//     }
//
//     this.parentRouter.navigateByUrl('/login');
//   }
//
//   private _canActivate(url : string) {
//     return this.publicRoutes.indexOf(url) !== -1 || this.userService.loggedIn;
//   }
// }
