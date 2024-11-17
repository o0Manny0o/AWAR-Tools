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
        <div className="isolate -space-y-px rounded-md shadow-sm bg-slate-50 dark:bg-gray-800 text-gray-700 dark:text-white ">
            {translations
                .sort(
                    ([aLang], [bLang]) =>
                        ORDER.indexOf(aLang) - ORDER.indexOf(bLang),
                )
                .map(([lang, value]) => (
                    <div
                        key={`${lang}-${tKey}`}
                        className="relative first:rounded-t-md last:rounded-b-md px-3 pb-1.5 pt-2.5 ring-1 ring-inset ring-gray-300 focus-within:z-10 focus-within:ring-2 focus-within:ring-orange-600"
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
                            className="block w-full dark:bg-gray-800 dark:text-slate-50 border-0 bg-slate-50 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
                            value={value}
                            placeholder={value ?? defaultLang}
                        />
                    </div>
                ))}
        </div>
    );
}
