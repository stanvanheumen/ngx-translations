import {Optional, Pipe, PipeTransform} from '@angular/core';
import {TranslationsService} from './translations.service';
import {TranslationExtras} from './translations.config';

@Pipe({
    name: 'translate',
    pure: false
})
export class NgxTranslationsPipe implements PipeTransform {

    constructor(@Optional() private translate: TranslationsService) {
    }

    transform(value: string, args: TranslationExtras = {}) {
        // Check if the service was actually properly installed; if not return the value.
        if (!this.translate) {
            return value;
        }

        // If the value was not received properly return null.
        if (!value) {
            return null;
        }

        // Check if the arguments were formatted properly.
        if (typeof args !== 'object') {
            throw new Error('The arguments were not formatted properly.');
        }

        // Translate the value.
        return this.translate.instant(value, args);
    }

}
