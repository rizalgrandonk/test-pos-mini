import customerRoutes from '@/routes/customer';
import { Customer } from '@/types';
import axios from 'axios';

export async function searchCustomer(term?: string) {
    const res = await axios.get<Customer[]>(customerRoutes.search().url, {
        params: { q: term ?? '' },
    });

    return res.data;
}
