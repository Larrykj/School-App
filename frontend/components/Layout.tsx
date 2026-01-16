'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getAuth, clearAuth } from '@/lib/auth';
import { User } from '@/types';
import { 
  LayoutDashboard, Users, DollarSign, CreditCard, MessageSquare, 
  FileText, Menu, X, LogOut, Calendar, Award, BookOpen,
  Bus, Bed, Book, Package, Clock, BarChart3
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const { user: authUser } = getAuth();
    if (!authUser) {
      router.push('/login');
    } else {
      setUser(authUser);
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const isAdmin = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(user.role);
  const isTeacher = user.role === 'TEACHER';
  const isParent = user.role === 'PARENT';

  // Navigation items based on role
  const adminNavItems = [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Students', href: '/dashboard/students', icon: Users },
    { name: 'Fees', href: '/dashboard/fees', icon: DollarSign },
    { name: 'Payments', href: '/dashboard/payments', icon: CreditCard },
    { name: 'Transport', href: '/dashboard/transport', icon: Bus },
    { name: 'Hostel', href: '/dashboard/hostel', icon: Bed },
    { name: 'Library', href: '/dashboard/library', icon: Book },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
    { name: 'Timetable', href: '/dashboard/timetable', icon: Clock },
    { name: 'SMS', href: '/dashboard/sms', icon: MessageSquare },
    { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  ];

  const teacherNavItems = [
    { name: 'Dashboard', href: '/dashboard/teacher', icon: LayoutDashboard },
    { name: 'Attendance', href: '/dashboard/attendance', icon: Calendar },
    { name: 'Exams', href: '/dashboard/exams', icon: Award },
    { name: 'Classes', href: '/dashboard/classes', icon: BookOpen },
  ];

  const parentNavItems = [
    { name: 'Dashboard', href: '/dashboard/parent', icon: LayoutDashboard },
    { name: 'Fees', href: '/dashboard/payments/new', icon: DollarSign },
    { name: 'Results', href: '/dashboard/parent/results', icon: Award },
  ];

  const navItems = isAdmin ? adminNavItems : isTeacher ? teacherNavItems : parentNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">SM</span>
                  </div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">
                    School Management
                  </h1>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname?.startsWith(item.href);
                  
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className={`${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      } inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors`}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {item.name}
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Right Side - User Info & Logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500">{user.role}</p>
              </div>
              
              {/* Desktop Logout Button */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname?.startsWith(item.href);
                
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${
                      isActive
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } flex items-center px-3 py-2 rounded-md text-base font-medium`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </a>
                );
              })}
              
              {/* Mobile User Info */}
              <div className="pt-4 pb-2 px-3 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-gray-500 mb-3">{user.role}</p>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} School Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

