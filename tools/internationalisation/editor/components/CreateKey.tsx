import { useEffect, useRef, useState } from 'preact/hooks'
import { Input } from './Input.tsx'
import { correctKey } from '../shared/util.ts'

interface CreateKeyProps {
    selectedKey?: string
}

export function CreateKey({ selectedKey }: CreateKeyProps) {
    const createDialogRef = useRef<HTMLDialogElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    const [newKey, setNewKey] = useState(selectedKey ?? '')
    const [newKeyError, setNewKeyError] = useState<string>()
    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        if (
            createDialogRef.current &&
            inputRef.current &&
            localStorage.getItem('reopenCreate')
        ) {
            setNewKey(localStorage.getItem('reopenCreate')!)
            createDialogRef.current.showModal()
            setTimeout(() =>
                createDialogRef.current?.querySelector('input')?.select(),
            )
            localStorage.removeItem('reopenCreate')
        }
    }, [createDialogRef.current])

    useEffect(() => {
        setNewKey(selectedKey ?? newKey)
    }, [selectedKey])

    const createNewKey = async (e: KeyboardEvent | MouseEvent) => {
        setDisabled(true)
        const key = correctKey(newKey, true)
        const opts = {
            method: 'POST',
            body: JSON.stringify({ key: key }),
        }
        const response = await fetch('/api/translations', opts)
        if (!response.ok) {
            setNewKeyError(await response.text())
            setDisabled(false)
        } else {
            localStorage.setItem('selectedKey', key)
            if (e.shiftKey) {
                localStorage.setItem(
                    'reopenCreate',
                    key.split('.').slice(0, -1).join('.') + '.',
                )
            }
            globalThis.location.reload()
        }
    }

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
                className="rounded bg-slate-100 backdrop:bg-gray-900/80 dark:bg-gray-800"
            >
                <div className="flex flex-col gap-2 p-8 text-gray-700 dark:text-slate-50">
                    <Input
                        id={'new-key'}
                        ref={inputRef}
                        value={newKey}
                        onInput={(e) =>
                            setNewKey(
                                correctKey(
                                    (e.target as HTMLInputElement)?.value,
                                ),
                            )
                        }
                        onKeyDown={(e) => e.key === 'Enter' && createNewKey(e)}
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
                            className="rounded bg-gray-500 px-2 py-1 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 enabled:bg-orange-700 hover:enabled:bg-orange-600"
                            disabled={!newKey || disabled}
                            onClick={createNewKey}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    )
}
