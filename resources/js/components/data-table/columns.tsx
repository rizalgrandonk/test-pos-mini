import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { Pencil, Trash } from 'lucide-react';

export const selectColumn = <TData,>(): ColumnDef<TData> => ({
    id: 'select',
    header: ({ table }) => (
        <Checkbox
            checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
                table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="border-primary"
        />
    ),
    cell: ({ row }) => (
        <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
        />
    ),
    enableSorting: false,
    size: 30,
});

interface Options<TData> {
    onEdit: (row: TData) => void;
    onDelete: (row: TData) => void;
}

export function actionsColumn<TData>({
    onEdit,
    onDelete,
}: Options<TData>): ColumnDef<TData> {
    return {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <div className="flex gap-1">
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(row.original)}
                >
                    <Pencil className="h-4 w-4" />
                </Button>

                <Button
                    size="icon"
                    variant="ghost"
                    className="text-destructive"
                    onClick={() => onDelete(row.original)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
            </div>
        ),
        enableSorting: false,
        size: 50
    };
}
