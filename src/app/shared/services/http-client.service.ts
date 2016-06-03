import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from 'rxjs/Rx';
import {ToastsManager} from '../../../vendor/ng2-toastr/src/toast-manager';

@Injectable()
export class HttpClient {

    constructor(
        public http: Http,
        public toastr: ToastsManager
    ) {}

    get(url) {
        return this.http.get(url).catch((error: any) => {
            this.toastr.error('There is an error occurred. Please try again later.');

            let errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.error(errMsg); // log to console instead


            return Observable.throw(errMsg);
        })
    }

    post(url: string, data: string) {
        return this.http.post(url,data)
            .catch((error: any) => {
                this.toastr.error('There is an error occurred. Please try again later.');

                let errMsg = (error.message) ? error.message :
                    error.status ? `${error.status} - ${error.statusText}` : 'Server error';
                console.error(errMsg); // log to console instead
                
                return Observable.throw(errMsg);
            })

    }

    put(url: string, data: string) {
        return this.http.put(url,data)
            .map(
                res => {
                    this.toastr.success('The data has been updated successfully!');
                    return res.json();
                })
            .catch((error: any) => {
            this.toastr.error('There is an error occurred. Please try again later.');

            let errMsg = (error.message) ? error.message :
                error.status ? `${error.status} - ${error.statusText}` : 'Server error';
            console.error(errMsg); // log to console instead


            return Observable.throw(errMsg);
        })
    }


    private handleError (error: any) {
        this.toastr.error('There is an error occurred. Please try again later.');

        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console instead


        return Observable.throw(errMsg);
    }
}
