import { useRef, useState } from "preact/hooks";
import { Input } from "./Input.tsx";

export function DeleteKey({
    langKey,
    className,
}: {
    langKey: string;
    className: string;
}) {
    const deleteDialogRef = useRef<HTMLDialogElement>(null);

    const [deleteError, setDeleteError] = useState<string>();
    const [disabled, setDisabled] = useState(false);

    const deleteKey = async () => {
        setDisabled(true);
        const opts = {
            method: "DELETE",
            body: JSON.stringify({ key: langKey }),
        };
        const response = await fetch("/api/translations", opts);
        if (!response.ok) {
            setDeleteError(await response.text());
            setDisabled(false);
        } else {
            globalThis.location.reload();
        }
    };

    return (
        <>
            <button
                className={className}
                onClick={() => deleteDialogRef.current?.showModal()}
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
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                </svg>
            </button>

            <dialog
                ref={deleteDialogRef}
                className="rounded bg-slate-100 backdrop:bg-gray-900/80 dark:bg-gray-800"
            >
                <div className="flex flex-col gap-2 p-8 text-gray-700 dark:text-slate-50">
                    <p>Are you sure you want to delete {langKey} ?</p>
                    <p
                        className={
                            "mt-2 text-sm text-red-600" +
                            (deleteError ? " block" : " invisible")
                        }
                    >
                        {deleteError}
                    </p>
                    <div className="flex justify-end gap-4">
                        <button
                            className="rounded bg-white px-2 py-1 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={() => deleteDialogRef.current?.close()}
                        >
                            Cancel
                        </button>

                        <button
                            className="rounded bg-gray-500 px-2 py-1 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 enabled:bg-red-700 hover:enabled:bg-red-600"
                            disabled={disabled}
                            onClick={deleteKey}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
}
