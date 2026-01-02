import Heading from '@/components/heading';
import ProductTable from '@/components/products/ProductTable';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { index as productIndex } from '@/routes/products';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: productIndex().url,
    },
];

export default function ProductsList() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="flex grow flex-col overflow-hidden p-4">
                <Heading
                    title="Data Product"
                    description="List of all your products"
                    className="mb-4"
                />

                <Card className="flex grow flex-col overflow-hidden p-0">
                    <CardContent className="flex grow flex-col overflow-hidden p-0">
                        <ProductTable />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
