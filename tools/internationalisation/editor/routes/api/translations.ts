import { Handlers } from "$fresh/server.ts";
import { loadTranslationFiles, saveJSON } from "../../shared/loader.ts";
import { has, set, unset } from "lodash";

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
            const defaultLang = languages.find((l) => l.language == "en");
            if (!defaultLang) {
                return new Response(`Default language not found`, {
                    status: 404,
                });
            }
            set(defaultLang.json, key, key);
            try {
                saveJSON("en", defaultLang.json);
                return new Response(JSON.stringify(defaultLang.json));
            } catch (e) {
                return new Response(`Writing json file failed`, {
                    status: 500,
                });
            }
        }
        return new Response(`This key already exists`, { status: 400 });
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
        const defaultLang = languages.find((l) => l.language == "en");
        if (!defaultLang) {
            return new Response(`Default language not found`, {
                status: 404,
            });
        }
        unset(defaultLang.json, key, key);
        try {
            saveJSON("en", defaultLang.json);
            return new Response(JSON.stringify(defaultLang.json));
        } catch (e) {
            return new Response(`Writing json file failed`, {
                status: 500,
            });
        }
    },
    // async PATCH(req, ctx) {
    //     const form = await req.formData();
    //
    //     const id = ctx.params.id;
    //     const user = (await req.json()) as User;
    //     const userKey = ["user", id];
    //     const userRes = await kv.get(userKey);
    //     if (!userRes.value) return new Response(`no user with id ${id} found`);
    //     const ok = await kv.atomic().check(userRes).set(userKey, user).commit();
    //     if (!ok) throw new Error("Something went wrong.");
    //     return new Response(JSON.stringify(user));
    // },
};
