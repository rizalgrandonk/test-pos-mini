import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { FormTransactionDiscount } from '@/components/transactions/FormTransactionDiscount';
import { AsyncSearchableSelect } from '@/components/ui/async-searchable-select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PriceInput from '@/components/ui/price-input';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import { searchProduct } from '@/lib/products';
import transactionRoutes from '@/routes/transactions';
import transactionDetailRoutes from '@/routes/transactions/detail';
import {
    TransactionDetail,
    TransactionDetailForm,
    TransactionHeader,
    type BreadcrumbItem,
} from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { FormEvent } from 'react';

export default function TransactionDetailEdit({
    transaction,
    transactionDetail,
}: {
    transaction: TransactionHeader;
    transactionDetail: TransactionDetail;
}) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Transactions',
            href: transactionRoutes.index().url,
        },
        {
            title: transaction.invoice_number,
            href: transactionRoutes.edit(transaction.id).url,
        },
        {
            title: 'Data Transaction Detail',
            href: transactionDetailRoutes.edit({
                header_id: transaction.id,
                id: transactionDetail.id,
            }).url,
        },
    ];

    const queryClient = useQueryClient();

    const form = useForm<TransactionDetailForm>({
        transaction_header_id: transaction.id,
        product_id: transactionDetail.product_id,
        price: transactionDetail.price,
        qty: transactionDetail.qty,
        discounts:
            transactionDetail.discounts?.map((d) => ({
                id: d.id,
                sequence: d.sequence,
                type: d.type,
                value: d.value,
            })) ?? [],
    });

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const url = transactionDetailRoutes.update.url({
            header_id: transaction.id,
            id: transactionDetail.id,
        });
        form.post(url, {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: [
                        transactionDetailRoutes.table(transaction.id).url,
                    ],
                });
            },
        });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Transaction Detail" />

            <div className="overflow-auto p-4">
                <Heading
                    title="Data Transaction Detail"
                    description="Data transaction detail"
                    className="mb-4"
                />

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-xl space-y-4"
                >
                    <div className="grid gap-1">
                        <Label htmlFor="invoice_date">Invoice Customer</Label>
                        <AsyncSearchableSelect
                            id="product_id"
                            name="product_id"
                            queryKey="categories_search"
                            searchFn={searchProduct}
                            getValue={(item) => item.id}
                            getLabel={(item) => `${item.name} - ${item.code}`}
                            placeholder="Select product"
                            searchPlaceholder="Search product..."
                            aria-invalid={!!form.errors.product_id}
                            value={form.data.product_id}
                            onChange={(val) =>
                                form.setData('product_id', Number(val))
                            }
                            onSelectedItem={(item) =>
                                form.setData('price', item.price)
                            }
                        />
                        <InputError message={form.errors.product_id} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="price">Price</Label>
                        <PriceInput
                            id="price"
                            className="block w-full"
                            name="price"
                            placeholder="0"
                            decimalSeparator=","
                            groupSeparator="."
                            aria-invalid={!!form.errors.price}
                            value={form.data.price ? `${form.data.price}` : ''}
                            onChange={(val) => {
                                if (typeof val === 'string') {
                                    const formattedValue =
                                        val
                                            .replaceAll('.', '')
                                            ?.replaceAll(',', '.') ?? '';
                                    form.setData(
                                        'price',
                                        Number(formattedValue),
                                    );
                                }
                            }}
                        />
                        <InputError message={form.errors.price} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="qty">Quantity</Label>
                        <Input
                            id="qty"
                            className="block w-full"
                            name="qty"
                            placeholder="Quantity"
                            aria-invalid={!!form.errors.qty}
                            value={form.data.qty}
                            onChange={(e) => {
                                const val = e.target.value.replace(
                                    /[^0-9]/g,
                                    '',
                                );
                                form.setData('qty', val ? Number(val) : '');
                            }}
                        />
                        <InputError message={form.errors.qty} />
                    </div>

                    <FormTransactionDiscount
                        discounts={form.data.discounts}
                        onChange={(discounts) =>
                            form.setData('discounts', discounts)
                        }
                        errors={form.errors.discounts}
                    />

                    <div className="flex items-center gap-4">
                        <Button disabled={form.processing} type="submit">
                            {form.processing && <Spinner />}
                            Save
                        </Button>

                        <Transition
                            show={form.recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
