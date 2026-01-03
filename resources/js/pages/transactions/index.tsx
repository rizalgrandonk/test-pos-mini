import Heading from '@/components/heading';
import TransactionTable from '@/components/transactions/TransactionTable';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import transactinRoutes from '@/routes/transactions';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: transactinRoutes.index().url,
    },
];

export default function TransactionsList() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

            <div className="flex grow flex-col overflow-hidden p-4">
                <Heading
                    title="Data Transaction"
                    description="List of all your transactions"
                    className="mb-4"
                />

                <Card className="flex grow flex-col overflow-hidden p-0">
                    <CardContent className="flex grow flex-col overflow-hidden p-0">
                        <TransactionTable />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}