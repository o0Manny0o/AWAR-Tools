import {JSONObject, LanguageKeys, TranslationType} from "./types.ts";
import {capitalize, countBy, entries, flow, groupBy, head, last, maxBy, partialRight, set, sortBy,} from "lodash";

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
    const { replaceMap, combined } = _combineObjects(types);
    const typeString = _translationTypesToString(combined, replaceMap);

    Deno.writeTextFileSync(path, typeString);
}

function _generateTypes(
    json: JSONObject,
    parent?: string,
    current = "translations",
): TranslationType[] {
    const generateProperties = (json: JSONObject) => {
        return Object.entries(json).map(([key, value]) => ({
            key: key as string,
            value: typeof value === "string"
                ? "string"
                : capitalize(current) + "_" + capitalize(key),
        }));
    };

    const type = {
        key: (parent ? capitalize(parent) + "_" : "") +
            capitalize(current) as string,
        properties: generateProperties(json),
    };

    return [
        type,
        ...Object.entries(json)
            .filter(([_key, value]) => typeof value === "object")
            .map(([key, value]) =>
                _generateTypes(value as JSONObject, current, key)
            )
            .flat(),
    ];
}

function _combineObjects(data: TranslationType[]) {
    const grouped: { [props: string]: TranslationType[] } = groupBy(
        data,
        (item: TranslationType) =>
            JSON.stringify(sortBy(item.properties, ["key"])),
    );
    const replaceMap = new Map<string, string>();
    const combined = Object.values(grouped).map((group) => {
        let groupKey = "";
        if (group.length === 1) {
            groupKey = group[0].key;
        } else if (group.length > 5) {
            const parentKeys = group.map((item) => {
                const [parent] = item.key.split("_");
                return parent;
            });
            groupKey = flow(
                countBy,
                entries,
                partialRight(maxBy, last),
                head,
            )(parentKeys) + "_Set";
        } else {
            groupKey = group.map((item) => {
                const [, ...keys] = item.key.split("_");
                return keys.join("_");
            }).join("Or");
        }
        group.forEach((g) => {
            replaceMap.set(g.key, groupKey);
        });
        return {
            key: groupKey,
            properties: group[0].properties,
        };
    });
    return { replaceMap, combined };
}

function _translationTypesToString(
    types: TranslationType[],
    replaceMap: Map<string, string>,
) {
    return types
        .map((type) => {
            return `type ${type.key} = {\n${
                type.properties
                    .map(
                        (property) =>
                            `    ${property.key}: ${
                                replaceMap.get(property.value) ?? property.value
                            };`,
                    )
                    .join("\n")
            }\n};`;
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
