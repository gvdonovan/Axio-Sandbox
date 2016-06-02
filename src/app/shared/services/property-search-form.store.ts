
import {ReplaySubject,BehaviorSubject} from "rxjs/Rx";
import {Injectable} from "@angular/core";

@Injectable()
export class PropertySearchFormStore {
    private stateSource: ReplaySubject<Object> = new ReplaySubject(1);
    states$ = this.stateSource.asObservable();

    saveState(state: Object) {
        this.stateSource.next(state);
    }
}