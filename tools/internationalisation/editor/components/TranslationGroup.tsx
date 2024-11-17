import { LanguageKeys } from "../shared/types.ts";

interface TranslationGroupProps {
    translations: [LanguageKeys, string][];
    tKey: string;
}

const ORDER = [LanguageKeys.ENGLISH, LanguageKeys.GERMAN];

export function TranslationGroup({
    translations,
    tKey,
}: TranslationGroupProps) {
    const defaultLang = translations.find(([lang]) => lang === "en")?.[1];
    return (
        <div className="isolate -space-y-px rounded-md bg-slate-50 text-gray-700 shadow-sm dark:bg-gray-800 dark:text-white">
            {translations
                .sort(
                    ([aLang], [bLang]) =>
                        ORDER.indexOf(aLang) - ORDER.indexOf(bLang),
                )
                .map(([lang, value]) => (
                    <div
                        key={`${lang}-${tKey}`}
                        className="relative px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 first:rounded-t-md last:rounded-b-md focus-within:z-10 focus-within:ring-2 focus-within:ring-orange-600"
                    >
                        <label
                            htmlFor={`${lang}-${tKey}`}
                            className="block text-xs font-medium text-gray-900 dark:text-slate-50"
                        >
                            {lang}
                        </label>
                        <input
                            type="text"
                            name={`${lang}-${tKey}`}
                            id={`${lang}-${tKey}`}
                            className="block w-full border-0 bg-slate-50 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6 dark:bg-gray-800 dark:text-slate-50"
                            value={value}
                            placeholder={value ?? defaultLang}
                        />
                    </div>
                ))}
        </div>
    );
}
