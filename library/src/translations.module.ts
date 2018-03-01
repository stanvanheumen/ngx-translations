import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgxStorageModule} from '@stanvanheumen/ngx-storage';

import {TranslationsService} from './translations.service';
import {NgxTranslationsPipe} from './translations.pipe';
import {TranslationsConfig} from './translations.config';

@NgModule({
    imports: [CommonModule, NgxStorageModule],
    providers: [TranslationsService],
    declarations: [NgxTranslationsPipe],
    exports: [NgxTranslationsPipe]
})
export class NgxTranslationsModule {

    static forRoot(config: TranslationsConfig = {production: false, dictionary: []}) {
        return {
            ngModule: NgxTranslationsModule,
            providers: [
                {provide: TranslationsConfig, useValue: config}
            ]
        };
    }

}
