import * as path from "jsr:@std/path";
import { readJson, writeJson } from "jsonfile";
import { JSONObject } from "./types.ts";
import { LANG_PATH } from "./_constants.ts";

export async function loadTranslationFiles(): Promise<
    { language: string; json: JSONObject }[]
> {
    try {
        const languages = [];
        for await (const language of Deno.readDir(LANG_PATH)) {
            if (
                language.isFile &&
                language.name.endsWith("json") &&
                !language.name.includes("tmp")
            ) {
                languages.push(language);
            }
        }

        return Promise.all(
            languages.map(async (lang) => {
                const j = (await readJson(
                    path.join(LANG_PATH, lang.name),
                )) as JSONObject;
                return { language: lang.name.split(".")[0], json: j };
            }),
        );
    } catch (e: unknown) {
        return [];
    }
}

export function saveJSON(language: string, content: JSONObject) {
    return writeJson(path.join(LANG_PATH, language + ".json"), content, {
        create: true,
        spaces: 4,
    });
}
