import { Handlers, PageProps } from "$fresh/server.ts";
import * as path from "jsr:@std/path";
import { writeJsonSync } from "jsonfile";
import SidebarLayout from "../islands/SidebarLayout.tsx";
import { LanguageKeys, TranslationFile } from "../shared/types.ts";
import { loadTranslationFiles } from "../shared/loader.ts";
import { formDataToObject, updateTypes } from "../shared/util.ts";

const LANG_PATH = path.join(Deno.cwd(), "../../../lang");
const TYPE_PATH = path.join(
    Deno.cwd(),
    "../../../resources/js/types/translations.d.ts",
);

export const handler: Handlers = {
    async GET(_req, ctx) {
        const json = await loadTranslationFiles();
        return ctx.render(json);
    },
    async POST(req, ctx) {
        const translations = formDataToObject(await req.formData());

        try {
            translations.forEach(([lang, value]) =>
                writeJsonSync(path.join(LANG_PATH, lang + ".json"), value, {
                    create: true,
                    spaces: 4,
                }),
            );
        } catch (e) {
            console.log(e);
            return new Response(
                JSON.stringify({ message: "Writing translation files failed" }),
                {
                    status: 500,
                    headers: {
                        "Content-Type": "application/json",
                    },
                },
            );
        }

        const defaultLang = translations.find(
            ([lang]) => lang === LanguageKeys.ENGLISH,
        )?.[1];
        if (defaultLang) {
            updateTypes(defaultLang, TYPE_PATH);
        }

        return new Response(
            JSON.stringify({
                message: "Translations saved",
                translations: translations.map(([language, json]) => ({
                    language,
                    json,
                })),
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json",
                },
            },
        );
    },
};

export default function Home({ data }: PageProps<TranslationFile[]>) {
    return <SidebarLayout languageFiles={data}></SidebarLayout>;
}
