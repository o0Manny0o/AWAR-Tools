import { Handlers, PageProps } from "$fresh/server.ts";

export const handler: Handlers = {
    async GET(_req, ctx) {
        try {
            const languages = [];
            for await (const language of Deno.readDir(`./lang`)) {
                languages.push(language);
            }

            // const json = await Promise.all(languages.map((lang) => ))

            return ctx.render(languages);
        } catch (e: unknown) {
            return ctx.renderNotFound({
                message: `Error loading language files ${e instanceof Error ? e.message : e}`,
            });
        }
    },
};

export default function Home({ data }: PageProps<any>) {
    return data;
}
