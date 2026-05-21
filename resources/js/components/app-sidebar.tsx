import { Link, usePage } from '@inertiajs/react';
import { 
    LayoutGrid, 
    Activity, 
    Map as MapIcon, 
    Database, 
    BarChart3, 
    History, 
    Bell, 
    Cpu, 
    Users,
    FileDown, 
    Settings,
    BookOpen,
    FolderGit2
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { NavItem } from '@/types';
import { dashboard } from '@/routes';

export function AppSidebar() {
    const { auth } = usePage().props;
    const userRole = auth.user?.role || 'Viewer / Operator';

    // Define all possible menu items with real paths
    const allItems = {
        dashboard: { title: 'Dashboard', href: '/dashboard', icon: LayoutGrid },
        peta: { title: 'Peta Lokasi', href: '/maps', icon: MapIcon },
        riwayat: { title: 'Riwayat Data', href: '/dashboard/history', icon: History },
        notif: { title: 'Alert & Notifikasi', href: '/dashboard/alerts', icon: Bell },
        device: { title: 'Device IoT CRUD', href: '/dashboard/admin/devices', icon: Cpu },
        user: { title: 'Manajemen User', href: '/dashboard/admin/users', icon: Users },
        config: { title: 'Konfigurasi Sistem', href: '/dashboard/admin/config', icon: Settings },
        security: { title: 'Keamanan & Backup', href: '/dashboard/admin/security', icon: FileDown },
        tickets: { title: 'Maintenance Tickets', href: '/dashboard/technician/tickets', icon: Activity },
        health: { title: 'Device Health Status', href: '/dashboard/technician/health', icon: Database },
    };

    // Filter items based on role
    let mainNavItems: NavItem[] = [];

    if (userRole === 'Super Admin') {
        mainNavItems = Object.values(allItems);
    } else if (userRole === 'Petugas Monitoring') {
        mainNavItems = [
            allItems.dashboard,
            allItems.peta,
            allItems.riwayat,
            allItems.notif
        ];
    } else if (userRole === 'Teknisi Lapangan') {
        mainNavItems = [
            allItems.dashboard,
            allItems.peta,
            allItems.tickets,
            allItems.health
        ];
    } else { // Viewer / Operator
        mainNavItems = [
            allItems.dashboard,
            allItems.peta,
            allItems.riwayat
        ];
    }

    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: FolderGit2,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits#react',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()}>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
