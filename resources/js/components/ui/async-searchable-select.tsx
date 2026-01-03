import { useQuery } from '@tanstack/react-query';
import { Check, ChevronsUpDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from '@/components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AsyncSearchableSelectProps<T> {
    value?: string | number;
    defaultValue?: string | number;
    onChange?: (value: string | number) => void;
    placeholder?: string;
    className?: string;
    id?: string;
    'aria-invalid'?: boolean;
    name?: string;
    searchPlaceholder?: string;
    disabled?: boolean;

    queryKey: string;
    searchFn: (query: string) => Promise<T[]>;

    getValue: (item: T) => string | number;
    getLabel: (item: T) => string;
}

export function AsyncSearchableSelect<T>({
    value,
    defaultValue,
    className,
    onChange,
    placeholder = 'Select option',
    searchPlaceholder = 'Search...',
    disabled,
    queryKey,
    searchFn,
    getValue,
    getLabel,
    ...props
}: AsyncSearchableSelectProps<T>) {
    const [currentValue, setCurrentValue] = useState<string | number>(
        value ?? defaultValue ?? '',
    );
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');

    const debouncedSearch = useDebounce(search);

    const searchTerm = !!debouncedSearch 
        ? debouncedSearch 
        : !!currentValue 
        ? currentValue.toString()
        : ""

    const { data = [], isFetching } = useQuery({
        queryKey: [queryKey, searchTerm],
        queryFn: () => searchFn(searchTerm),
        enabled: open || !!currentValue,
        staleTime: 30_000,
    });

    const selected = data.find((item) => getValue(item) === currentValue);

    return (
        <>
            <input type="hidden" {...props} value={currentValue} />
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn(
                            'justify-between text-left',
                            'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive/20 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40',
                            className,
                        )}
                        aria-invalid={props['aria-invalid']}
                    >
                        {selected ? getLabel(selected) : placeholder}
                        <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="end" className="w-80 p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            placeholder={searchPlaceholder}
                            value={search}
                            onValueChange={setSearch}
                        />

                        {isFetching && (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                                Searching...
                            </div>
                        )}

                        <CommandEmpty>No results found.</CommandEmpty>

                        <CommandGroup>
                            {data.map((item) => {
                                const itemValue = getValue(item);

                                return (
                                    <CommandItem
                                        key={itemValue}
                                        onSelect={() => {
                                            onChange?.(itemValue);
                                            setCurrentValue(itemValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <Check
                                            className={cn(
                                                'mr-2 h-4 w-4',
                                                itemValue === currentValue
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                        {getLabel(item)}
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </>
    );
}
