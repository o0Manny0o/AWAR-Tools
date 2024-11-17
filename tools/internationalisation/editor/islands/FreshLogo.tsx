import { useMediaQuery } from "../hooks/useMediaQuery.ts";

export default function FreshLogo() {
    const dark = useMediaQuery("(prefers-color-scheme: dark)");

    return (
        <a className="absolute bottom-4 right-8" href="https://fresh.deno.dev">
            <img
                width="197"
                height="37"
                src={`https://fresh.deno.dev/fresh-badge${
                    !dark ? "-dark" : ""
                }.svg`}
                alt="Made with Fresh"
            />
        </a>
    );
}
