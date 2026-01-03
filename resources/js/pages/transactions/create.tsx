import TransactionHeaderController from '@/actions/App/Http/Controllers/TransactionHeaderController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { AsyncSearchableSelect } from '@/components/ui/async-searchable-select';
import { Button } from '@/components/ui/button';
import DateInput from '@/components/ui/date-input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { searchCustomer } from '@/lib/customers';
import transactionRoutes from '@/routes/transactions';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: transactionRoutes.index().url,
    },
    {
        title: 'Create Trannsaction',
        href: transactionRoutes.create().url,
    },
];

export default function TransactionCreate() {
    const queryClient = useQueryClient();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Transaction" />

            <div className="overflow-auto p-4">
                <Heading
                    title="Create Transaction"
                    description="Create transaction data"
                    className="mb-4"
                />

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
                                <Label htmlFor="invoice_date">
                                    Invoice Date
                                </Label>
                                <DateInput
                                    id="invoice_date"
                                    name="invoice_date"
                                    className="w-full"
                                    placeholder="Invoice Date"
                                    aria-invalid={!!errors.invoice_date}
                                />
                                <InputError message={errors.invoice_date} />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="invoice_date">
                                    Invoice Customer
                                </Label>
                                <AsyncSearchableSelect
                                    id="customer_id"
                                    name="customer_id"
                                    queryKey="categories_search"
                                    searchFn={searchCustomer}
                                    getValue={(item) => item.id}
                                    getLabel={(item) =>
                                        `${item.name} - ${item.code}`
                                    }
                                    placeholder="Select customer"
                                    searchPlaceholder="Search customer..."
                                    aria-invalid={!!errors.customer_id}
                                />
                                <InputError message={errors.customer_id} />
                            </div>

                            <div className="flex items-center gap-4">
                                <Button disabled={processing} type="submit">
                                    {processing && <Spinner />}
                                    Create
                                </Button>

                                <Transition
                                    show={recentlySuccessful}
                                    enter="transition ease-in-out"
                                    enterFrom="opacity-0"
                                    leave="transition ease-in-out"
                                    leaveTo="opacity-0"
                                >
                                    <p className="text-sm text-neutral-600">
                                        Created
                                    </p>
                                </Transition>
                            </div>
                        </>
                    )}
                </Form>
            </div>
        </AppLayout>
    );
}
