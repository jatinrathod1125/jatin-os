import { Head, Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Settings2,
    ShieldCheck,
    TerminalSquare,
} from 'lucide-react';
import { dashboard } from '@/routes';
import type { User } from '@/types';

export default function Dashboard() {
    const user = usePage<{ auth: { user: User } }>().props.auth.user;

    return (
        <>
            <Head title="Workspace" />
            <div className="flex flex-1 flex-col gap-6 p-5 md:p-8">
                <div className="max-w-2xl">
                    <p className="font-mono text-xs tracking-[0.22em] text-cyan-600 dark:text-cyan-300">
                        AUTHENTICATED SESSION
                    </p>
                    <h1 className="mt-3 text-3xl font-semibold">
                        Welcome back, {user.name}.
                    </h1>
                    <p className="mt-3 leading-7 text-muted-foreground">
                        Your account is secured by Laravel Fortify. Return to
                        the public desktop or maintain your identity and
                        security configuration here.
                    </p>
                </div>
                <div className="grid max-w-4xl gap-4 md:grid-cols-3">
                    <ActionCard
                        href="/"
                        title="Portfolio OS"
                        body="Launch the visitor desktop."
                        icon={TerminalSquare}
                    />
                    <ActionCard
                        href="/settings/profile"
                        title="Account Settings"
                        body="Update profile and security."
                        icon={Settings2}
                    />
                    {Boolean(user.is_admin) && (
                        <ActionCard
                            href="/admin"
                            title="Admin Console"
                            body="Manage content and analytics."
                            icon={ShieldCheck}
                        />
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};

function ActionCard({
    href,
    title,
    body,
    icon: Icon,
}: {
    href: string;
    title: string;
    body: string;
    icon: typeof TerminalSquare;
}) {
    return (
        <Link
            href={href}
            className="group rounded-xl border border-border bg-card p-5 transition hover:border-cyan-400/35"
        >
            <div className="flex items-center justify-between">
                <Icon className="size-5 text-cyan-600 dark:text-cyan-300" />
                <ArrowUpRight className="size-4 text-muted-foreground transition group-hover:text-cyan-500" />
            </div>
            <p className="mt-5 font-medium">{title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{body}</p>
        </Link>
    );
}
