import CustomerController from '@/actions/App/Http/Controllers/CustomerController';
import { useDataTableQuery } from '@/hooks/use-data-table-query';
import { formatCurrency } from '@/lib/utils';
import customerRoutes from '@/routes/customer';
import { Customer } from '@/types';
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

const columns: ColumnDef<Customer>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
    },
    {
        accessorKey: 'name',
        header: 'Name',
    },
    {
        accessorKey: 'village',
        header: 'Vilage',
    },
    {
        accessorKey: 'district',
        header: 'District',
    },
    {
        accessorKey: 'regency',
        header: 'Regency',
    },
    {
        accessorKey: 'province',
        header: 'Province',
    },
    {
        accessorKey: 'postal_code',
        header: 'Postal Code',
    },
];

export default function CustomerTable() {
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(20);
    const [search, setSearch] = useState('');
    const [sorting, setSorting] = useState<SortingState>([]);
    const [rowSelection, setRowSelection] = useState({});
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<Customer | undefined>(
        undefined,
    );

    const tableColumns = useMemo(
        () => [
            selectColumn<Customer>(),
            ...columns,
            actionsColumn<Customer>({
                onEdit: (row) => {
                    router.visit(customerRoutes.edit(row.id).url);
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

    const { data, ...query } = useDataTableQuery<Customer>(
        'customers',
        customerRoutes.table.url(),
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
                        <Link href={customerRoutes.create().url}>
                            <PlusIcon /> Add New Customer
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
                }}
            />

            <BulkDeleteDialog
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

function DeleteDialog({
    selectedData,
    isOpen,
    onSuccess,
    onOpenChange,
}: {
    isOpen?: boolean;
    selectedData?: Customer;
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
                    Are you sure you want to delete this customer?
                </DialogTitle>
                <DialogDescription>
                    This action can not be revert, make sure there is no
                    transaction associated with this customer
                </DialogDescription>
                <DialogDescription>
                    <span className="font-bold">{selectedData.code}</span> -{' '}
                    {selectedData.name}
                </DialogDescription>

                <Form
                    {...CustomerController.destroy.form(selectedData.id)}
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
                    customers?
                </DialogTitle>
                <DialogDescription>
                    This action can not be revert, make sure there is no
                    transaction associated with this customers
                </DialogDescription>

                <Form
                    {...CustomerController.bulkDestroy.form()}
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
