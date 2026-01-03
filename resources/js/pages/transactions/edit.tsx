import TransactionHeaderController from '@/actions/App/Http/Controllers/TransactionHeaderController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { AsyncSearchableSelect } from '@/components/ui/async-searchable-select';
import { Button } from '@/components/ui/button';
import DateInput from '@/components/ui/date-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { searchCustomer } from '@/lib/customers';
import transactionRoutes from '@/routes/transactions';
import { TransactionHeader, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';

export default function TransactionCreate({
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
            <Head title={`Detail Transaction ${transaction.invoice_number}`} />

            <div className="overflow-auto p-4">
                <Heading
                    title="Detail Transaction"
                    description={`Detail transaction ${transaction.invoice_number}`}
                    className="mb-4"
                />

                <TransactionEditForm transaction={transaction} />
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
                        <Label htmlFor="code">Invoice Number</Label>
                        <Input
                            id="code"
                            className="block w-full"
                            name="code"
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
