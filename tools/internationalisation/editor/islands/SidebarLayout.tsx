import { Menu } from "../components/Menu.tsx";
import { useEffect, useRef, useState } from "preact/hooks";
import { Fragment } from "preact";
import { JSONValue, TranslationFile } from "../shared/types.ts";
import { debounce, get } from "lodash";
import { TranslationGroup } from "../components/TranslationGroup.tsx";
import { formDataToObject } from "../shared/util.ts";
import { CreateKey } from "../components/CreateKey.tsx";

interface SidebarProps {
    languageFiles: TranslationFile[];
}

enum FormState {
    UNTOUCHED,
    CHANGED,
    SAVING,
    SAVED,
    ERROR,
}

export default function SidebarLayout({ languageFiles }: SidebarProps) {
    const [languages, setLanguages] = useState(languageFiles);
    const [formState, setFormState] = useState<FormState>(FormState.UNTOUCHED);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedKey, setSelectedKey] = useState<string | undefined>(
        localStorage.getItem("selectedKey") ?? undefined,
    );

    useEffect(() => {
        if (selectedKey) {
            localStorage.setItem("selectedKey", selectedKey);
        } else {
            localStorage.removeItem("selectedKey");
        }
    }, [selectedKey]);

    const defaultLang = languages.find((l) => l.language === "en");
    if (!defaultLang) {
        return <p>English Language file not found</p>;
    }

    const updateTranslations = () => {
        if (!formRef.current) {
            return;
        }
        const translations = formDataToObject(new FormData(formRef.current));
        setLanguages(
            translations.map(([language, json]) => ({
                language,
                json,
            })),
        );
        setFormState(FormState.CHANGED);
    };

    const formRef = useRef<HTMLFormElement>(null);

    const handleSubmit = async () => {
        const currentFocus = document.activeElement;
        if (currentFocus?.tagName === "INPUT") {
            setTimeout(handleSubmit, 500);
            return;
        }
        setFormState(FormState.SAVING);
        if (!formRef.current) {
            return;
        }
        const opts = {
            method: "POST",
            body: new FormData(formRef.current),
        };
        const response = await fetch("/", opts);
        const body: { message: string; translations?: any } =
            await response.json();
        if (response.ok && body?.translations) {
            setLanguages(body?.translations);
        }
        setFormState(response.ok ? FormState.SAVED : FormState.ERROR);
    };

    const mapSubTranslations = (
        translations: Map<string, JSONValue>,
        key: string,
    ) => {
        const x = Array.from<[string, JSONValue]>(translations).map(
            ([lang, value]) => {
                return [lang, get(value, key)];
            },
        );
        return new Map(x as [string, JSONValue][]);
    };

    const renderJsonAsInputs = (
        translations: Map<string, JSONValue>,
        parents: string[] = [],
    ) => {
        const defaultTranslation = translations.get("en");
        if (!defaultTranslation) {
            return <p>English Translation not found</p>;
        }
        if (typeof defaultTranslation === "string") {
            const show = selectedKey
                ?.split(".")
                .every((v, i) => v === parents[i]);
            return (
                <fieldset
                    hidden={show}
                    className={
                        "divide-y-4 divide-orange-300 " +
                        (show ? "block" : "hidden")
                    }
                >
                    <div className="my-4 space-y-2">
                        <legend className="pb-2">{parents.join(".")}</legend>
                        <TranslationGroup
                            translations={
                                [...translations.entries()] as [
                                    string,
                                    string,
                                ][]
                            }
                            tKey={parents.join(".")}
                        />
                    </div>
                </fieldset>
            );
        } else if (typeof defaultTranslation === "object") {
            return Object.entries(defaultTranslation).map(([key, _value]) => {
                return (
                    <Fragment>
                        {renderJsonAsInputs(
                            mapSubTranslations(translations, key),
                            [...(parents ?? []), key],
                        )}
                    </Fragment>
                );
            });
        } else {
            return <p>invalid value</p>;
        }
    };

    return (
        <>
            <div
                data-closed={!sidebarOpen}
                className="relative z-50 lg:hidden group"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="fixed inset-0 bg-gray-900/80 opacity-100 duration-300 ease-in-out group-data-[closed=true]:hidden"
                    aria-hidden="true"
                ></div>

                <div className="fixed inset-0 flex translate-x-0 duration-300 ease-in-out group-data-[closed=true]:-translate-x-full">
                    <div className="relative mr-16 flex w-full max-w-xs flex-1 ">
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5 opacity-100 duration-300 ease-in-out group-data-[closed=true]:opacity-0">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="-m-2.5 p-2.5"
                            >
                                <span className="sr-only">Close sidebar</span>
                                <svg
                                    class="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <Menu
                            navigation={defaultLang.json}
                            selectedKey={selectedKey}
                            onItemSelected={setSelectedKey}
                        />
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <Menu
                    navigation={defaultLang.json}
                    selectedKey={selectedKey}
                    onItemSelected={setSelectedKey}
                />
            </div>

            <div className="lg:pl-72 min-h-screen flex flex-col">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-slate-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-400 dark:shadow-gray-400">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-slate-50"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>

                    <div
                        className="h-6 w-px bg-gray-900/10 dark:bg-slate-50/80 lg:hidden"
                        aria-hidden="true"
                    ></div>

                    <svg
                        width="78"
                        height="30"
                        viewBox="0 0 78 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-14"
                    >
                        <g clip-path="url(#clip0_16_413)">
                            <path
                                d="M18.5147 0C15.4686 0 12.5473 1.21005 10.3934 3.36396L3.36396 10.3934C1.21005 12.5473 0 15.4686 0 18.5147C0 24.8579 5.14214 30 11.4853 30C14.5314 30 17.4527 28.7899 19.6066 26.636L24.4689 21.7737C24.4689 21.7736 24.469 21.7738 24.4689 21.7737L38.636 7.6066C39.6647 6.57791 41.0599 6 42.5147 6C44.9503 6 47.0152 7.58741 47.7311 9.78407L52.2022 5.31296C50.1625 2.11834 46.586 0 42.5147 0C39.4686 0 36.5473 1.21005 34.3934 3.36396L15.364 22.3934C14.3353 23.4221 12.9401 24 11.4853 24C8.45584 24 6 21.5442 6 18.5147C6 17.0599 6.57791 15.6647 7.6066 14.636L14.636 7.6066C15.6647 6.57791 17.0599 6 18.5147 6C20.9504 6 23.0152 7.58748 23.7311 9.78421L28.2023 5.31307C26.1626 2.1184 22.5861 0 18.5147 0Z"
                                fill="currentColor"
                            />
                            <path
                                d="M39.3639 22.3934C38.3352 23.4221 36.94 24 35.4852 24C33.0499 24 30.9852 22.413 30.2691 20.2167L25.7981 24.6877C27.8379 27.8819 31.4142 30 35.4852 30C38.5313 30 41.4526 28.7899 43.6065 26.636L62.6359 7.6066C63.6646 6.57791 65.0598 6 66.5146 6C69.5441 6 71.9999 8.45584 71.9999 11.4853C71.9999 12.9401 71.422 14.3353 70.3933 15.364L63.3639 22.3934C62.3352 23.4221 60.94 24 59.4852 24C57.0497 24 54.9849 22.4127 54.2689 20.2162L49.7979 24.6873C51.8376 27.8818 55.414 30 59.4852 30C62.5313 30 65.4526 28.7899 67.6065 26.636L74.6359 19.6066C76.7898 17.4527 77.9999 14.5314 77.9999 11.4853C77.9999 5.14214 72.8578 0 66.5146 0C63.4685 0 60.5472 1.21005 58.3933 3.36396L39.3639 22.3934Z"
                                fill="currentColor"
                            />
                        </g>
                        <defs>
                            <clipPath id="clip0_16_413">
                                <rect width="78" height="30" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <h1 className="text-1xl font-bold text-gray-700 dark:text-slate-50">
                        AWAR Internationalisation Editor
                    </h1>

                    <div
                        className="h-6 w-px bg-gray-900/10 dark:bg-slate-50/80"
                        aria-hidden="true"
                    ></div>

                    {formState === FormState.CHANGED && <p>Unsaved Changes</p>}
                    {formState === FormState.SAVING && <p>Saving...</p>}
                    {formState === FormState.SAVED && <p>Saved</p>}
                    {formState === FormState.ERROR && <p>Error</p>}

                    <div className="ml-auto flex items-center">
                        <CreateKey />
                    </div>
                </div>

                <div className="py-10 bg-slate-100 dark:bg-gray-900 flex-1">
                    <form
                        className="px-4 sm:px-6 lg:px-8 divide-y-2 divide-orange-300"
                        method="post"
                        onChange={() => {
                            updateTranslations();
                            debounce(handleSubmit, 1000)();
                        }}
                        ref={formRef}
                    >
                        {renderJsonAsInputs(
                            new Map(languages.map((f) => [f.language, f.json])),
                        )}
                    </form>
                </div>
            </div>
        </>
    );
}
