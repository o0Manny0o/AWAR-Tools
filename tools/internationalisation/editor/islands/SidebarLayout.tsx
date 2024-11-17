import { Menu } from "../components/Menu.tsx";
import { useState } from "preact/hooks";
import { ComponentChildren } from "preact";

interface SidebarProps {
    navigation: {
        name: string;
        href: string;
        current: boolean;
    }[];
    children?: ComponentChildren;
}

export default function SidebarLayout({ navigation, children }: SidebarProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    return (
        <>
            <div
                data-closed={!sidebarOpen}
                className="relative z-50 lg:hidden group"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className="fixed inset-0 bg-gray-900/80 opacity-100 duration-300 ease-in-out group-data-[closed=true]:hidden"
                    aria-hidden="true"
                ></div>

                <div className="fixed inset-0 flex translate-x-0 duration-300 ease-in-out group-data-[closed=true]:-translate-x-full">
                    <div className="relative mr-16 flex w-full max-w-xs flex-1 ">
                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5 opacity-100 duration-300 ease-in-out group-data-[closed=true]:opacity-0">
                            <button
                                type="button"
                                onClick={() => setSidebarOpen(false)}
                                className="-m-2.5 p-2.5"
                            >
                                <span className="sr-only">Close sidebar</span>
                                <svg
                                    class="h-6 w-6 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke-width="1.5"
                                    stroke="currentColor"
                                    aria-hidden="true"
                                    data-slot="icon"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        d="M6 18 18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <Menu navigation={navigation} />
                    </div>
                </div>
            </div>

            {/* Static sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <Menu navigation={navigation} />
            </div>

            <div className="lg:pl-72">
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-slate-50 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 dark:bg-gray-800 dark:border-gray-400 dark:shadow-gray-400">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-700 lg:hidden dark:text-slate-50"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            aria-hidden="true"
                            data-slot="icon"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </button>

                    <div
                        className="h-6 w-px bg-gray-900/10 lg:hidden"
                        aria-hidden="true"
                    ></div>

                    <img
                        className="my-6 text-gray-700 dark:text-slate-50"
                        src="/logo.svg"
                        height="54"
                        alt="the AWAR logo"
                    />
                    <h1 className="text-1xl font-bold text-gray-700 dark:text-slate-50">
                        AWAR Internationalisation Editor
                    </h1>
                </div>

                <div className="py-10 bg-slate-100 dark:bg-gray-900">
                    <div className="px-4 sm:px-6 lg:px-8">{children}</div>
                </div>
            </div>
        </>
    );
}
