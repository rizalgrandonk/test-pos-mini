import productRoutes from '@/routes/products';
import { Product } from '@/types';
import axios from 'axios';

export async function searchProduct(
    term?: string,
    onlyAvailable: boolean = true,
) {
    const res = await axios.get<Product[]>(productRoutes.search().url, {
        params: { q: term ?? '', available: onlyAvailable ? '1' : '0' },
    });

    return res.data;
}
