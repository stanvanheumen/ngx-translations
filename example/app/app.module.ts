import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxStorageModule} from '@stanvanheumen/ngx-storage';
import {NgxTranslationsModule} from '../../library/src/translations.module';

import {AppComponent} from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NgxStorageModule.forRoot(),
        NgxTranslationsModule.forRoot({
            production: false,
            dictionary: [
                {
                    languages: ['nl-NL', 'nl'],
                    name: 'Dutch (Dutch)',
                    data: {
                        'Dutch (Dutch)': 'Nederlands (Nederlands)',
                        'German (German)': 'Duits (Duits)',
                        'English (English)': 'Engels (Engels)',
                        'Hello ${item}!': 'Hallo ${item|uppercase}!',
                        'World': 'Wereld'
                    }
                },
                {
                    languages: ['de-DE', 'de'],
                    name: 'German (German)',
                    data: {
                        'Dutch (Dutch)': 'Niederländisch (Niederländisch)',
                        'German (German)': 'Deutsch (Deutsch)',
                        'English (English)': 'Englisch (Englisch)',
                        'Hello ${item}!': 'Hallo ${item|uppercase}!',
                        'World': 'Welt'
                    }
                }
            ]
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
