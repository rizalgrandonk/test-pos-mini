import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
    search: string;
    onSearchChange: (value: string) => void;
    selectedCount?: number;
    onDelete?: () => void;
}

export function DataTableToolbar({
    search,
    selectedCount = 0,
    onDelete,
    onSearchChange,
}: Props) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="max-w-sm"
                />
                <Button variant="outline" onClick={() => onSearchChange('')}>
                    Reset
                </Button>
            </div>

            {selectedCount > 0 ? (
                <div className="flex items-center gap-2">
                    <span>{selectedCount} selected</span>
                    <Button variant="destructive" onClick={onDelete}>
                        Delete selected
                    </Button>
                </div>
            ) : null}
        </div>
    );
}
