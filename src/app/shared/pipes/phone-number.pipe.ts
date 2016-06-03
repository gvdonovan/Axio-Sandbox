import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'phoneNumber',
    pure: false
})
export class PhoneNumberPipe implements PipeTransform {
    transform(value: string, args: any): any {

        let PHONE_NUMBER_REGEX = /^(\d{3})(\d{3})(\d{4})$/;

        if(value && value.length === 10) {
            let matches = value.match(PHONE_NUMBER_REGEX);

            if(matches) {
                return "(" + matches[1] + ")" + matches[2] + "-" + matches[3];
            }

            return;
        }

        return;
    }
}
