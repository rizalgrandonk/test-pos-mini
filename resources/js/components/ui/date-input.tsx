import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns/format';
import { formatISO } from 'date-fns/formatISO';
import { Calendar1Icon } from 'lucide-react';
import { ComponentProps, useState } from 'react';
import { Calendar } from './calendar';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

type DateInputProps = ComponentProps<'input'> & {
    value?: string;
    defaultValue?: string;
    onChange?: (value?: string) => void;
    onBlur?: () => void;
    className?: string;
    placeholder?: string;
};

export default function DateInput({
    value,
    onChange = () => undefined,
    onBlur = () => undefined,
    className,
    placeholder,
    defaultValue,
    ...props
}: DateInputProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentValue, setCurrentValue] = useState<string>(value ?? defaultValue ?? "")

    const dateValue = !!currentValue ? new Date(currentValue) : undefined;

    return (
        <>
            <input type="hidden" {...props} value={currentValue} />
            <Popover
                open={isOpen}
                onOpenChange={(open) => {
                    setIsOpen(open);
                    if (!open) {
                        onBlur();
                    }
                }}
            >
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        className={cn(
                            'text-left justify-between',
                            "has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[[data-slot][aria-invalid=true]]:border-destructive dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40",
                            className
                        )}
                        aria-invalid={props['aria-invalid']}
                    >
                        {currentValue ? format(currentValue, 'dd MMM yyyy') : placeholder}
                        <Calendar1Icon className="opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto overflow-hidden p-0"
                    align="start"
                >
                    <Calendar
                        mode="single"
                        defaultMonth={dateValue}
                        selected={dateValue}
                        captionLayout="dropdown"
                        onSelect={(val) => {
                            if (!val) {
                                onChange('');
                                setCurrentValue("")
                                return 
                            }
                            const stringVal = formatISO(val);
                            setCurrentValue(stringVal);
                            onChange(stringVal);
                            return 
                        }}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}
