import { JSONObject } from "./types.ts";
import { set } from "lodash";

export function formDataToObject(formData: FormData) {
    return [
        ...[...formData].reduce(
            (agg, [langKey, value]) => {
                if (value) {
                    const [lang, ...key] = langKey.split("-");
                    const translations = agg.get(lang)!;
                    set(translations, key.join("-"), value);
                    agg.set(lang, translations);
                }
                return agg;
            },
            new Map<string, JSONObject>([
                ["en", {}],
                ["de", {}],
            ]),
        ),
    ];
}
