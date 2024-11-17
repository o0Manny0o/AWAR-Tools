import { Handlers, PageProps } from "$fresh/server.ts";
import * as path from "jsr:@std/path";
import { readJson } from "jsonfile";
import SidebarLayout from "../islands/SidebarLayout.tsx";
import { TranslationFile } from "../shared/types.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        const langPath = path.join(Deno.cwd(), "../../../lang");
        try {
            const languages = [];
            for await (const language of Deno.readDir(langPath)) {
                if (language.isFile && language.name.endsWith("json")) {
                    languages.push(language);
                }
            }

            const json = await Promise.all(
                languages.map(async (lang) => {
                    const j = await readJson(path.join(langPath, lang.name));
                    return { language: lang.name.split(".")[0], json: j };
                }),
            );

            return ctx.render(json);
        } catch (e: unknown) {
            return ctx.renderNotFound({
                message: `Error loading language files ${
                    e instanceof Error ? e.message : e
                }`,
            });
        }
    },
};

export default function Home({ data }: PageProps<TranslationFile[]>) {
    return <SidebarLayout languageFiles={data}></SidebarLayout>;
}
