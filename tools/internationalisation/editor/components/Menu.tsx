import { JSONObject } from '../shared/types.ts'
import { MenuItem } from './MenuItem.tsx'

interface MenuProps {
    navigation: JSONObject
    selectedKey?: string
    onItemSelected: (item: string) => void
    parents?: string[]
}

export function Menu({
    navigation,
    selectedKey,
    onItemSelected,
    parents = [],
}: MenuProps) {
    function renderTranslationKeyTree() {
        return (
            <ul role="list" className="divide-y divide-gray-700 dark:divide-gray-200">
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
        )
    }

    return (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-50 dark:bg-gray-800">
            <nav className="flex flex-1 flex-col">
                {renderTranslationKeyTree()}
            </nav>
        </div>
    )
}
