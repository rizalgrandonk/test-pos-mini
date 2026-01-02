import ProductController from '@/actions/App/Http/Controllers/ProductController';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PriceInput from '@/components/ui/price-input';
import { Spinner } from '@/components/ui/spinner';
import AppLayout from '@/layouts/app-layout';
import productRoutes from '@/routes/products';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: productRoutes.index().url,
    },
    {
        title: 'Create Product',
        href: productRoutes.create().url,
    },
];

export default function ProductsCreate() {
    const queryClient = useQueryClient();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />

            <div className="overflow-auto p-4">
                <Heading
                    title="Create Product"
                    description="Create product data"
                    className="mb-4"
                />

                <Form
                    {...ProductController.store.form()}
                    options={{
                        preserveScroll: true,
                    }}
                    transform={(data) => ({
                        ...data,
                        price:
                            data.price
                                ?.toString()
                                ?.replaceAll('.', '')
                                ?.replaceAll(',', '.') ?? '',
                    })}
                    onSuccess={() => {
                        queryClient.invalidateQueries({
                            queryKey: ['products'],
                        });
                    }}
                    className="w-full max-w-xl space-y-4"
                >
                    {({ processing, recentlySuccessful, errors }) => (
                        <>
                            <div className="grid gap-1">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    className="block w-full"
                                    name="name"
                                    placeholder="Product Name"
                                    aria-invalid={!!errors.name}
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    className="block w-full"
                                    name="code"
                                    placeholder="Product Code"
                                    aria-invalid={!!errors.code}
                                />
                                <InputError message={errors.code} />
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
                                    aria-invalid={!!errors.price}
                                />
                                <InputError message={errors.price} />
                            </div>

                            <div className="grid gap-1">
                                <Label htmlFor="stock">Stock</Label>
                                <Input
                                    id="stock"
                                    className="block w-full"
                                    name="stock"
                                    placeholder="0"
                                    aria-invalid={!!errors.stock}
                                />
                                <InputError message={errors.stock} />
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
