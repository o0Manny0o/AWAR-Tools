import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";
import svgInjectPlugin from "svgInjectPlugin";

export default defineConfig({
    plugins: [tailwind(), svgInjectPlugin()],
});
