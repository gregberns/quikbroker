'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Truck, 
  Building2, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  brokerOnly?: boolean;
  carrierOnly?: boolean;
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: <Home className="h-5 w-5" />,
  },
  {
    title: 'Brokers',
    href: '/dashboard/admin/brokers',
    icon: <Building2 className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: 'Carriers',
    href: '/dashboard/admin/carriers',
    icon: <Truck className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: 'Users',
    href: '/dashboard/admin/users',
    icon: <Users className="h-5 w-5" />,
    adminOnly: true,
  },
  {
    title: 'My Carriers',
    href: '/dashboard/brokers',
    icon: <Truck className="h-5 w-5" />,
    brokerOnly: true,
  },
  {
    title: 'My Documents',
    href: '/dashboard/carriers/documents',
    icon: <Truck className="h-5 w-5" />,
    carrierOnly: true,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: <Settings className="h-5 w-5" />,
  },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  interface UserData {
    id: number;
    email: string;
    role: string;
    name?: string;
  }
  
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Add a timestamp to prevent caching issues
        const response = await fetch('/api/me?t=' + Date.now(), {
          credentials: 'same-origin',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });

        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          throw new Error('Not authenticated');
        }

        const data = await response.json();
        console.log('User data loaded:', data);
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // Redirect to login page when not authenticated
        window.location.href = '/login';
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter(item => {
    if (!user) return false;
    if (item.adminOnly && user.role !== 'admin') return false;
    if (item.brokerOnly && user.role !== 'broker') return false;
    if (item.carrierOnly && user.role !== 'carrier') return false;
    return true;
  });

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card pt-5">
          <div className="flex items-center flex-shrink-0 px-4 mb-5">
            <Link href="/dashboard" className="font-bold text-xl text-primary">
              QuikBroker
            </Link>
          </div>
          <div className="flex flex-col flex-grow px-4 mt-5">
            <nav className="flex-1 space-y-1">
              {filteredNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    pathname === item.href
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-border p-4">
            <Button variant="outline" className="w-full flex items-center justify-center" asChild>
              <Link href="/logout">
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-card">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <Link href="/dashboard" className="font-bold text-xl text-primary">
                  QuikBroker
                </Link>
              </div>
              <nav className="mt-5 px-2 space-y-1">
                {filteredNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "group flex items-center px-2 py-2 text-base font-medium rounded-md",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-border p-4">
              <Button variant="outline" className="w-full flex items-center justify-center" asChild>
                <Link href="/logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log Out
                </Link>
              </Button>
            </div>
          </div>
          <div className="flex-shrink-0 w-14"></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top Navigation */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-card shadow border-b border-border">
          <button
            type="button"
            className="px-4 md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6 text-muted-foreground" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex items-center">
              <h1 className="text-xl font-semibold text-foreground hidden md:block">
                {/* Get title from current pathname */}
                {filteredNavItems.find(item => pathname.startsWith(item.href))?.title || 'Dashboard'}
              </h1>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              {/* Notifications */}
              <button
                type="button"
                className="p-1 rounded-full text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" />
              </button>

              {/* Profile dropdown */}
              <div className="ml-3 relative">
                <div>
                  <button
                    type="button"
                    className="max-w-xs bg-card flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    id="user-menu"
                    aria-expanded="false"
                    aria-haspopup="true"
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center uppercase">
                      {user?.name ? user.name.charAt(0) : '?'}
                    </div>
                    <span className="ml-2 text-sm font-medium text-foreground hidden md:block">
                      {user?.name || 'Loading...'}
                    </span>
                    <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
                  </button>
                </div>

                {userMenuOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-card ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      href="/dashboard/settings"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <Link
                      href="/logout"
                      className="block px-4 py-2 text-sm text-foreground hover:bg-muted"
                      role="menuitem"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Log Out
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none bg-background">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* Replace with your content */}
                {children}
                {/* /End replace */}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}