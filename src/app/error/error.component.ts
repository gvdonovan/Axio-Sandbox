import {Component} from '@angular/core';
import {Router} from '@angular/router-deprecated';

@Component({
  selector: '[error]',
  host: {
    class: 'error-page app'
  },
  template: require('./error.component.html')
})
export class ErrorComponent {
router: Router;

  constructor(router: Router) {
    this.router = router;
  }

  searchResult(): void {
    this.router.navigate(['/App', 'Dashboard']);
  }

}
