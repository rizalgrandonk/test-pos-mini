import TransactionDetailController from '@/actions/App/Http/Controllers/TransactionDetailController';
import { useDataTableQuery } from '@/hooks/use-data-table-query';
import { useDebounce } from '@/hooks/use-debounce';
import { formatCurrency } from '@/lib/utils';
import productRoutes from '@/routes/products';
import transactionRoutes from '@/routes/transactions';
import transactionDetailRoutes from '@/routes/transactions/detail';
import { TransactionDetailTable, TransactionHeader } from '@/types';
import { Form, Link, router } from '@inertiajs/react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ColumnDef, SortingState } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { DataTable } from '../data-table/DataTable';
import { DataTablePagination } from '../data-table/DataTablePagination';
import { DataTableToolbar } from '../data-table/DataTableToolbar';
import { actionsColumn, selectColumn } from '../data-table/columns';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
} from '../ui/dialog';
import { Spinner } from '../ui/spinner';

const columns: ColumnDef<TransactionDetailTable>[] = [
    // {
    //     accessorKey: 'transaction_header_invoice_number',
    //     header: 'Invoice Number',
    // },
    {
        accessorKey: 'product_name',
        header: 'Product',
        cell: ({ row }) => (
            <Button variant="link" asChild>
                <Link href={productRoutes.edit(row.original.product_id).url}>
                    {row.original.product_name}
                </Link>
            </Button>
        ),
    },
    {
        accessorKey: 'product_code',
        header: 'Product Code',
        cell: ({ row }) => (
            <Button variant="link" asChild>
                <Link href={productRoutes.edit(row.original.product_id).url}>
                    {row.original.product_code}
                </Link>
            </Button>
        ),
    },
    {
        accessorKey: 'qty',
        header: 'Quantity',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.original.price),
    },
    {
        accessorKey: 'net_price',
        header: 'Net Price',
        cell: ({ row }) => formatCurrency(row.original.net_price),
    },
    {
        accessorKey: 'subtotal',
        header: 'Sub Total',
        cell: ({ row }) => formatCurrency(row.original.subtotal),
    },
];

export default function DetailTransactionTable({
    transaction,
}: {
    transaction: TransactionHeader;
}) {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<
        TransactionDetailTable | undefined
    >(undefined);

    const debouncedSearch = useDebounce(search);

    const tableColumns = useMemo(
        () => [
            selectColumn<TransactionDetailTable>(),
            ...columns,
            actionsColumn<TransactionDetailTable>({
                onEdit: (data) => {
                    router.visit(
                        transactionDetailRoutes.edit.url({
                            header_id: transaction.id,
                            id: data.id,
                        }),
                    );
                },
                onDelete: (data) => {
                    setSelectedData(data);
                    setIsDeleteDialogOpen(true);
                },
            }),
        ],
        [],
    );

    const sortParam =
        sorting.length > 0
            ? `${sorting[0].id}:${sorting[0].desc ? 'desc' : 'asc'}`
            : undefined;

    const { data, ...query } = useDataTableQuery<TransactionDetailTable>(
        transactionDetailRoutes.table(transaction.id).url,
        transactionDetailRoutes.table(transaction.id).url,
        {
            page,
            perPage: perPage,
            search: debouncedSearch,
            sort: sortParam,
        },
    );

    const selectedIds = Object.keys(rowSelection)
        .map((key) => data?.data[Number(key)]?.id)
        .filter(Boolean) as number[];

    return (
        <div className="flex grow flex-col gap-2 overflow-hidden">
            <div className="flex items-center justify-between p-2">
                <DataTableToolbar
                    search={search}
                    selectedCount={selectedIds.length}
                    onSearchChange={(value) => {
                        setPage(1);
                        setSearch(value);
                    }}
                    onDelete={() => setIsBulkDeleteDialogOpen(true)}
                />

                <div className="flex items-center gap-4">
                    <Button asChild>
                        <Link
                            href={
                                transactionDetailRoutes.create(transaction.id)
                                    .url
                            }
                        >
                            <PlusIcon /> Add New Transaction Detail
                        </Link>
                    </Button>
                </div>
            </div>

            <ScrollArea className="relative grow overflow-y-auto">
                {!query.isLoading && (
                    <DataTable
                        pageCount={data?.last_page ?? 1}
                        columns={tableColumns}
                        data={data?.data ?? []}
                        sorting={sorting}
                        rowSelection={rowSelection}
                        onSortingChange={setSorting}
                        onRowSelectionChange={setRowSelection}
                    />
                )}
            </ScrollArea>

            <div className="p-2">
                {!query.isLoading && (
                    <DataTablePagination
                        page={page}
                        lastPage={data?.last_page ?? 1}
                        perPage={perPage}
                        onPerPageChange={setPerPage}
                        onPageChange={setPage}
                    />
                )}
            </div>

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setSelectedData(undefined);
                    }
                    setIsDeleteDialogOpen(open);
                }}
                selectedData={selectedData}
                onSuccess={() => {
                    setSelectedData(undefined);
                    setIsDeleteDialogOpen(false);
                    query.refetch();
                    router.visit(transactionRoutes.edit(transaction.id).url, {
                        only: ['transaction'],
                    });
                }}
            />

            <BulkDeleteDialog
                isOpen={isBulkDeleteDialogOpen}
                onOpenChange={setIsBulkDeleteDialogOpen}
                selectedIds={selectedIds}
                trxHeaderId={transaction.id}
                onSuccess={() => {
                    setRowSelection({});
                    setIsBulkDeleteDialogOpen(false);
                    query.refetch();
                    router.visit(transactionRoutes.edit(transaction.id).url, {
                        only: ['transaction'],
                    });
                }}
            />
        </div>
    );
}

