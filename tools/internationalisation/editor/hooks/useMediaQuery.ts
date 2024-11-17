import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";

export function useMediaQuery(
    query: string,
    { defaultValue = false, initializeWithValue = true } = {},
) {
    const getMatches = (query2: string) => {
        if (!IS_BROWSER) {
            return defaultValue;
        }
        return globalThis.matchMedia(query2).matches;
    };
    const [matches, setMatches] = useState(() => {
        if (initializeWithValue) {
            return getMatches(query);
        }
        return defaultValue;
    });
    function handleChange() {
        setMatches(getMatches(query));
    }
    useEffect(() => {
        if (IS_BROWSER) {
            const matchMedia = globalThis.matchMedia(query);
            handleChange();
            if (matchMedia.addListener) {
                matchMedia.addListener(handleChange);
            } else {
                matchMedia.addEventListener("change", handleChange);
            }
            return () => {
                if (matchMedia.removeListener) {
                    matchMedia.removeListener(handleChange);
                } else {
                    matchMedia.removeEventListener("change", handleChange);
                }
            };
        }
    }, [query]);
    return matches;
}
