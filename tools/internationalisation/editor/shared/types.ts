export type JSONValue = string | JSONObject;

export interface JSONObject {
    [key: string]: JSONValue;
}

export interface TranslationFile {
    language: string;
    json: JSONObject;
}
