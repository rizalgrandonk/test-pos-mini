import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link
                    href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600"
                    rel="stylesheet"
                />
            </Head>
            <div className="flex min-h-screen w-full items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                <Card className="w-full max-w-[335px] p-0 lg:max-w-4xl">
                    <CardContent className="grid w-full grid-cols-2 p-6">
                        <div className="flex flex-col justify-center">
                            <h1 className="text-4xl">
                                Welcome to <span className="font-bold">Pos Mini</span>
                            </h1>
                        </div>
                        {auth.user ? (
                            <div className="flex flex-col gap-4 text-center">
                                <p>Go to Daashboard to access Pos Mini</p>
                                <Button asChild className="w-full">
                                    <Link href={dashboard()}>Dashboard</Link>
                                </Button>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4 text-center">
                                <p>Login or Register to access Pos Mini</p>
                                <Button
                                    asChild
                                    variant="outline"
                                    className="w-full"
                                >
                                    <Link href={login()}>Login</Link>
                                </Button>
                                <Button asChild className="w-full">
                                    <Link href={register()}>Register</Link>
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            <div className="hidden h-14.5 lg:block"></div>
            {/* </div> */}
        </>
    );
}
