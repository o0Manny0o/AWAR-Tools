import { Handlers, PageProps } from "$fresh/server.ts";
import * as path from "jsr:@std/path";
import { readJson } from "jsonfile";
import { Input } from "../components/Input.tsx";
import SidebarLayout from "../islands/SidebarLayout.tsx";

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
                    return { name: lang.name.split(".")[0], json: j };
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

type JSONValue = string | number | boolean | JSONObject;

interface JSONObject {
    [key: string]: JSONValue;
}

export default function Home({
    data,
}: PageProps<{ name: string; json: JSONObject }[]>) {
    const defaultLang = data.find((l) => l.name === "en");
    if (!defaultLang) {
        return <p>English Language file not found</p>;
    }

    const renderJsonAsInputs = (json: JSONObject, parents?: string[]) => {
        return Object.entries(json).map(([key, value]) => {
            if (typeof value === "string") {
                return (
                    <fieldset>
                        <legend>
                            <Input value={key} />
                        </legend>
                        <Input value={value} />
                    </fieldset>
                );
            } else if (typeof value === "object") {
                return (
                    <fieldset>
                        <legend>
                            <Input value={key} />
                        </legend>
                        {renderJsonAsInputs(value, [...(parents ?? []), key])}
                    </fieldset>
                );
            } else {
                return "invalid value";
            }
        });
    };

    // return <div className="w-full">{renderJsonAsInputs(defaultLang.json)}</div>;
    return (
        <div>
            <SidebarLayout navigation={[]}></SidebarLayout>
        </div>
    );
}
