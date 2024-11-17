import { useRef, useState } from "preact/hooks";
import { Input } from "./Input.tsx";
import { correctKey } from "../shared/util.ts";

export function EditKey({
    langKey,
    className,
}: {
    langKey: string;
    className: string;
}) {
    const editDialogRef = useRef<HTMLDialogElement>(null);

    const [newKey, setNewKey] = useState(langKey);
    const [newKeyError, setNewKeyError] = useState<string>();
    const [disabled, setDisabled] = useState(false);

    const editKey = async () => {
        setDisabled(true);
        const key = correctKey(newKey, true);
        const opts = {
            method: "PATCH",
            body: JSON.stringify({ oldKey: langKey, key: key }),
        };
        const response = await fetch("/api/translations", opts);
        if (!response.ok) {
            setNewKeyError(await response.text());
            setDisabled(false);
        } else {
            localStorage.setItem("selectedKey", key);
            globalThis.location.reload();
        }
    };

    return (
        <>
            <button
                className={className}
                onClick={() => editDialogRef.current?.showModal()}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    className="size-6"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                    />
                </svg>
            </button>

            <dialog
                ref={editDialogRef}
                className=" bg-slate-100 dark:bg-gray-800 rounded backdrop:bg-gray-900/80 "
            >
                <div className="p-8 flex flex-col gap-2 text-gray-700 dark:text-slate-50">
                    <Input
                        id={"new-key"}
                        value={newKey}
                        onInput={(e) => setNewKey(correctKey(e.target.value))}
                        onKeyDown={(e) => e.key === "Enter" && editKey()}
                        label="New Key"
                        error={newKeyError}
                    />
                    <div className="flex justify-end gap-4">
                        <button
                            className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => editDialogRef.current?.close()}
                        >
                            Cancel
                        </button>

                        <button
                            className="rounded enabled:bg-orange-700 bg-gray-500  px-2 py-1 text-sm font-semibold text-white shadow-sm hover:enabled:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                            disabled={!newKey || newKey === langKey || disabled}
                            onClick={editKey}
                        >
                            Edit
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
