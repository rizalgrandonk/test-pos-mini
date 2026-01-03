import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    OnChangeFn,
    RowSelectionState,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';
import { Button } from '../ui/button';

interface DataTableProps<TData> {
    columns: ColumnDef<TData, any>[];
    data: TData[];
    errorMessage?: string;
    pageCount: number;
    sorting: SortingState;
    onSortingChange: OnChangeFn<SortingState>;
    rowSelection: RowSelectionState;
    onRowSelectionChange: OnChangeFn<RowSelectionState>;
}

export function DataTable<TData>({
    columns,
    data,
    pageCount,
    sorting,
    errorMessage,
    onSortingChange,
    rowSelection,
    onRowSelectionChange,
}: DataTableProps<TData>) {
    const table = useReactTable({
        data,
        columns,
        pageCount,
        state: {
            sorting,
            rowSelection,
        },
        enableRowSelection: true,
        manualSorting: true,
        onSortingChange,
        onRowSelectionChange,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <Table noWrap className="w-full table-fixed">
            <TableHeader className="sticky top-0 z-10 bg-sidebar-accent">
                {table.getHeaderGroups().map((group) => (
                    <TableRow key={group.id}>
                        {group.headers.map((header) => (
                            <TableHead
                                key={header.id}
                                style={{
                                    width: header.column.columnDef.size
                                        ? `${header.column.columnDef.size}%`
                                        : 'auto',
                                }}
                                className="font-bold"
                            >
                                {header.column.getCanSort() ? (
                                    <Button
                                        variant="ghost"
                                        className="cursor-pointer font-bold"
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext(),
                                        )}
                                        {{
                                            asc: ' ↑',
                                            desc: ' ↓',
                                        }[
                                            header.column.getIsSorted() as string
                                        ] ?? null}
                                    </Button>
                                ) : (
                                    flexRender(
                                        header.column.columnDef.header,
                                        header.getContext(),
                                    )
                                )}
                            </TableHead>
                        ))}
                    </TableRow>
                ))}
            </TableHeader>

            <TableBody>
                {table.getRowModel().rows.length ? (
                    table.getRowModel().rows.map((row) => (
                        <TableRow key={row.original.id}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext(),
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))
                ) : (
                    <TableRow>
                        <TableCell
                            colSpan={columns.length}
                            className="h-24 text-center"
                        >
                            {errorMessage ?? 'No Results'}
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}
