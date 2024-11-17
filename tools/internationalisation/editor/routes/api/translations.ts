import { Handlers } from "$fresh/server.ts";
import { loadTranslationFiles, saveJSON } from "../../shared/loader.ts";
import { get, has, isObject, set, unset } from "lodash";
import { LanguageKeys } from "../../shared/types.ts";

export const handler: Handlers = {
    async POST(req, ctx) {
        const requestData = await req.json();
        if (!requestData.key) {
            return new Response(`No Key provided`, {
                status: 400,
            });
        }
        const key = requestData.key.toLowerCase();

        const languages = await loadTranslationFiles();

        if (languages.every((l) => !has(l.json, key))) {
            const defaultLang = languages.find(
                (l) => l.language == LanguageKeys.ENGLISH,
            );
            if (!defaultLang) {
                return new Response(`Default language not found`, {
                    status: 404,
                });
            }
            set(defaultLang.json, key, key);
            try {
                saveJSON(LanguageKeys.ENGLISH, defaultLang.json);
                return new Response(JSON.stringify(defaultLang.json));
            } catch (e) {
                return new Response(`Writing json file failed`, {
                    status: 500,
                });
            }
        }
        return new Response(`This key already exists`, { status: 400 });
    },
    async PATCH(req, ctx) {
        const requestData = await req.json();
        if (!requestData.key || !requestData.oldKey) {
            return new Response(`No Keys provided`, {
                status: 400,
            });
        }
        const oldKey = requestData.oldKey.toLowerCase();
        const key = requestData.key.toLowerCase();

        const languages = await loadTranslationFiles();

        if (languages.some(({ json }) => has(json, key))) {
            return new Response(`Key already exists`, {
                status: 400,
            });
        }

        const canMove = languages.every(({ json }) => {
            const parents = key.split(".");
            parents.pop();
            let currentKey;
            while (parents.length) {
                currentKey = currentKey
                    ? currentKey + "." + parents.shift()
                    : parents.shift();
                const existing = get(json, currentKey);
                if (existing && !isObject(existing)) {
                    return false;
                }
            }
            return true;
        });

        if (!canMove) {
            return new Response(`Edit would overwrite values`, {
                status: 400,
            });
        }

        const affectedLanguages = languages.filter((l) => has(l.json, oldKey));
        if (affectedLanguages.length) {
            for (const { language, json } of affectedLanguages) {
                const value = get(json, oldKey);
                set(json, key, value);
                unset(json, oldKey);
                try {
                    await saveJSON(language, json);
                } catch (e) {
                    return new Response(`Writing json file failed`, {
                        status: 500,
                    });
                }
            }
            return new Response(JSON.stringify(affectedLanguages));
        }
        return new Response(`Key could not be found`, { status: 404 });
    },
    async DELETE(req, ctx) {
        const requestData = await req.json();
        if (!requestData.key) {
            return new Response(`No Key provided`, {
                status: 400,
            });
        }
        const key = requestData.key.toLowerCase();

        const languages = await loadTranslationFiles();
        const affectedLanguages = languages.filter((l) => has(l.json, key));
        if (affectedLanguages.length) {
            for (const { language, json } of affectedLanguages) {
                unset(json, key, key);
                try {
                    saveJSON(language, json);
                } catch (e) {
                    return new Response(`Writing json file failed`, {
                        status: 500,
                    });
                }
            }
            return new Response(JSON.stringify(affectedLanguages));
        }
        return new Response(`Key could not be found`, { status: 404 });
    },
};
