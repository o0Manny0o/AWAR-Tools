import { JSONObject } from "../shared/types.ts";
import { MenuItem } from "./MenuItem.tsx";

interface MenuProps {
    navigation: JSONObject;
    selectedKey?: string;
    onItemSelected: (item: string) => void;
    parents?: string[];
}

export function Menu({
    navigation,
    selectedKey,
    onItemSelected,
    parents = [],
}: MenuProps) {
    function renderTranslationKeyTree() {
        return (
            <ul role="list" className="mt-2 space-y-1 ps-4">
                {Object.entries(navigation).map(([tKey, value]) => (
                    <MenuItem
                        tKey={tKey}
                        value={value}
                        parents={parents}
                        selectedKey={selectedKey}
                        onItemSelected={onItemSelected}
                    />
                ))}
            </ul>
        );
    }

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-50 px-2 pb-2 dark:bg-gray-800">
            <nav className="-ms-4 flex flex-1 flex-col">
                {renderTranslationKeyTree()}
            </nav>
        </div>
    );
}
