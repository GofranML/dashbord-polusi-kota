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

    // Define all possible menu items
    const allItems = {
        dashboard: { title: 'Dashboard', href: dashboard(), icon: LayoutGrid },
        monitoring: { title: 'Monitoring Realtime', href: '#', icon: Activity },
        peta: { title: 'Peta Lokasi', href: '#', icon: MapIcon },
        sensor: { title: 'Data Sensor', href: '#', icon: Database },
        grafik: { title: 'Grafik Analitik', href: '#', icon: BarChart3 },
        riwayat: { title: 'Riwayat Data', href: '#', icon: History },
        notif: { title: 'Alert & Notifikasi', href: '#', icon: Bell },
        device: { title: 'Device IoT', href: '#', icon: Cpu },
        user: { title: 'Manajemen User', href: '#', icon: Users },
        export: { title: 'Export Laporan', href: '#', icon: FileDown },
        settings: { title: 'Settings', href: '#', icon: Settings },
    };

    // Filter items based on role
    let mainNavItems: NavItem[] = [];

    if (userRole === 'Super Admin') {
        mainNavItems = Object.values(allItems);
    } else if (userRole === 'Petugas Monitoring') {
        mainNavItems = [
            allItems.dashboard,
            allItems.monitoring,
            allItems.peta,
            allItems.sensor,
            allItems.grafik,
            allItems.notif,
            allItems.export
        ];
    } else { // Viewer / Operator
        mainNavItems = [
            allItems.dashboard,
            allItems.monitoring,
            allItems.grafik,
            allItems.peta
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
