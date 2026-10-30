import { Head, usePage } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import React from 'react';
import { GlassCard } from '@/components/GlassCard';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';

export default function ApiDocs() {
    const { htmlContent, auth } = usePage().props as any;
    const userRole = auth.user?.role;

    if (userRole !== 'Super Admin') {
        return (
            <div className="flex h-[50vh] items-center justify-center p-10">
                <GlassCard className="border-red-500/20 bg-red-500/5 p-8 text-center">
                    <h2 className="text-xl font-black text-red-500 uppercase">
                        Access Denied
                    </h2>
                    <p className="mt-2 text-neutral-400">
                        You do not have permission to view the API
                        Documentation.
                    </p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="space-y-8 bg-transparent p-4 lg:p-10">
            <Head title="API Documentation - Super Admin" />

            <header className="mb-8 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/20">
                    <BookOpen className="h-6 w-6 text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-black tracking-tighter uppercase">
                        API Documentation
                    </h1>
                    <p className="text-[10px] font-black tracking-widest text-neutral-500 uppercase">
                        Super Admin Exclusive Access
                    </p>
                </div>
            </header>

            <GlassCard className="border-cyan-500/20 p-8">
                <div
                    className="prose max-w-none prose-invert prose-cyan prose-headings:font-black prose-headings:tracking-widest prose-headings:uppercase prose-p:text-sm prose-p:leading-relaxed prose-p:text-neutral-300 prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline prose-code:rounded prose-code:bg-white/5 prose-code:px-1 prose-code:text-cyan-300 prose-pre:border prose-pre:border-white/10 prose-pre:bg-neutral-900"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                />
            </GlassCard>
        </div>
    );
}

ApiDocs.layout = (page: React.ReactNode) => (
    <AppLayout
        breadcrumbs={[
            { title: 'API Documentation', href: '/dashboard/admin/api-docs' },
        ]}
    >
        {page}
    </AppLayout>
);
