import { Button } from '@/components/ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { dashboard } from '@/routes';
import { Head, Link } from '@inertiajs/react';
import { StickyNoteIcon } from 'lucide-react';

export default function Welcome() {
    return (
        <>
            <Head title="404">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                <Empty className="border border-dashed w-full max-w-xl">
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <StickyNoteIcon />
                        </EmptyMedia>
                        <EmptyTitle>404</EmptyTitle>
                        <EmptyDescription>
                            The page you're looking for doesn't exist. Lets go back to the Dashboard
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button asChild>
                            <Link href={dashboard()}>Go to Dashboard</Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            </div>
            <div className="hidden h-14.5 lg:block"></div>
        </>
    );
}
