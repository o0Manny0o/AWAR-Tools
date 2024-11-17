import { type PageProps } from "$fresh/server.ts";
import FreshLogo from "../islands/FreshLogo.tsx";

export default function App({ Component }: PageProps) {
    return (
        <html className="min-h-full">
            <head>
                <meta charset="utf-8" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0"
                />
                <title>AWAR Internationalisation Editor</title>
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body className="min-h-full bg-white dark:bg-gray-900 text-gray-700 dark:text-slate-50">
                <main>
                    <Component />
                    <FreshLogo />
                </main>
            </body>
        </html>
    );
}
