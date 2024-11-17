import { JSONObject, LanguageKeys } from "./types.ts";
import { set } from "lodash";

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
