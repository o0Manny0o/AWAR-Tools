import { type PageProps } from "$fresh/server.ts";
import FreshLogo from "../islands/FreshLogo.tsx";

export default function App({ Component }: PageProps) {
    return (
        <html>
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>AWAR Internationalisation Editor</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body className="min-h-full bg-white dark:bg-gray-900">
                <div className="px-4 py-8 mx-auto">
                    <div className="max-w-screen-md mx-auto flex flex-col items-center justify-center">
                        <img
                            className="my-6 text-gray-700 dark:text-slate-50"
                            src="/logo.svg"
                            width="128"
                            height="128"
                            alt="the AWAR logo"
                        />
                        <h1 className="text-4xl font-bold  text-gray-700 dark:text-slate-50">
                            AWAR Internationalisation Editor
                        </h1>

                        <Component />

                        <FreshLogo />
                    </div>
                </div>
            </body>
        </html>
    );
}
