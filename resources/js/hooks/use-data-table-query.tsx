import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Params {
    page: number;
    perPage: number;
    search?: string;
    sort?: string;
}

interface ResponseData<T> {
    data: T[];
    current_page: number;
    from: number;
    to: number;
    last_page: number;
    per_page: number;
    total: number;
}

export function useDataTableQuery<T>(key: string, url: string, params: Params) {
    return useQuery({
        queryKey: [key, params],
        queryFn: async () => {
            const { data } = await axios.get<ResponseData<T>>(url, { params });
            return data;
        },
        placeholderData: keepPreviousData
    });
}
