import {JSONObject, LanguageKeys, TranslationType} from "./types.ts";
import {set} from "lodash";

export function formDataToObject(
    formData: FormData,
): [LanguageKeys, JSONObject][] {
    return [
        ...[...formData].reduce(
            (agg, [langKey, value]) => {
                if (value) {
                    const [lang, ...key] = langKey.split("-");
                    const translations = agg.get(lang as LanguageKeys)!;
                    set(translations, key.join("-"), value);
                    agg.set(lang as LanguageKeys, translations);
                }
                return agg;
            },
            new Map<LanguageKeys, JSONObject>([
                [LanguageKeys.ENGLISH, {}],
                [LanguageKeys.GERMAN, {}],
            ]),
        ),
    ];
}

export function updateTypes(json: JSONObject, path: string) {
    const types = _generateTypes(json);
    const typeString = `type Translations = {\n${_translationTypesToString(types)}\n}`;

    Deno.writeTextFileSync(path, typeString);
}

function _generateTypes(json: JSONObject): TranslationType[] {
    return Object.entries(json).map(([key, value]) => ({
        key: key as string,
        value: typeof value === "string"
            ? "string"
            : _generateTypes(value as JSONObject),
    }));
}

function _translationTypesToString(
    types: TranslationType[],
) {
    const asChildProperties = (types: TranslationType[]): string => {
        return `{\n${_translationTypesToString(types)}\n}`
    }
    return types
        .map((type) => {
            return `${type.key}: ${typeof type.value === "string" ? "string" : asChildProperties(type.value) }`
        })
        .join("\n");
}

export function correctKey(key: string, trim = false) {
    key = key
        .replace(/-(\w)/g, (_, char) => char.toUpperCase())
        .replace(/-\./g, ".");
    if (trim) {
        key = key.replace(/^-|-$/g, "");
    }
    return key;
}

export function validateKey(key: string): string | null {
    if (key.split(".").length > 10) {
        return "Key too deep";
    }

    if (key.includes("_set")) {
        return `Cannot use reserved key "_set"`;
    }

    return null;
}
