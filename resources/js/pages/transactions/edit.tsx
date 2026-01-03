import TransactionHeaderController from '@/actions/App/Http/Controllers/TransactionHeaderController';
import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import DetailTransactionTable from '@/components/transactions/TransactionDetailTable';
import { AsyncSearchableSelect } from '@/components/ui/async-searchable-select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import DateInput from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { searchCustomer } from '@/lib/customers';
import { formatCurrency } from '@/lib/utils';
import transactionRoutes from '@/routes/transactions';
import { TransactionHeader, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';

export default function TransactionEdit({
    transaction,
}: {
    transaction: TransactionHeader;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transactions',
            href: transactionRoutes.index().url,
        },
        {
            title: transaction.invoice_number,
            href: transactionRoutes.create().url,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head
                title={`Data Transaction Header ${transaction.invoice_number}`}
            />

            <div className="flex grow flex-col overflow-hidden p-4">
                <Heading
                    title="Data Transaction Header"
                    description={`Data transaction header ${transaction.invoice_number}`}
                    className="mb-4"
                />

                <TransactionEditForm transaction={transaction} />

                <div className="mt-8 flex grow flex-col overflow-hidden gap-2">
                    <HeadingSmall
                        title="Transaction Details"
                        description={`List transaction details for ${transaction.invoice_number}`}
                    />
                    <Card className="flex grow flex-col overflow-hidden p-0">
                        <CardContent className="flex grow flex-col overflow-hidden p-0">
                            <DetailTransactionTable transaction={transaction} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

function TransactionEditForm({
    transaction,
}: {
    transaction: TransactionHeader;
}) {
    const queryClient = useQueryClient();

    return (
        <Form
            {...TransactionHeaderController.store.form()}
            options={{
                preserveScroll: true,
            }}
            onSuccess={() => {
                queryClient.invalidateQueries({
                    queryKey: ['transactions'],
                });
            }}
            className="w-full max-w-xl space-y-4"
        >
            {({ processing, recentlySuccessful, errors }) => (
                <>
                    <div className="grid gap-1">
                        <Label htmlFor="invoice_number">Invoice Number</Label>
                        <Input
                            id="invoice_number"
                            className="block w-full"
                            name="invoice_number"
                            placeholder="Invoice Number"
                            defaultValue={transaction.invoice_number}
                            disabled
                            readOnly
                            aria-invalid={!!errors.invoice_number}
                        />
                        <InputError message={errors.invoice_number} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="invoice_date">Invoice Date</Label>
                        <DateInput
                            id="invoice_date"
                            className="w-full"
                            name="invoice_date"
                            placeholder="Invoice Date"
                            defaultValue={transaction.invoice_date}
                            aria-invalid={!!errors.invoice_date}
                        />
                        <InputError message={errors.invoice_date} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="invoice_date">Invoice Customer</Label>
                        <AsyncSearchableSelect
                            id="customer_id"
                            name="customer_id"
                            queryKey="categories_search"
                            searchFn={searchCustomer}
                            getValue={(item) => item.id}
                            getLabel={(item) => `${item.name} - ${item.code}`}
                            placeholder="Select customer"
                            searchPlaceholder="Search customer..."
                            defaultValue={transaction.customer_id}
                            aria-invalid={!!errors.customer_id}
                        />
                        <InputError message={errors.customer_id} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="total">Total</Label>
                        <Input
                            id="total"
                            className="block w-full"
                            name="total"
                            placeholder="Total"
                            defaultValue={formatCurrency(transaction.total)}
                            disabled
                            readOnly
                            aria-invalid={!!errors.total}
                        />
                        <InputError message={errors.total} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={processing} type="submit">
                            {processing && <Spinner />}
                            Save
                        </Button>

                        <Transition
                            show={recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </>
            )}
        </Form>
    );
}
