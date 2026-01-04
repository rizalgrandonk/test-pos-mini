import { DataTable } from '@/components/data-table/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { cn, formatCurrency } from '@/lib/utils';
import { dashboard } from '@/routes';
import customerRoutes from '@/routes/customer';
import productRoutes from '@/routes/products';
import {
    DashboardStats,
    TopCustomer,
    TopProduct,
    type BreadcrumbItem,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard({
    stats,
    topCustomers,
    topProducts,
}: {
    stats: DashboardStats;
    topCustomers: TopCustomer[];
    topProducts: TopProduct[];
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        title="Total Revenue"
                        value={stats.monthlyRevenue}
                        formatValue={(val) => formatCurrency(Number(val))}
                        subtitle="Trending this month"
                        description="Compared to last month"
                        trend={{
                            value: stats.revenueGrowth,
                            label: 'Revenue growth',
                        }}
                    />
                    <StatCard
                        title="Transactions"
                        value={stats.monthlyTransactions}
                        subtitle="This month"
                        description="All completed invoices"
                    />
                    <StatCard
                        title="New Customers"
                        value={stats.newCustomers}
                        subtitle="This month"
                        description="Compared to last month"
                        trend={{
                            value: stats.customerGrowth,
                            label: 'Customer growth',
                        }}
                    />
                    <StatCard
                        title="Low Stock Items"
                        value={stats.lowStock}
                        subtitle="Needs attention"
                        description="Below minimum stock (20)"
                    />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                    <TopCustomersTable data={topCustomers} />
                    <TopProductsTable data={topProducts} />
                </div>
            </div>
        </AppLayout>
    );
}

type StatCardProps = {
    title: string;
    value: string | number;
    subtitle?: string;
    description?: string;
    trend?: {
        value: number;
        label: string;
    };
    formatValue?: (val: string | number) => string | number;
};

function StatCard({
    title,
    value,
    subtitle,
    description,
    trend,
    formatValue,
}: StatCardProps) {
    const isPositive = (trend?.value ?? 0) >= 0;

    return (
        <Card>
            <CardHeader>
                <CardDescription>{title}</CardDescription>
                <CardTitle className="text-3xl font-semibold tabular-nums">
                    {formatValue ? formatValue(value) : value}
                </CardTitle>
                {trend && (
                    <CardAction>
                        <Badge variant="outline">
                            {isPositive ? (
                                <TrendingUpIcon />
                            ) : (
                                <TrendingDownIcon />
                            )}
                            {Math.abs(trend.value)}%
                        </Badge>
                    </CardAction>
                )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
                {subtitle && (
                    <div className="line-clamp-1 flex gap-2 font-medium">
                        {subtitle}
                    </div>
                )}
                {description && (
                    <div className="text-muted-foreground">{description}</div>
                )}
            </CardFooter>
        </Card>
    );
}

const topCustomerColumns: ColumnDef<TopCustomer>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
        enableSorting: false,
        cell: ({ row }) => (
            <Button variant="link" size="sm" asChild>
                <Link href={customerRoutes.edit(row.original.id).url}>
                    {row.original.code}
                </Link>
            </Button>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Customer',
        enableSorting: false,
        cell: ({ row }) => (
            <Button variant="link" size="sm" asChild>
                <Link href={customerRoutes.edit(row.original.id).url}>
                    {row.original.name}
                </Link>
            </Button>
        ),
    },
    {
        accessorKey: 'transactions_count',
        header: 'Transactions',
        enableSorting: false,
    },
    {
        accessorKey: 'total_spent',
        header: 'Total Spent',
        enableSorting: false,
        cell: ({ row }) => formatCurrency(row.original.total_spent),
    },
];

function TopCustomersTable({
    data,
    className,
}: {
    data: TopCustomer[];
    className?: string;
}) {
    return (
        <Card className={cn('gap-4 p-0 py-4', className)}>
            <CardHeader className="px-4">
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>This month and last month</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <DataTable
                    stickyHeader={false}
                    pageCount={1}
                    columns={topCustomerColumns}
                    data={data}
                    sorting={[]}
                    rowSelection={{}}
                    onSortingChange={() => undefined}
                    onRowSelectionChange={() => undefined}
                />
            </CardContent>
        </Card>
    );
}

const topProductColumns: ColumnDef<TopProduct>[] = [
    {
        accessorKey: 'code',
        header: 'Code',
        enableSorting: false,
        cell: ({ row }) => (
            <Button variant="link" size="sm" asChild>
                <Link href={productRoutes.edit(row.original.id).url}>
                    {row.original.code}
                </Link>
            </Button>
        ),
    },
    {
        accessorKey: 'name',
        header: 'Product',
        enableSorting: false,
        cell: ({ row }) => (
            <Button variant="link" size="sm" asChild>
                <Link href={productRoutes.edit(row.original.id).url}>
                    {row.original.name}
                </Link>
            </Button>
        ),
    },
    {
        accessorKey: 'total_qty',
        header: 'Total Sold',
        enableSorting: false,
    },
    {
        accessorKey: 'total_revenue',
        header: 'Total Revenue',
        enableSorting: false,
        cell: ({ row }) => formatCurrency(row.original.total_revenue),
    },
];

function TopProductsTable({
    data,
    className,
}: {
    data: TopProduct[];
    className?: string;
}) {
    return (
        <Card className={cn('gap-4 p-0 py-4', className)}>
            <CardHeader className="px-4">
                <CardTitle>Top Products</CardTitle>
                <CardDescription>This month and last month</CardDescription>
            </CardHeader>

            <CardContent className="p-0">
                <DataTable
                    stickyHeader={false}
                    pageCount={1}
                    columns={topProductColumns}
                    data={data}
                    sorting={[]}
                    rowSelection={{}}
                    onSortingChange={() => undefined}
                    onRowSelectionChange={() => undefined}
                />
            </CardContent>
        </Card>
    );
}
