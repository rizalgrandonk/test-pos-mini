import { InertiaLinkProps } from '@inertiajs/react';
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function isSameUrl(
    url1: NonNullable<InertiaLinkProps['href']>,
    url2: NonNullable<InertiaLinkProps['href']>,
) {
    return resolveUrl(url1) === resolveUrl(url2);
}

export function resolveUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function formatCurrency(
    value: number,
    locale = 'id-ID',
    currency = 'IDR',
    withSymbol = true,
) {
    return new Intl.NumberFormat(locale, {
        style: withSymbol ? 'currency' : 'decimal',
        currency: withSymbol ? currency : undefined,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(value);
}
