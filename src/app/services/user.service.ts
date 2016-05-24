import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

@Injectable()
export class UserService {
    public loggedIn:boolean = false;
    private host:string = 'localhost:54832';

    constructor(private http:Http,
                private router:Router) {
        this.loggedIn = true;//!!localStorage.getItem('auth_token');
    }

    login(username:string, password:string) {
        return;   
        // let headers = new Headers();
        // headers.append('Content-Type', 'application/x-www-form-urlencoded');
        // let body = "grant_type=password&username=" + username + "&password=" + password;
        //
        // return this.http.post(
        //     `http://${ this.host }/oauth/token`,
        //     body,
        //     {headers}
        // )
        //     .subscribe(res => {
        //         localStorage.setItem('auth_token', res.json().access_token);
        //         this.loggedIn = true;
        //         this.router.navigate(['/app']);
        //     }, err => {
        //         console.error(err);
        //         this.logout();
        //     });
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.loggedIn = false;
        this.router.navigate(['/login']);
    }
}
