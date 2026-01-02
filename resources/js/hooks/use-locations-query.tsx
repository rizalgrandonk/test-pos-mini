import locationRoutes from '@/routes/customer/location';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useMemo } from 'react';

interface Params {
    selectedProvinceId: string | number | null;
    selectedRegencyId: string | number | null;
    selectedDistrictId: string | number | null;
}

type LocationsResponseData = {
    id: string;
    text: string;
};

export function useLocationsQuery(params: Params) {
    const provinceQuery = useQuery({
        queryKey: ['province'],
        queryFn: async () => {
            const { data } = await axios.get<LocationsResponseData[]>(
                locationRoutes.province.url(),
            );
            return data;
        },
    });

    const regencyQuery = useQuery({
        queryKey: ['regencies', params.selectedProvinceId],
        queryFn: async () => {
            const { data } = await axios.get<LocationsResponseData[]>(
                locationRoutes.regency.url(),
                { params: { province_id: params.selectedProvinceId } },
            );
            return data;
        },
        enabled: !!params.selectedProvinceId,
    });

    const districtQuery = useQuery({
        queryKey: ['districts', params.selectedRegencyId],
        queryFn: async () => {
            const { data } = await axios.get<LocationsResponseData[]>(
                locationRoutes.district.url(),
                { params: { regency_id: params.selectedRegencyId } },
            );
            return data;
        },
        enabled: !!params.selectedRegencyId,
    });

    const villageQuery = useQuery({
        queryKey: ['villages', params.selectedDistrictId],
        queryFn: async () => {
            const { data } = await axios.get<LocationsResponseData[]>(
                locationRoutes.village.url(),
                { params: { district_id: params.selectedDistrictId } },
            );
            return data;
        },
        enabled: !!params.selectedDistrictId,
    });

    const postalCodeQuery = useQuery({
        queryKey: [
            'postal_codes',
            params.selectedRegencyId,
            params.selectedDistrictId,
        ],
        queryFn: async () => {
            const { data } = await axios.get<LocationsResponseData[]>(
                locationRoutes.postalCode.url(),
                {
                    params: {
                        regency_id: params.selectedRegencyId,
                        district_id: params.selectedDistrictId,
                    },
                },
            );
            return data;
        },
        enabled: !!params.selectedRegencyId && !!params.selectedDistrictId,
    });

    const { provinceOptions, provinceMap } = useMemo(() => {
        const provinceOptions = provinceQuery.data ?? [];
        const provinceMap = provinceOptions.reduce(
            (acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr.text,
                };
            },
            {} as Record<string, string>,
        );

        return { provinceOptions, provinceMap };
    }, [regencyQuery.data]);
    const { regencyOptions, regencyMap } = useMemo(() => {
        const regencyOptions = regencyQuery.data ?? [];
        const regencyMap = regencyOptions.reduce(
            (acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr.text,
                };
            },
            {} as Record<string, string>,
        );

        return { regencyOptions, regencyMap };
    }, [regencyQuery.data]);
    const { districtOptions, districtMap } = useMemo(() => {
        const districtOptions = districtQuery.data ?? [];
        const districtMap = districtOptions.reduce(
            (acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr.text,
                };
            },
            {} as Record<string, string>,
        );

        return { districtOptions, districtMap };
    }, [districtQuery.data]);
    const { villageOptions, villageMap } = useMemo(() => {
        const villageOptions = villageQuery.data ?? [];
        const villageMap = villageOptions.reduce(
            (acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr.text,
                };
            },
            {} as Record<string, string>,
        );

        return { villageOptions, villageMap };
    }, [villageQuery.data]);
    const { postalCodeOptions, postalCodeMap } = useMemo(() => {
        const postalCodeOptions = postalCodeQuery.data ?? [];
        const postalCodeMap = postalCodeOptions.reduce(
            (acc, curr) => {
                return {
                    ...acc,
                    [curr.id]: curr.text,
                };
            },
            {} as Record<string, string>,
        );

        return { postalCodeOptions, postalCodeMap };
    }, [postalCodeQuery.data]);

    return {
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
        postalCodeMap
    };
}
