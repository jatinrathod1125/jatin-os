import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { useEffect, useState } from 'react';

function AdminClock() {
    const [time, setTime] = useState(() => formatTime());

    useEffect(() => {
        const timer = window.setInterval(() => setTime(formatTime()), 1000);

        return () => window.clearInterval(timer);
    }, []);

    return (
        <span className="font-mono text-[11px] tracking-[0.12em] text-slate-400">
            {time}
        </span>
    );
}

function formatTime(): string {
    return new Intl.DateTimeFormat('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date());
}

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-white/[0.06] bg-[#030812]/60 px-6 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="-ml-1 text-slate-400 hover:text-cyan-300 transition" />
                <div className="hidden h-4 w-px bg-white/10 sm:block" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="flex items-center gap-4">
                <div className="hidden items-center gap-1.5 sm:flex">
                    <span className="admin-status-dot size-1.5 rounded-full bg-emerald-400" />
                    <span className="font-mono text-[10px] tracking-[0.14em] text-emerald-300/70">
                        ONLINE
                    </span>
                </div>
                <div className="hidden h-4 w-px bg-white/8 sm:block" />
                <AdminClock />
            </div>
        </header>
    );
}
