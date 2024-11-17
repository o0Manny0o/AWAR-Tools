import { JSX } from 'preact'
import { useEffect, useRef } from 'preact/hooks'

export function Input({
    id,
    error,
    ...props
}: JSX.HTMLAttributes<HTMLInputElement> & { error?: string }) {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.setCustomValidity(error ?? '')
        }
    }, [inputRef, error])

    return (
        <div>
            {props.label && (
                <label
                    htmlFor={id}
                    className="block text-sm/6 font-medium text-gray-900 dark:text-slate-100"
                >
                    {props.label}
                </label>
            )}
            <div className="relative mt-2 rounded-md shadow-sm">
                <input
                    ref={inputRef}
                    id={id}
                    {...props}
                    className="block w-full rounded-md border-0 py-1.5 pr-10 ps-3 text-gray-700 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 invalid:text-red-900 invalid:ring-red-300 invalid:placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-orange-600 invalid:focus:ring-red-500 sm:text-sm/6 dark:bg-gray-700 dark:text-white dark:invalid:text-red-400"
                    aria-describedby={id + '-error'}
                    aria-invalid={!!error}
                />
                <div
                    className={
                        'pointer-events-none absolute inset-y-0 right-0 items-center pr-3' +
                        (error ? ' flex' : ' hidden')
                    }
                >
                    <svg
                        className="size-5 text-red-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                        data-slot="icon"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </div>
            <p
                className={
                    'mt-2 text-sm text-red-600' +
                    (error ? ' block' : ' invisible')
                }
                id={id + '-error'}
            >
                {error ?? '&nbsp;'}
            </p>
        </div>
    )
}
