import {
  Injectable, ComponentRef, DynamicComponentLoader, ApplicationRef,
  Inject, Optional, provide, ReflectiveInjector, ViewContainerRef
} from '@angular/core';
import {ToastContainer} from './toast-container.component';
import {ToastOptions} from './toast-options';
import {Toast} from './toast';
import {ViewContainerRef_} from '@angular/core/src/linker/view_container_ref';

@Injectable()
export class ToastsManager {
  container: ComponentRef<any>;
  private options = {
    autoDismiss: true,
    toastLife: 3000,
  };
  private index = 0;

  constructor(private loader: DynamicComponentLoader,
              private appRef: ApplicationRef,
              @Optional() @Inject(ToastOptions) options) {
    if (options) {
      Object.assign(this.options, options);
    }
  }

  show(toast: Toast) {
    if (!this.container) {
      // a hack to get app element in shadow dom
      let appElement: ViewContainerRef = new ViewContainerRef_(this.appRef['_rootComponents'][0]._hostElement);

      let bindings = ReflectiveInjector.resolve([
        provide(ToastOptions, { useValue: <ToastOptions>this.options })
      ]);

      this.loader.loadNextToLocation(ToastContainer, appElement, bindings)
        .then((ref) => {
          this.container = ref;
          this.setupToast(toast);
        });
    } else {
      this.setupToast(toast);
    }
  }

  createTimeout(toastId: number) {
    setTimeout(() => {
      this.clearToast(toastId);
    }, this.options.toastLife);
  }

  setupToast(toast: Toast) {
    toast.id = ++this.index;
    this.container.instance.addToast(toast);
    if (this.options.autoDismiss) {
      this.createTimeout(toast.id);
    }
  }

  clearToast(toastId: number) {
    if (this.container) {
      let instance = this.container.instance;
      instance.removeToast(toastId);
      if (!instance.anyToast()) {
        this.dispose();
      }
    }
  }

  dispose() {
    this.container.destroy();
    this.container = null;
  }

  error(message: string, title?: string) {
    let toast = new Toast('error', message, title);
    this.show(toast);
  }

  info(message: string, title?: string) {
    let toast = new Toast('info', message, title);
    this.show(toast);
  }

  success(message: string, title?: string) {
    let toast = new Toast('success', message, title);
    this.show(toast);
  }

  warning(message: string, title?: string) {
    let toast = new Toast('warning', message, title);
    this.show(toast);
  }
}
