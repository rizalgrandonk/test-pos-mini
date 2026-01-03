import { Toaster } from '@/components/ui/sonner';
import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, type ReactNode } from 'react';
import { toast } from 'sonner';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { flash } = usePage<SharedData>().props;
    const shownFlashRef = useRef<{
        success?: string;
        error?: string;
    }>({});
    const { success: flashSuccess, error: flashError } = flash;

    useEffect(() => {
        if (flashSuccess && shownFlashRef.current.success !== flashSuccess) {
            toast.success(flashSuccess, {
                onAutoClose: () => {
                    shownFlashRef.current.success = undefined;
                },
                onDismiss: () => {
                    shownFlashRef.current.success = undefined;
                },
            });
            shownFlashRef.current.success = flashSuccess;
        }

        if (flashError && shownFlashRef.current.error !== flashError) {
            toast.error(flashError, {
                onAutoClose: () => {
                    shownFlashRef.current.error = undefined;
                },
                onDismiss: () => {
                    shownFlashRef.current.error = undefined;
                },
            });
            shownFlashRef.current.error = flashError;
        }
    }, [flashSuccess, flashError]);

    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {children}

            <Toaster position="top-right" />
        </AppLayoutTemplate>
    );
};
