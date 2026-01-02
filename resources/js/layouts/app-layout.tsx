import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, type ReactNode } from 'react';
import { Toaster } from "@/components/ui/sonner"
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const {flash} = usePage<SharedData>().props
    const {success: flashSuccess, error: flashError} = flash
    
    useEffect(() => {
      if (flashSuccess) {
        toast.success(flashSuccess)
      }
    }, [flashSuccess])
    
    useEffect(() => {
      if (flashError) {
        toast.error(flashError)
      }
    }, [flashError])
    

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}

            <Toaster position="top-right" />
        </AppLayoutTemplate>
    );
};
