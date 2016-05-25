import {Injectable} from '@angular/core';
import {Http, Headers} from '@angular/http';
import {Router} from '@angular/router';

@Injectable()
export class UserService {
    private host:string = 'localhost:54832';

    constructor(private http:Http,
                private router:Router) {
    }

    get loggedIn() {
        return !!localStorage.getItem('auth_token');
    }

    login(username:string, password:string) {
        let headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        let body = "grant_type=password&username=" + username + "&password=" + password;
        
        return this.http.post(
            `http://${ this.host }/oauth/token`,
            body,
            {headers}
        )
            .subscribe(res => {
                localStorage.setItem('auth_token', res.json().access_token);
                this.router.navigate(['/app']);
            }, err => {
                console.error(err);
                this.logout();
            });
    }

    logout() {
        localStorage.removeItem('auth_token');
        this.router.navigate(['/login']);
    }
}
