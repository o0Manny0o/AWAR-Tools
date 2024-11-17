import { useRef, useState } from "preact/hooks";
import { Input } from "./Input.tsx";

export function CreateKey() {
    const createDialogRef = useRef<HTMLDialogElement>(null);

    const [newKey, setNewKey] = useState("");
    const [newKeyError, setNewKeyError] = useState<string>();

    const createNewKey = async () => {
        const opts = {
            method: "POST",
            body: JSON.stringify({ key: newKey }),
        };
        const response = await fetch("/api/translations", opts);
        if (!response.ok) {
            setNewKeyError(await response.text());
        } else {
            globalThis.location.reload();
        }
    };

    return (
        <>
            <button onClick={() => createDialogRef.current?.showModal()}>
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
                        d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                </svg>
            </button>

            <dialog
                ref={createDialogRef}
                className=" bg-slate-100 dark:bg-gray-800 rounded backdrop:bg-gray-900/80 "
            >
                <div className="p-8 flex flex-col gap-2 text-gray-700 dark:text-slate-50">
                    <Input
                        id={"new-key"}
                        value={newKey}
                        onInput={(e) => setNewKey(e.target.value)}
                        label="New Key"
                        error={newKeyError}
                    />
                    <div className="flex justify-end gap-4">
                        <button
                            className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => createDialogRef.current?.close()}
                        >
                            Cancel
                        </button>

                        <button
                            className="rounded enabled:bg-orange-700 bg-gray-500  px-2 py-1 text-sm font-semibold text-white shadow-sm hover:enabled:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                            disabled={!newKey}
                            onClick={createNewKey}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
