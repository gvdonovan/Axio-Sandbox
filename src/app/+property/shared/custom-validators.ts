import {Control} from '@angular/common';

export interface ValidationResult {
    [key: string]: boolean;
}

export class CommonValidator {
    static ZipcodeField(control: Control): ValidationResult {
        let ZIPCODE_REGEX = /^\d{5}(?:[-\s]\d{4})?$/i;

        if (control.value) {
            if (!ZIPCODE_REGEX.test(control.value)) {
                return {
                    invalidZipcode : true
                };
            }
        }

        return null;
    }
}

export class SearchFormValidator {

    static StartField(startField: Control, endField: Control): ValidationResult {
        if (endField && endField.value && startField.value) {
            if (Number(startField.value) > Number(endField.value)) {
                return { invalidStartValue : true};
            }
        }

        return null;
    }

    static EndField(startField: Control, endField: Control): ValidationResult {
        if (startField && startField.value && endField.value) {
            if (Number(endField.value) < Number(startField.value)) {
                return { invalidEndValue : true};
            }
        }

        return null;
    }

}