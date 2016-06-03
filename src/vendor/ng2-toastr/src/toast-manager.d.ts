import { ComponentRef, DynamicComponentLoader, ApplicationRef } from '@angular/core';
import { Toast } from './toast';
export declare class ToastsManager {
    private loader;
    private appRef;
    container: ComponentRef<any>;
    private options;
    private index;
    constructor(loader: DynamicComponentLoader, appRef: ApplicationRef, options: any);
    show(toast: Toast): void;
    createTimeout(toastId: number): void;
    setupToast(toast: Toast): void;
    clearToast(toastId: number): void;
    dispose(): void;
    error(message: string, title?: string): void;
    info(message: string, title?: string): void;
    success(message: string, title?: string): void;
    warning(message: string, title?: string): void;
}
