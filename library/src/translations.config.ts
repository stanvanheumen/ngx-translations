export class TranslationsConfig {
    production: boolean = false;
    dictionary: Dictionary[] = [];
}

export interface Dictionary {

    /**
     * The browser languages that should activate this data set.
     */
    languages: string[];

    /**
     * The data JSON.
     */
    data: object;

    /**
     * The name of the translation.
     */
    name: string;

}

export interface Translation {

    /**
     * The token of the translation.
     */
    token: string;

    /**
     * The key-value extras.
     */
    data: TranslationExtras;

}

export interface TranslationExtras {

    /**
     * The key-value extras.
     */
    [token: string]: string;

}