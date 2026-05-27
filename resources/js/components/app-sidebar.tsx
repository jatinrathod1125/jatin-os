import { Link, usePage } from '@inertiajs/react';
import {
    BookOpen,
    House,
    LayoutGrid,
    ShieldCheck,
    Activity,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Portfolio Desktop',
        href: '/',
        icon: House,
    },
];

export function AppSidebar() {
    const { url, props } = usePage<{ auth: { user: { is_admin?: boolean } | null } }>();
    const user = props.auth.user;
    const isAdminPath = url.startsWith('/admin');

    const navigation = user?.is_admin
        ? [
            ...mainNavItems,
            {
                title: 'Admin Console',
                href: '/admin',
                icon: ShieldCheck,
            },
        ]
        : mainNavItems;

    const filteredFooterNavItems = isAdminPath
        ? footerNavItems.filter((item) => item.title !== 'Documentation')
        : footerNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {/* System status indicator */}
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-emerald-400/15 bg-emerald-400/5 px-3 py-2 group-data-[collapsible=icon]:hidden">
                    <span className="admin-status-dot size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                    <span className="font-mono text-[10px] tracking-[0.16em] text-emerald-300/80">
                        SYSTEMS ONLINE
                    </span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={navigation} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={filteredFooterNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
