import { Toast } from './toast';
export declare class ToastContainer {
    position: string;
    messageClass: string;
    titleClass: string;
    positionClass: string;
    toasts: Toast[];
    maxShown: number;
    autoDismiss: boolean;
    constructor(options: any);
    addToast(toast: Toast): void;
    removeToast(toastId: number): void;
    dismiss(toast: any): void;
    anyToast(): boolean;
    findToast(toastId: number): Toast;
}
