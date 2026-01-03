import { DiscountTypeEnum } from '@/lib/transactions';
import { DiscountForm } from '@/types';
import { TrashIcon } from 'lucide-react';
import HeadingSmall from '../heading-small';
import { Button } from '../ui/button';
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '../ui/input-group';
import PriceInput from '../ui/price-input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select';

type FormTransactionDiscountProps = {
    discounts: DiscountForm[];
    onChange: (value: DiscountForm[]) => void;
    errors?: any;
};

export function FormTransactionDiscount({
    discounts,
    onChange,
}: FormTransactionDiscountProps) {
    const lastDiscount = discounts[discounts.length - 1];
    const lastDiscountValid =
        discounts.length < 1 ||
        (!!lastDiscount && !!lastDiscount.type && !!lastDiscount.value);

    const addDiscount = () => {
        if (!lastDiscountValid) {
            return;
        }
        onChange([
            ...discounts,
            {
                sequence: discounts.length + 1,
                type: DiscountTypeEnum.Percentage,
                value: '',
            },
        ]);
    };

    const update = (index: number, patch: Partial<DiscountForm>) => {
        const next = [...discounts];
        next[index] = { ...next[index], ...patch };
        onChange(next);
    };

    const remove = (index: number) => {
        onChange(
            discounts
                .filter((_, i) => i !== index)
                .map((d, i) => ({ ...d, sequence: i + 1 })),
        );
    };

    return (
        <div className="space-y-2 py-2">
            <div className="flex items-end justify-between">
                <HeadingSmall
                    title="Discounts"
                    description={
                        discounts.length === 0
                            ? 'No discounts applied'
                            : 'Apply discounts'
                    }
                />
                <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={addDiscount}
                >
                    Add Discount
                </Button>
            </div>

            {discounts.map((discount, index) => (
                <DiscountRow
                    key={discount.id ?? index}
                    discount={discount}
                    onChange={(patch) => update(index, patch)}
                    onRemove={() => remove(index)}
                />
            ))}
        </div>
    );
}

function DiscountRow({
    discount,
    onChange,
    onRemove,
}: {
    discount: DiscountForm;
    onChange: (patch: Partial<DiscountForm>) => void;
    onRemove: () => void;
}) {
    return (
        <div className="grid grid-cols-[120px_1fr_40px] items-center gap-2">
            <Select
                value={discount.type}
                onValueChange={(val) => onChange({ type: val as any })}
            >
                <SelectTrigger>
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value={DiscountTypeEnum.Percentage}>
                        %
                    </SelectItem>
                    <SelectItem value={DiscountTypeEnum.Amount}>
                        Amount
                    </SelectItem>
                </SelectContent>
            </Select>

            {discount.type === DiscountTypeEnum.Amount ? (
                <PriceInput
                    placeholder="0"
                    decimalSeparator=","
                    groupSeparator="."
                    value={discount.value ? `${discount.value}` : ''}
                    onChange={(val) => {
                        if (typeof val === 'string') {
                            const formattedValue =
                                val.replaceAll('.', '')?.replaceAll(',', '.') ??
                                '';
                            onChange({
                                value: formattedValue
                                    ? Number(formattedValue)
                                    : '',
                            });
                        }
                    }}
                />
            ) : (
                <InputGroup>
                    <InputGroupInput
                        placeholder="Value"
                        value={discount.value}
                        onChange={(e) => {
                            const val = e.target.value.replace(/[^0-9]/g, '');
                            onChange({ value: val ? Number(val) : '' });
                        }}
                    />
                    <InputGroupAddon align="inline-end">
                        <InputGroupText>%</InputGroupText>
                    </InputGroupAddon>
                </InputGroup>
            )}

            <Button
                type="button"
                size="icon"
                variant="ghost"
                className="text-destructive"
                onClick={onRemove}
            >
                <TrashIcon className="h-4 w-4" />
            </Button>
        </div>
    );
}
