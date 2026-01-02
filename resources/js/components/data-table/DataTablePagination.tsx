import { Button } from '@/components/ui/button';
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

interface Props {
    page: number;
    lastPage: number;
    perPage: number;
    delta?: number;
    onPageChange: (page: number) => void;
    onPerPageChange?: (perPage: number) => void;
}

const PER_PAGE_OPTIONS = [20, 50, 100]

export function DataTablePagination({
    page,
    lastPage,
    perPage,
    delta = 2,
    onPageChange,
    onPerPageChange,
}: Props) {
    const pages = getPaginationRange(page, lastPage, delta);

    return (
        <div className="flex items-center justify-between gap-4">
            {onPerPageChange && (
                <div className="flex items-center gap-2 text-sm">
                    <span>Rows per page</span>
                    <Select
                        value={String(perPage)}
                        onValueChange={(v) => onPerPageChange(Number(v))}
                    >
                        <SelectTrigger className="w-[80px] h-8">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PER_PAGE_OPTIONS.map((size) => (
                                <SelectItem key={size} value={String(size)}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => onPageChange(1)}
                >
                    <ChevronsLeftIcon />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === 1}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeftIcon />
                </Button>

                {pages.map((p, i) =>
                    p === '...' ? (
                        <span
                            key={i}
                            className="px-2 text-sm text-muted-foreground"
                        >
                            …
                        </span>
                    ) : (
                        <Button
                            key={i}
                            variant={p === page ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => onPageChange(Number(p))}
                        >
                            {p}
                        </Button>
                    ),
                )}

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === lastPage}
                    onClick={() => onPageChange(page + 1)}
                >
                    <ChevronRightIcon />
                </Button>

                <Button
                    variant="outline"
                    size="sm"
                    disabled={page === lastPage}
                    onClick={() => onPageChange(lastPage)}
                >
                    <ChevronsRightIcon />
                </Button>
            </div>
        </div>
    );
}

function getPaginationRange(current: number, total: number, delta = 2) {
    const range: (number | string)[] = [];
    const left = Math.max(2, current - delta);
    const right = Math.min(total - 1, current + delta);

    range.push(1);

    if (left > 2) range.push('...');

    for (let i = left; i <= right; i++) {
        range.push(i);
    }

    if (right < total - 1) range.push('...');

    if (total > 1) range.push(total);

    return range;
}
