import ProductController from '@/actions/App/Http/Controllers/ProductController';
import { useDataTableQuery } from '@/hooks/use-data-table-query';
import { formatCurrency } from '@/lib/utils';
import { table as productTableRoute } from '@/routes/products';
import { Product } from '@/types';
import { Form, router } from '@inertiajs/react';
import { ScrollArea } from '@radix-ui/react-scroll-area';
import { ColumnDef, SortingState } from '@tanstack/react-table';
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
import productRoutes from '@/routes/products';

const columns: ColumnDef<Product>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'stock',
        header: 'Stock',
    },
    {
        accessorKey: 'price',
        header: 'Price',
        cell: ({ row }) => formatCurrency(row.original.price),
    },
];

export default function ProductTable() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Product | undefined>(
        undefined,
    );

    const tableColumns = useMemo(
        () => [
            selectColumn<Product>(),
            ...columns,
            actionsColumn<Product>({
                onEdit: (row) => {
                    router.visit(productRoutes.edit(row.id).url)
                },
                onDelete: (row) => {
                    setSelectedData(row);
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

    const { data, ...query } = useDataTableQuery<Product>(
        'products',
        productTableRoute.url(),
        {
            page,
            perPage: perPage,
            search,
            sort: sortParam,
        },
    );

    const selectedIds = Object.keys(rowSelection)
        .map((key) => data?.data[Number(key)]?.id)
        .filter(Boolean) as number[];

    return (
        <div className="flex grow flex-col gap-2 overflow-hidden">
            <div className="p-2">
                <DataTableToolbar
                    search={search}
                    selectedCount={selectedIds.length}
                    onSearchChange={(value) => {
                        setPage(1);
                        setSearch(value);
                    }}
                    onDelete={() => setIsBulkDeleteDialogOpen(true)}
                />
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

            <DeleteProductDialog
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
                }}
            />

            <BulkDeleteProductDialog
                isOpen={isBulkDeleteDialogOpen}
                onOpenChange={setIsBulkDeleteDialogOpen}
                selectedIds={selectedIds}
                onSuccess={() => {
                    setRowSelection({});
                    setIsBulkDeleteDialogOpen(false);
                    query.refetch();
                }}
            />
        </div>
    );
}

function DeleteProductDialog({
    selectedData,
    isOpen,
    onSuccess,
    onOpenChange,
}: {
    isOpen?: boolean;
    selectedData?: Product;
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
                    Are you sure you want to delete this product?
                </DialogTitle>
                <DialogDescription>
                    This action can not be revert, make sure there is no
                    transaction associated with this product
                </DialogDescription>
                <DialogDescription>
                    <span className="font-bold">{selectedData.code}</span> -{' '}
                    {selectedData.name}
                </DialogDescription>

                <Form
                    {...ProductController.destroy.form(selectedData.id)}
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
                                    Delete Product
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function BulkDeleteProductDialog({
    selectedIds,
    isOpen,
    onSuccess,
    onOpenChange,
}: {
    isOpen?: boolean;
    selectedIds?: number[];
    onSuccess?: () => void;
    onOpenChange: (open: boolean) => void;
}) {
    if (!selectedIds || selectedIds.length < 1) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>
                    Are you sure you want to delete this {selectedIds.length}{' '}
                    products?
                </DialogTitle>
                <DialogDescription>
                    This action can not be revert, make sure there is no
                    transaction associated with this products
                </DialogDescription>

                <Form
                    {...ProductController.bulkDestroy.form()}
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
                                    Delete Products
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
