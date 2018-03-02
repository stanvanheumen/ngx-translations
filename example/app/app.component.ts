import {TranslationsService} from '../../library/src/translations.service';
import {Translation} from '../../library/src/translations.config';
import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    languages: Translation[];
    currentLanguage: string;

    constructor(private translate: TranslationsService) {
    }

    ngOnInit() {
        this.currentLanguage = this.translate.getLanguage();
        this.languages = this.translate.getDictionary();
    }

    onLanguageChange(value) {
        this.translate.use(value);
        if (window && window.location) {
            window.location.reload();
        }
    }

}