function DeleteDialog({
    selectedData,
    isOpen,
    onSuccess,
    onOpenChange,
}: {
    isOpen?: boolean;
    selectedData?: TransactionDetailTable;
    onSuccess?: () => void;
    onOpenChange: (open: boolean) => void;
}) {
    if (!selectedData) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>
                    Are you sure you want to delete this transaction?
                </DialogTitle>
                <DialogDescription>
                    This action can not be revert!
                </DialogDescription>

                <Form
                    {...TransactionDetailController.destroy.form({
                        header_id: selectedData.transaction_header_id,
                        id: selectedData.id,
                    })}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={onSuccess}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ resetAndClearErrors, processing, errors }) => (
                        <>
                            {errors.delete && (
                                <p className="text-sm text-destructive">
                                    {errors.delete}
                                </p>
                            )}

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        variant="secondary"
                                        onClick={() => resetAndClearErrors()}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    disabled={processing}
                                    type="submit"
                                >
                                    {processing && <Spinner />}
                                    Delete
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function BulkDeleteDialog({
    selectedIds,
    trxHeaderId,
    isOpen,
    onSuccess,
    onOpenChange,
}: {
    isOpen?: boolean;
    selectedIds?: number[];
    trxHeaderId?: number;
    onSuccess?: () => void;
    onOpenChange: (open: boolean) => void;
}) {
    if (!selectedIds || !trxHeaderId || selectedIds.length < 1) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>
                    Are you sure you want to delete this {selectedIds.length}{' '}
                    transactions?
                </DialogTitle>
                <DialogDescription>
                    This action can not be revert!
                </DialogDescription>

                <Form
                    {...TransactionDetailController.bulkDestroy.form({
                        header_id: trxHeaderId,
                    })}
                    transform={(data) => ({ ...data, ids: selectedIds })}
                    options={{
                        preserveScroll: true,
                    }}
                    onSuccess={onSuccess}
                    resetOnSuccess
                    className="space-y-6"
                >
                    {({ resetAndClearErrors, processing, errors }) => (
                        <>
                            {errors.delete && (
                                <p className="text-sm text-destructive">
                                    {errors.delete}
                                </p>
                            )}

                            <DialogFooter className="gap-2">
                                <DialogClose asChild>
                                    <Button
                                        variant="secondary"
                                        onClick={() => resetAndClearErrors()}
                                    >
                                        Cancel
                                    </Button>
                                </DialogClose>

                                <Button
                                    variant="destructive"
                                    disabled={processing}
                                    type="submit"
                                >
                                    {processing && <Spinner />}
                                    Delete
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
