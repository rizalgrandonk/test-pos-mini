import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    flash: { success: string | null; error: string | null };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Product {
    id: number;
    name: string;
    code: string;
    price: number;
    stock: number;
}

export interface Customer {
    id: number;
    name: string;
    code: string;
    province?: string;
    province_id?: number;
    regency?: string;
    regency_id?: number;
    district?: string;
    district_id?: number;
    village?: string;
    village_id?: number;
    address?: string;
    postal_code?: string;
}

export interface TransactionHeader {
    id: number;
    invoice_number: string;
    customer_id: number;
    invoice_date: string;
    total: number;
    customer: Customer
}

export interface TransactionHeaderTable {
    id: number;
    invoice_number: string;
    customer_id: number;
    invoice_date: string;
    total: number;
    customer_name: string;
    customer_code: string;
}
