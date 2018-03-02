import {TranslationExtras, TranslationsConfig} from './translations.config';
import {StorageService} from '@stanvanheumen/ngx-storage';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable, Optional} from '@angular/core';

@Injectable()
export class TranslationsService {

    // The token used in the storage.
    private readonly storageToken = '__NGX_CURRENT_LANGUAGE__';

    // The available languages.
    private readonly dictionary = [];

    // The default dictionary.
    private readonly defaultDictionary = [{languages: ['en-US', 'en'], data: null, name: 'English (English)'}];

    // The current language.
    private currentLanguage$ = new BehaviorSubject<string>(null);

    constructor(@Optional() private storage: StorageService,
                @Optional() private config: TranslationsConfig) {
        // Retrieve the dictionary from the config.
        if (!this.config) {
            this.config = {production: false, dictionary: []};
        }

        // Append the dictionary to the default dictionary.
        this.dictionary = this.config.dictionary.concat(
            this.defaultDictionary
        );

        // Check if the languages are all correct if the application is not in production mode.
        if (!config.production && !this.validate()) {
            console.warn('The language files have been compared and they have not passed the validation.');
        }

        // If the storage is enabled than retrieve the current language; else us an empty behavior subject.
        const language$ = this.storage ?
            this.storage.get<string>(this.storageToken) as BehaviorSubject<string>
            : new BehaviorSubject<string>(null);
        const language = language$.getValue();

        // Verify the language.
        const verifiedLanguage = this.verify(language);

        // Use the verified language.
        this.use(verifiedLanguage);
    }

    use(language: string) {
        // Check if the language is supported; if not set the default language and warn the user.
        if (!this.isLanguageSupported(language)) {
            language = this.defaultDictionary[0].languages[0];
            console.warn(
                `The language is not supported; The language has been set to '${language}'`
            );
        }

        // Submit a new language.
        this.currentLanguage$.next(language);

        // Save the new language in the storage if the storage exists.
        if (this.storage) {
            this.storage.set<string>(this.storageToken, language);
        }
    }

    instant(token: string, data: TranslationExtras = {}) {
        return this.translate(token, data);
    }

    translate(token: string, data: TranslationExtras = {}) {
        // Retrieve the entire dictionary object.
        const dictionary = this.getLanguageDictionary(this.currentLanguage$.getValue());

        // Get the sentence.
        let sentence = null;

        // Check if the dictionary exists.
        if (dictionary) {
            if (!dictionary[token]) {
                // The key does not exist in the dictionary, so the user must be notified.
                this.notify(`Key '${token}' was not found; ${token} was returned.`);
                sentence = token;
            } else {
                // The key does exist, so return it.
                sentence = dictionary[token];
            }
        } else {
            // The language is the default.
            sentence = token;
        }

        // Loop through each match to replace it with the supplied value.
        (sentence.match(/\${(.*?)}/g) || []).forEach(match => {
            // Get the key without any other symbols.
            const key = match.replace(/[${} ]/g, '');

            // Split the key on the pipe symbol to get the other arguments.
            const words = key.split('|');
            if (words.length <= 0 || words.length > 2) {
                return;
            }

            // Get the key.
            let word = words[0];

            // Check if it should be translated (default is yes).
            if (data[word]) {
                word = data[word];

                if (words[1] && words[1].split(',').indexOf('keep') === -1) {
                    word = this.translate(word);
                }
            }

            // Do the other attributes.
            if (words.length === 2) {
                const actions = words[1].split(',');

                actions.forEach(action => {
                    if (action === 'lowercase') {
                        word = word.toLowerCase();
                    } else if (action === 'uppercase') {
                        word = word.toUpperCase();
                    } else if (action === 'ucfirst') {
                        const character = word.charAt(0).toUpperCase();
                        word = character + word.substr(1);
                    }
                });
            }

            sentence = sentence.replace(match, word);
        });

        return sentence;
    }

    getLanguage() {
        return this.currentLanguage$.getValue();
    }

    getDictionary() {
        return this.dictionary;
    }

    private verify(language: string) {
        // Check if the language already exists.
        if (language !== null && this.isLanguageSupported(language)) {
            return language;
        }

        // Fetch the browser language.
        let browserLanguage = this.getBrowserLanguage();

        // Check if the browsers language is supported in the system.
        if (!this.isLanguageSupported(browserLanguage)) {
            browserLanguage = this.defaultDictionary[0].languages[0];
        }

        // If the browser language was not supported put one in the storage.
        if (this.storage) {
            this.storage.set<string>(this.storageToken, browserLanguage);
        }

        // Return the browser language.
        return browserLanguage;
    }

    private getBrowserLanguage() {
        let language = null;

        // Check if the navigator exists.
        if (!navigator) {
            return language;
        }

        // Get the correct first language of the browser.
        if (navigator.languages && navigator.languages.length) {
            language = navigator.languages[0];
        } else if (navigator['userLanguage']) {
            language = navigator['userLanguage'];
        } else {
            language = navigator.language;
        }

        return language;
    }

    private getLanguageDictionary(language: string) {
        for (let item of this.dictionary) {
            if (item.languages.indexOf(language) > -1) {
                return item.data;
            }
        }

        return null;
    }

    private isLanguageSupported(language: string) {
        for (let item of this.dictionary) {
            if (item.languages.indexOf(language) > -1) {
                return true;
            }
        }

        return false;
    }

    private validate() {
        const array = [];

        this.dictionary.forEach(language => {
            if (!language.data) {
                return;
            }

            const data = this.getKeys(language.data);
            array.push(data);
        });

        const first = array[0] || [];

        return array.every(element => this.compare(first, element));
    }

    private getKeys(object: object, identifier: string = null) {
        const result = [];

        Object.keys(object).forEach(key => {
            const item = object[key];

            if (typeof item === 'object') {
                result.push(...this.getKeys(item, identifier ? (identifier + '.' + key) : key));
            } else {
                result.push(identifier ? (identifier + '.' + key) : key);
            }
        });

        return result;
    }

    private compare(first: string[], second: string[]) {
        if (first === second) {
            return true;
        }

        if (first === null || second === null) {
            return false;
        }

        let isValid = true;

        if (first.length !== second.length) {
            console.warn('The files have been compared and not every file has the same length.');
            isValid = false;
        }

        for (let index = 0; index < first.length; ++index) {
            if (first[index] !== second[index]) {
                isValid = false;
                console.warn(`Line ${index} did not equal the first language.json file; ${first[index]} !== ${second[index]}`);
            }
        }

        return isValid;
    }

    private notify(message: string) {
        if (this.config && this.config.production) {
            console.warn(message);
            return;
        }
        throw new Error(message);
    }

}
