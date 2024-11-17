import {FreshContext} from "$fresh/server.ts";

export async function handler(
    _req: Request,
    ctx: FreshContext<unknown>,
) {
    if (!Deno.env.get("LANG_PATH") || !Deno.env.get("TRANSLATION_TYPES_PATH")) {
        return new Response("Environment variables not set", { status: 404 });
    }
    return await ctx.next();
}