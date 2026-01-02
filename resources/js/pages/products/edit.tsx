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
import { Product, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Form, Head } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';

export default function ProductsEdit({ product }: { product: Product }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Products',
            href: productRoutes.index().url,
        },
        {
            title: product.code,
            href: productRoutes.edit(product.id).url,
        },
    ];

    const queryClient = useQueryClient();

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Product ${product.code}`} />

            <div className="overflow-auto p-4">
                <Heading
                    title="Detail Product"
                    description={`Detail product ${product.code} - ${product.name}`}
                    className="mb-4"
                />

                <Form
                    {...ProductController.update.form(product.id)}
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
                                    defaultValue={product.name}
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
                                    defaultValue={product.code}
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
                                    defaultValue={product.price}
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
                                    defaultValue={product.stock}
                                    aria-invalid={!!errors.stock}
                                />
                                <InputError message={errors.stock} />
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
                                    <p className="text-sm text-neutral-600">
                                        Saved
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
