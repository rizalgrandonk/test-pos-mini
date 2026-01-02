import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useLocationsQuery } from '@/hooks/use-locations-query';
import AppLayout from '@/layouts/app-layout';
import customerRoutes from '@/routes/customer';
import { Customer, type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { useQueryClient } from '@tanstack/react-query';
import { FormEvent } from 'react';

export default function CustomerEdit({ customer }: { customer: Customer }) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Customers',
            href: customerRoutes.index().url,
        },
        {
            title: customer.code,
            href: customerRoutes.create().url,
        },
    ];

    const queryClient = useQueryClient();

    const form = useForm({
        name: customer.name,
        code: customer.code,
        province: customer.province ?? '',
        regency: customer.regency ?? '',
        district: customer.district ?? '',
        village: customer.village ?? '',
        province_id: customer.province_id?.toString() ?? '',
        regency_id: customer.regency_id?.toString() ?? '',
        district_id: customer.district_id?.toString() ?? '',
        village_id: customer.village_id?.toString() ?? '',
        address: customer.address ?? '',
        postal_code: customer.postal_code ?? '',
    });

    const {
        provinceQuery,
        provinceOptions,
        provinceMap,
        regencyQuery,
        regencyOptions,
        regencyMap,
        districtQuery,
        districtOptions,
        districtMap,
        villageQuery,
        villageOptions,
        villageMap,
        postalCodeQuery,
        postalCodeOptions,
    } = useLocationsQuery({
        selectedProvinceId: form.data.province_id,
        selectedRegencyId: form.data.regency_id,
        selectedDistrictId: form.data.district_id,
    });

    function onChangeLocation(
        key: 'province' | 'regency' | 'district' | 'village',
        val: string,
    ) {
        const optionsMap = {
            province: provinceMap,
            regency: regencyMap,
            district: districtMap,
            village: villageMap,
        };

        const textVal = optionsMap[key][val];

        if (!val || !textVal) {
            return;
        }
        form.setData(`${key}_id`, val);
        form.setData(key, textVal);

        if (key === 'province' || key === 'regency' || key === 'district') {
            form.setData('village_id', '');
            form.setData('village', '');
        }
        if (key === 'province' || key === 'regency') {
            form.setData('district_id', '');
            form.setData('district', '');
        }
        if (key === 'province') {
            form.setData('regency_id', '');
            form.setData('regency', '');
        }
    }

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        form.post(customerRoutes.update.url(customer.id));

        queryClient.invalidateQueries({ queryKey: ['customers'] });
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Detail Customer ${customer.code}`} />

            <div className="overflow-auto p-4">
                <Heading
                    title="Detail Customer"
                    description={`Detail customer ${customer.code} - ${customer.name}`}
                    className="mb-4"
                />

                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-xl space-y-4"
                >
                    <div className="grid gap-1">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            className="block w-full"
                            name="name"
                            placeholder="Customer Name"
                            aria-invalid={!!form.errors.name}
                            value={form.data.name}
                            onChange={(e) =>
                                form.setData('name', e.target.value)
                            }
                        />
                        <InputError message={form.errors.name} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="code">Code</Label>
                        <Input
                            id="code"
                            className="block w-full"
                            name="code"
                            placeholder="Customer Code"
                            aria-invalid={!!form.errors.code}
                            value={form.data.code}
                            onChange={(e) =>
                                form.setData('code', e.target.value)
                            }
                        />
                        <InputError message={form.errors.code} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="province_id">Province</Label>
                        <Select
                            value={form.data.province_id}
                            disabled={provinceQuery.isLoading}
                            onValueChange={(val) =>
                                onChangeLocation('province', val)
                            }
                        >
                            <SelectTrigger id="province_id">
                                <SelectValue
                                    placeholder={
                                        provinceQuery.isLoading
                                            ? 'Locading...'
                                            : 'Select Province'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {provinceOptions.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.text}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.province_id} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="regency_id">Regency</Label>
                        <Select
                            value={form.data.regency_id}
                            disabled={regencyQuery.isLoading}
                            onValueChange={(val) =>
                                onChangeLocation('regency', val)
                            }
                        >
                            <SelectTrigger id="regency_id">
                                <SelectValue
                                    placeholder={
                                        regencyQuery.isLoading
                                            ? 'Locading...'
                                            : 'Select Regency'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {regencyOptions.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.text}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.regency_id} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="district_id">District</Label>
                        <Select
                            value={form.data.district_id}
                            disabled={districtQuery.isLoading}
                            onValueChange={(val) =>
                                onChangeLocation('district', val)
                            }
                        >
                            <SelectTrigger id="district_id">
                                <SelectValue
                                    placeholder={
                                        districtQuery.isLoading
                                            ? 'Locading...'
                                            : 'Select District'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {districtOptions.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.text}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.district_id} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="village_id">Village</Label>
                        <Select
                            value={form.data.village_id}
                            disabled={villageQuery.isLoading}
                            onValueChange={(val) =>
                                onChangeLocation('village', val)
                            }
                        >
                            <SelectTrigger id="village_id">
                                <SelectValue
                                    placeholder={
                                        villageQuery.isLoading
                                            ? 'Locading...'
                                            : 'Select Village'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {villageOptions.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.text}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.village_id} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="postal_code">Postal Code</Label>
                        <Select
                            value={form.data.postal_code}
                            disabled={postalCodeQuery.isLoading}
                            onValueChange={(val) =>
                                form.setData('postal_code', val)
                            }
                        >
                            <SelectTrigger id="postal_code">
                                <SelectValue
                                    placeholder={
                                        postalCodeQuery.isLoading
                                            ? 'Locading...'
                                            : 'Select Postal Code'
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {postalCodeOptions.map((item) => (
                                    <SelectItem key={item.id} value={item.text}>
                                        {item.text}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <InputError message={form.errors.postal_code} />
                    </div>

                    <div className="grid gap-1">
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                            id="address"
                            className="block w-full"
                            name="address"
                            placeholder="Customer Address"
                            aria-invalid={!!form.errors.address}
                            value={form.data.address}
                            onChange={(e) =>
                                form.setData('address', e.target.value)
                            }
                        />
                        <InputError message={form.errors.address} />
                    </div>

                    <div className="flex items-center gap-4">
                        <Button disabled={form.processing} type="submit">
                            {form.processing && <Spinner />}
                            Save
                        </Button>

                        <Transition
                            show={form.recentlySuccessful}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Saved</p>
                        </Transition>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
