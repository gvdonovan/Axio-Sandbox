Angular 2: Toastr
===================

NOTE: Since there are breaking changes in Angular 2 beta 16. Please reference latest version of ng2-toastr. 
If you are using Angular 2 beta 15 or below, please reference ng2-toastr version '0.1.8'.

The project is in progress since it's built with Angular 2 Beta. 

The lib is inspired by [angular-toastr] (https://github.com/Foxandxss/angular-toastr), and will show bootstrap-like toasts. 
Please update Angular 2 to version 2.0.0-beta.16 to avoid any unexpected issues.

![Examples](toastr-examples.jpg?raw=true "Bootstrap Toasts")

## Usage

1. Install ng2-toastr using npm:

    ``` npm install ng2-toastr --save ```

2. Include js and css files in html header
    
    ```
    <link href="node_modules/ng2-toastr/bundles/ng2-toastr.min.css" rel="stylesheet" />
    <script src="node_modules/ng2-toastr/bundles/ng2-toastr.min.js"></script>
    
    ```

3. Use Angular Dependency Inject 'ToastsManager' class

```javascript
    import { ToastsManager } from 'ng2-toastr/ng2-toastr';
    
    @Component({
      selector: 'awesome-component',
      template: '<button class="btn btn-default" (click)="showSuccess()">Toastr Tester</button>',
      providers: [ToastsManager]
    })
    export class AppComponent {
    
      constructor(public toastr: ToastsManager) {
      }
        
      showSuccess() {
        this.toastr.success('You are awesome!', 'Success!');
      }
    
      showError() {
        this.toastr.error('This is not good!', 'Oops!');
      }
    
      showWarning() {
        this.toastr.warning('You are being warned.', 'Alert!');
      }
    
      showInfo() {
        this.toastr.info('Just some information for you.');
      }
    }
```


### ToastOptions Configurations

By default, the toastr will show up at top right corner of the page view, and will automatically dismiss in 3 seconds. 
You can configure the toasts using ToastOptions class. Currently we support following options:

#####toastLife: (number)
Determines how long an auto-dismissed toast will be shown. Defaults to 3000 miliseconds.
 
#####autoDismiss: (boolean)
Determines whether toast should dismiss itself. If false, the toast will be dismissed when user tap on toast. Defaults to true.

#####maxShown: (number)
Determines maximum number of toasts can be shown on the page in the same time. Defaults to 5.

#####positionClass: (string)
Determines where on the page the toasts should be shown. Here are list of values: 
* toast-top-right (Default)
* toast-top-center
* toast-top-left
* toast-top-full-width
* toast-bottom-right
* toast-bottom-center
* toast-bottom-left
* toast-bottom-full-width

#####messageClass: (string)
CSS class for message within toast.

#####titleClass: (string)
CSS class for title within toast.

Use Angular 2 dependency inject for custom configurations. Here is code when you bootstrap your app:

```javascript
    import {provide} from 'angular2/core';
    import {ToastOptions} from "ng2-toastr/ng2-toastr";
    
    let options = {
      autoDismiss: false,
      positionClass: 'toast-bottom-right',
    };
    
    bootstrap(AppComponent, [
      ... ,   
      provide(ToastOptions, { useValue: new ToastOptions(options)}),
    ]);

```


## TODOs

### Animation
No animation so far for toasts showing and disappearing. Wait until Angular 2 Animation Api is finalized.

