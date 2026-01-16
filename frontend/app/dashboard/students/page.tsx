'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Users, Search, Plus, Download, Filter, UserPlus } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    fetchStudents();
  }, [debouncedSearch]);

  const fetchStudents = async () => {
    try {
      const params = debouncedSearch ? { search: debouncedSearch } : {};
      const response = await api.get('/students', { params });
      setStudents(response.data.students || []);
    } catch (error: any) {
      // Fall back to demo data if backend not available
      if (!error.response || error.message === 'Network Error') {
        const demoStudents = [
          {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            admissionNumber: 'ADM001',
            email: 'john.doe@example.com',
            phone: '+254712345678',
            class: { name: 'Form 1A' },
            status: 'ACTIVE'
          },
          {
            id: '2',
            firstName: 'Jane',
            lastName: 'Smith',
            admissionNumber: 'ADM002',
            email: 'jane.smith@example.com',
            phone: '+254712345679',
            class: { name: 'Form 1A' },
            status: 'ACTIVE'
          },
          {
            id: '3',
            firstName: 'Mike',
            lastName: 'Johnson',
            admissionNumber: 'ADM003',
            email: 'mike.johnson@example.com',
            phone: '+254712345680',
            class: { name: 'Form 1B' },
            status: 'ACTIVE'
          },
          {
            id: '4',
            firstName: 'Sarah',
            lastName: 'Williams',
            admissionNumber: 'ADM004',
            email: 'sarah.williams@example.com',
            phone: '+254712345681',
            class: { name: 'Form 2A' },
            status: 'ACTIVE'
          },
          {
            id: '5',
            firstName: 'Tom',
            lastName: 'Brown',
            admissionNumber: 'ADM005',
            email: 'tom.brown@example.com',
            phone: '+254712345682',
            class: { name: 'Form 2A' },
            status: 'ACTIVE'
          },
          {
            id: '6',
            firstName: 'Alice',
            lastName: 'Davis',
            admissionNumber: 'ADM006',
            email: 'alice.davis@example.com',
            phone: '+254712345683',
            class: { name: 'Form 2B' },
            status: 'ACTIVE'
          },
        ];
        
        // Filter by search if provided
        if (debouncedSearch) {
          const searchLower = debouncedSearch.toLowerCase();
          setStudents(demoStudents.filter(s => 
            s.firstName.toLowerCase().includes(searchLower) ||
            s.lastName.toLowerCase().includes(searchLower) ||
            s.admissionNumber.toLowerCase().includes(searchLower)
          ));
        } else {
          setStudents(demoStudents);
        }
      } else {
        console.error('Failed to fetch students:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Students</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage student admissions, enrollment, and records
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/students/export'}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button onClick={() => window.location.href = '/dashboard/students/new'}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by name, admission number, or class..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading students...</p>
            </div>
          </div>
        ) : students.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student, index) => (
              <Card
                key={student.id}
                className="card-modern border-0 cursor-pointer animate-fadeIn"
                style={{ animationDelay: `${index * 50}ms` }}
                onClick={() => window.location.href = `/dashboard/students/${student.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <span className="text-lg font-bold text-white">
                          {student.firstName[0]}{student.lastName[0]}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {student.firstName} {student.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {student.admissionNumber}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {student.class && (
                          <Badge variant="outline" className="text-xs">
                            {student.class.name}
                          </Badge>
                        )}
                        {student.gender && (
                          <Badge variant="secondary" className="text-xs">
                            {student.gender}
                          </Badge>
                        )}
                        {student.isActive && (
                          <Badge variant="success" className="text-xs">
                            Active
                          </Badge>
                        )}
                      </div>

                      {student.parent && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Parent: {student.parent.user?.firstName} {student.parent.user?.lastName}
                          </p>
                          {student.parent.user?.phone && (
                            <p className="text-xs text-gray-500">
                              📱 {student.parent.user.phone}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/dashboard/students/${student.id}/fees`;
                      }}
                    >
                      Fees
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/dashboard/students/${student.id}/performance`;
                      }}
                    >
                      Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {search ? 'No students found' : 'No students yet'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {search
                  ? 'Try adjusting your search terms'
                  : 'Start by adding your first student'}
              </p>
              {!search && (
                <Button onClick={() => window.location.href = '/dashboard/students/new'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Student
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

