// import { JwtHelper } from 'angular2-jwt';
// import { CanActivate, ComponentDefinition } from '@angular/router-deprecated';
//
// export function AllowedForRoles(
// 	roles: string[] = [],
// 	canActivate: Function = CanActivate
// ) : ClassDecorator {
// 	return function(component: any) {
// 		const jwt = new JwtHelper();
// 		let token = jwt.decodeToken(localStorage.getItem('auth_token'));
// 		const hasIntersection = intersect(roles, token.role) || !roles || !roles.length;
//
// 		// don't need to add another hook if user is allowed to access route
// 		if (!hasIntersection) {
// 			const canActivateAnnotation = new canActivate(denyNavigation);
// 			let annotations = Reflect.getMetadata('annotations', component) || [];
// 			annotations.push(canActivateAnnotation);
// 			Reflect.defineMetadata('annotations', annotations, component);
// 		}
// 	}
// }
//
// function denyNavigation(next: ComponentDefinition, previous: ComponentDefinition) {
// 	return false;
// }
//
//
// // this should be replaced with some kind of utility function.
// // all it does is check if one of the entries of a exactly matches one of the entries of b
// function intersect(a: string[], b: string[]) : boolean {
//   if (!a || !a.length) return false;
//   if (!b || !b.length) return false;
//
//   const alen = a.length;
//   const blen = b.length;
//
//   let larger = alen > blen ? a : b;
//   let smaller = alen > blen ? b : a;
//   let length = alen > blen ? blen : alen;
//   let hasIntersection = false;
//   let curr;
//
//   while ((curr = smaller[--length]) && !hasIntersection) {
//     hasIntersection = larger.indexOf(curr) !== -1;
//   }
//
//   return hasIntersection;
// }
