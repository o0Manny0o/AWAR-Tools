export type JSONValue = string | JSONObject;

export interface JSONObject {
    [key: string]: JSONValue;
}

export interface TranslationFile {
    language: LanguageKeys;
    json: JSONObject;
}

export enum LanguageKeys {
    ENGLISH = "en",
    GERMAN = "de",
}
