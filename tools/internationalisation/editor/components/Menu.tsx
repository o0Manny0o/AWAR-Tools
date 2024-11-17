interface MenuProps {
    navigation: {
        name: string;
        href: string;
        current: boolean;
    }[];
}

export function Menu({ navigation }: MenuProps) {
    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(" ");
    }

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-50 px-6 pb-4 dark:bg-gray-800">
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={classNames(
                                            item.current
                                                ? "bg-gray-50 text-indigo-600"
                                                : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600",
                                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                                        )}
                                    >
                                        {item.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
