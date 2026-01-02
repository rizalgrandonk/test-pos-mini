import CustomerTable from '@/components/customers/CustomerTable';
import Heading from '@/components/heading';
import ProductTable from '@/components/products/ProductTable';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import customerRoutes from '@/routes/customer';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Customers',
        href: customerRoutes.index().url,
    },
];

export default function CustomerList() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="flex grow flex-col overflow-hidden p-4">
                <Heading
                    title="Data Customer"
                    description="List of all your customers"
                    className="mb-4"
                />

                <Card className="flex grow flex-col overflow-hidden p-0">
                    <CardContent className="flex grow flex-col overflow-hidden p-0">
                        <CustomerTable />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
