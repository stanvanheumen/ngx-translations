# `ngx-translations`
A simple library that allows you use multiple languages in your Angular 5+ app.

- Use <kbd>command</kbd> + <kbd>F</kbd> or <kbd>ctrl</kbd> + <kbd>F</kbd> to search for a keyword.
- Contributions welcome, please see [contribution guide](.github/CONTRIBUTING.md).

## Features

- :camel: **Easy implementation**
- :mouse: **Lazy loading compatible**
- :sheep: **Angular Universal compatible**
- :bird: **Ahead-Of-Time compilation compatible**

## Demo

[Click here to play with the example!](https://stackblitz.com/github/stanvanheumen/ngx-translations)

## Installation

To use ngx-translations in your project install it via `npm` or `yarn`:

```bash
$ npm install @stanvanheumen/ngx-translations --save

# or

$ yarn add @stanvanheumen/ngx-translations
```

## Setup

Add the `NgxTranslationsModule` to your imports array in your `CoreModule`. 
To receive the provider call the `forRoot()` method.

```typescript
import {NgxStorageModule} from '@stanvanheumen/ngx-storage';
import {NgxTranslationsModule} from '@stanvanheumen/ngx-translations';

@NgModule({
  imports: [
      NgxStorageModule.forRoot(), // Optional
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
  ]
})
export class AppModule {}
```

## Usage

```typescript
import {Component} from '@angular/core';
import {TranslationsService, Translation} from '@stanvanheumen/ngx-translations';

@Component({
    selector: 'app-root',
    template: `
        <div>
            {{ 'Hello ${item}!' | translate:{item: 'World'} }}
        </div>
        
        <select [(ngModel)]="currentLanguage" (ngModelChange)="onLanguageChange($event)">
            <option *ngFor="let language of languages" [value]="language.languages[0]">
                {{ language.name | translate }}
            </option>
        </select>
    `
})
export class AppComponent {
    
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
    }
    
}
```
