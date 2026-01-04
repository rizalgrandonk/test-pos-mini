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
    MonthlyRevenue,
    TopCustomer,
    TopProduct,
    type BreadcrumbItem,
} from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from '@/components/ui/chart';
import { format, parse } from 'date-fns';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

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
    monthlyRevenue,
}: {
    stats: DashboardStats;
    topCustomers: TopCustomer[];
    topProducts: TopProduct[];
    monthlyRevenue: MonthlyRevenue[];
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
                <div>
                    <MonthlyRevenueChart data={monthlyRevenue} />
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

export function MonthlyRevenueChart({ data }: { data: MonthlyRevenue[] }) {
    console.log({ data });
    return (
        <Card>
            <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>
                    This is total montly revenue for the last 6 months{' '}
                </CardDescription>
            </CardHeader>

            <CardContent>
                <ChartContainer
                    config={{
                        total: {
                            label: 'Tootal',
                            color: 'var(--chart-1)',
                        },
                    }}
                    className="aspect-auto h-[350px] w-full"
                >
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient
                                id="fillTotal"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-total)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-total)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={4}
                            minTickGap={4}
                            interval="preserveStartEnd"
                            tickFormatter={(value) => {
                                return format(
                                    parse(value, 'yyyy-MM', new Date()),
                                    'MMM yyyy',
                                );
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return format(
                                            parse(value, 'yyyy-MM', new Date()),
                                            'MMM yyyy',
                                        );
                                    }}
                                    formatter={(value) =>
                                        formatCurrency(Number(value))
                                    }
                                    indicator="dot"
                                />
                            }
                        />
                        <Area
                            dataKey="total"
                            type="natural"
                            fill="url(#fillTotal)"
                            stroke="var(--color-total)"
                            stackId="a"
                        />
                        {/* <ChartLegend content={<ChartLegendContent />} /> */}
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
