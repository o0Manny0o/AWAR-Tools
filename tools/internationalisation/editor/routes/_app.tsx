import {type PageProps} from "$fresh/server.ts";
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
                <title>AWAR Translation Editor</title>
                <link
                    rel="apple-touch-icon"
                    sizes="180x180"
                    href="/apple-touch-icon.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="32x32"
                    href="/favicon-32x32.png"
                />
                <link
                    rel="icon"
                    type="image/png"
                    sizes="16x16"
                    href="/favicon-16x16.png"
                />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="stylesheet" href="/styles.css" />
            </head>
            <body className="min-h-full bg-white text-gray-700 dark:bg-gray-900 dark:text-slate-50">
                <main>
                    <Component />
                    <FreshLogo />
                </main>
                <div id="modals"></div>
            </body>
        </html>
    );
}
