import {useEffect, useState} from "preact/hooks";
import {JSONValue} from "https://deno.land/std@0.173.0/encoding/jsonc.ts";
import {JSONObject} from "../shared/types.ts";
import {Menu} from "./Menu.tsx";
import {DeleteKey} from "./DeleteKey.tsx";
import {EditKey} from "./EditKey.tsx";

interface MenuProps {
    tKey: string;
    value: JSONValue;
    parents: string[];
    selectedKey?: string;
    onItemSelected: (item: string) => void;
}

export function MenuItem({
    tKey,
    value,
    parents,
    selectedKey,
    onItemSelected,
}: MenuProps) {
    const [childrenExpanded, setChildrenExpanded] = useState(
        JSON.parse(localStorage.getItem(tKey) ?? "false"),
    );

    const fullKey = [...parents, tKey].join(".");

    function selectItem() {
        onItemSelected(fullKey);
    }

    const hasChildren = (item: JSONValue) => typeof item === "object";

    const selectedSubKey = (): string | undefined =>
        selectedKey?.split(".").slice(1).join(".");

    const closeChildren = (v: JSONObject) => {
        Object.entries(v).forEach(([cKey, cVal]) => {
            if (hasChildren(cVal)) {
                localStorage.setItem(cKey, JSON.stringify(false));
                closeChildren(cVal as JSONObject);
            }
        })
    }

    useEffect(() => {
        localStorage.setItem(tKey, JSON.stringify(childrenExpanded));
    }, [childrenExpanded]);

    return (
        <li
            key={tKey}
            className={`dark:even:bg-slate-50/20 even:bg-gray-700/20`}
        >
            <div
                className={"group/menu flex items-center gap-2 rounded-sm " +
                    (tKey === selectedKey?.split(".")[0]
                        ? "bg-orange-300/80 text-gray-700"
                        : "")}
            >
                <div className="flex flex-1 items-center gap-1">
                    <div
                        onClick={() => selectItem()}
                        className={"flex flex-1 cursor-pointer items-center gap-2 rounded-sm p-2.5 transition-colors hover:bg-orange-500 dark:hover:text-gray-700"}
                    >
                        {hasChildren(value)
                            ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                                    />
                                </svg>
                            )
                            : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    className="size-4"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                    />
                                </svg>
                            )}
                        {tKey}
                    </div>
                    <EditKey
                        langKey={fullKey}
                        className="cursor-pointer rounded-sm p-2.5 opacity-0 transition ease-out hover:bg-orange-500 group-hover/menu:opacity-100 dark:hover:text-gray-700"
                    />
                    <DeleteKey
                        langKey={fullKey}
                        className="cursor-pointer rounded-sm p-2.5 opacity-0 transition ease-out hover:bg-orange-500 group-hover/menu:opacity-100 dark:hover:text-gray-700"
                    />
                </div>
                {hasChildren(value) && (
                    <button
                        className="cursor-pointer rounded-sm p-2.5 transition-colors hover:bg-orange-500 dark:hover:text-gray-700"
                        onClick={(e) => {
                            if (e.shiftKey && childrenExpanded) {
                                closeChildren(value as JSONObject);
                            }
                            setChildrenExpanded(!childrenExpanded);
                        }}
                    >
                        <span className="sr-only">Expand Menu</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className={"size-6 " +
                                (childrenExpanded ? "hidden" : "block")}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            className={"size-6 " +
                                (childrenExpanded ? "block" : "hidden")}
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="m4.5 15.75 7.5-7.5 7.5 7.5"
                            />
                        </svg>
                    </button>
                )}
            </div>
            {hasChildren(value) && childrenExpanded && (
                <div className="ms-4">
                    <Menu
                        selectedKey={selectedSubKey()}
                        onItemSelected={onItemSelected}
                        navigation={value as JSONObject}
                        parents={[...parents, tKey]}
                    />
                </div>
            )}
        </li>
    );
}
