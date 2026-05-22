import { Head, usePage } from '@inertiajs/react';
import React from 'react';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { GlassCard } from '@/components/GlassCard';
import { BookOpen } from 'lucide-react';

export default function ApiDocs() {
    const { htmlContent, auth } = usePage().props as any;
    const userRole = auth.user?.role;

    if (userRole !== 'Super Admin') {
        return (
            <div className="p-10 flex justify-center items-center h-[50vh]">
                <GlassCard className="p-8 text-center border-red-500/20 bg-red-500/5">
                    <h2 className="text-xl font-black text-red-500 uppercase">Access Denied</h2>
                    <p className="text-neutral-400 mt-2">You do not have permission to view the API Documentation.</p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="p-4 lg:p-10 space-y-8 bg-transparent">
            <Head title="API Documentation - Super Admin" />
            
            <header className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <BookOpen className="text-cyan-400 w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-black uppercase tracking-tighter">API Documentation</h1>
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Super Admin Exclusive Access</p>
                </div>
            </header>

            <GlassCard className="p-8 border-cyan-500/20">
                <div 
                    className="prose prose-invert prose-cyan max-w-none 
                               prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest
                               prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:text-sm
                               prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                               prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-white/10
                               prose-code:text-cyan-300 prose-code:bg-white/5 prose-code:px-1 prose-code:rounded"
                    dangerouslySetInnerHTML={{ __html: htmlContent }} 
                />
            </GlassCard>
        </div>
    );
}

ApiDocs.layout = (page: React.ReactNode) => (
    <AppLayout breadcrumbs={[{ title: 'API Documentation', href: '/dashboard/admin/api-docs' }]}>
        {page}
    </AppLayout>
);
