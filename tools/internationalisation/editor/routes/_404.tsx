import { Head } from '$fresh/runtime.ts'
import { PageProps } from '$fresh/server.ts'

interface Error {
    message: string
}

export default function Error404(props: PageProps<Error>) {
    return (
        <>
            <Head>
                <title>404 - Page not found</title>
            </Head>
            <div class="mx-auto px-4 py-8 text-gray-700 dark:text-slate-50">
                <div class="mx-auto flex max-w-screen-md flex-col items-center justify-center">
                    <h1 class="text-4xl font-bold">404 - Error</h1>
                    <p class="my-4">
                        {props.data
                            ? props.data.message
                            : "The page you were looking for doesn't exist."}
                    </p>
                    <a href={props.url.href} class="underline">
                        Retry
                    </a>
                </div>
            </div>
        </>
    )
}
