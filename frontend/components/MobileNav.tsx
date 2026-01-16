'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { getAuth } from '@/lib/auth';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user } = getAuth();

  if (!user) return null;

  const isAdmin = ['SUPER_ADMIN', 'SCHOOL_ADMIN', 'ACCOUNTANT'].includes(user.role);
  const isTeacher = user.role === 'TEACHER';
  const isParent = user.role === 'PARENT';

  const navItems = isAdmin
    ? [
        { href: '/dashboard/admin', label: 'Dashboard' },
        { href: '/dashboard/students', label: 'Students' },
        { href: '/dashboard/fees', label: 'Fees' },
        { href: '/dashboard/payments', label: 'Payments' },
        { href: '/dashboard/library', label: 'Library' },
        { href: '/dashboard/inventory', label: 'Inventory' },
        { href: '/dashboard/transport', label: 'Transport' },
      ]
    : isTeacher
    ? [
        { href: '/dashboard/teacher', label: 'Dashboard' },
        { href: '/dashboard/attendance', label: 'Attendance' },
        { href: '/dashboard/exams', label: 'Exams' },
        { href: '/dashboard/timetable', label: 'Timetable' },
      ]
    : [
        { href: '/dashboard/parent', label: 'Dashboard' },
        { href: '/dashboard/parent/fees', label: 'Fees' },
        { href: '/dashboard/parent/results', label: 'Results' },
      ];

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
      >
        <span className="sr-only">Open menu</span>
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white shadow-lg z-50">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`${
                  pathname === item.href
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

