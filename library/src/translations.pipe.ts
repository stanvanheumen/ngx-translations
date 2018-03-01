import {TranslationsService} from './translations.service';
import {TranslationExtras} from './translations.config';
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'translate',
    pure: false
})
export class NgxTranslationsPipe implements PipeTransform {

    constructor(private translate: TranslationsService) {
    }

    transform(value: string, args: TranslationExtras = {}) {
        if (!value) {
            return null;
        }

        if (typeof args !== 'object') {
            throw new Error('The arguments were not formatted properly.');
        }

        return this.translate.instant(value, args);
    }

}
