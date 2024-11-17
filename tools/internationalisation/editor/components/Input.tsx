import { JSX } from "preact";

export function Input(props: JSX.HTMLAttributes<HTMLInputElement>) {
    return (
        <div className="flex items-center gap-4">
            {props.label && <label htmlFor={props.id}>{props.label}</label>}
            <input
                id={props.id}
                name={props.name}
                type="text"
                placeholder={props.placeholder}
                value={props.value}
                className="block w-full rounded-md border-0 py-1.5 text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6 dark:bg-gray-700 dark:text-white"
            />
        </div>
    );
}
