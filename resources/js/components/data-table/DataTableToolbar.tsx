import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import productRoutes from '@/routes/products';
import { Link } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';

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
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="max-w-sm"
                    />
                    <Button
                        variant="outline"
                        onClick={() => onSearchChange('')}
                    >
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

            <div className="flex items-center gap-4">
                <Button asChild>
                    <Link href={productRoutes.create().url}>
                        <PlusIcon /> Add New Product
                    </Link>
                </Button>
            </div>
        </div>
    );
}
