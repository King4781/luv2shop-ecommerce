import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class Luv2ShopValidators {

    static notOnlyWhitespace(control: FormControl): ValidationErrors|null {
       
        if (typeof control.value === "string") {

            if (control.value && (control.value.trim().length == 0)) {
                return { "notOnlyWhitespace": true };
            }

        }

        else {

            if (control.value === null) {
                return { "notOnlyWhitespace": true };
            }

        }
        
        return null;
    }

    static notOnlyWhitespaceWithOneLetter(control: FormControl): ValidationErrors|null {
        
        if (control.value.trim().length === 1) {
            return { "notOnlyWhitespaceWithOneLetter": true };
        }

        return null;
    }

    static notOnlyWhitespaceMultipleCharacters(max: number): ValidatorFn {

        return (control: AbstractControl): {[key: string]: any} | null => {

            if (control.value.trim().length !== max) {
                return { "notOnlyWhitespaceMultipleCharacters": true };
            }
    
            return null;

        }
        
    }

}
