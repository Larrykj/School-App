'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Calendar, Plus, Edit, CheckCircle, Clock, Archive, Users, BookOpen } from 'lucide-react';

interface Semester {
  id: string;
  name: string;
  academicYear: {
    id: string;
    name: string;
  };
  startDate: string;
  endDate: string;
  registrationStart: string;
  registrationEnd: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
  _count?: {
    offerings: number;
    registrations: number;
  };
}

export default function SemesterManagementPage() {
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    academicYearId: '',
    name: '',
    startDate: '',
    endDate: '',
    registrationStart: '',
    registrationEnd: '',
  });

  useEffect(() => {
    fetchSemesters();
  }, []);

  const fetchSemesters = async () => {
    try {
      const response = await api.get('/academic/semesters');
      setSemesters(response.data.semesters || []);
    } catch (error) {
      console.error('Failed to fetch semesters:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setSemesters([
      {
        id: '1',
        name: 'Semester 1',
        academicYear: { id: 'ay1', name: '2024/2025' },
        startDate: '2024-09-01',
        endDate: '2025-01-31',
        registrationStart: '2024-08-15',
        registrationEnd: '2024-09-15',
        status: 'ACTIVE',
        _count: { offerings: 45, registrations: 1250 },
      },
      {
        id: '2',
        name: 'Semester 2',
        academicYear: { id: 'ay1', name: '2024/2025' },
        startDate: '2025-02-01',
        endDate: '2025-06-30',
        registrationStart: '2025-01-15',
        registrationEnd: '2025-02-15',
        status: 'UPCOMING',
        _count: { offerings: 0, registrations: 0 },
      },
      {
        id: '3',
        name: 'Semester 2',
        academicYear: { id: 'ay2', name: '2023/2024' },
        startDate: '2024-02-01',
        endDate: '2024-06-30',
        registrationStart: '2024-01-15',
        registrationEnd: '2024-02-15',
        status: 'COMPLETED',
        _count: { offerings: 42, registrations: 1180 },
      },
    ]);
  };

  const handleCreateSemester = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await api.post('/academic/semesters', formData);
      alert('Semester created successfully!');
      setShowCreateForm(false);
      setFormData({
        academicYearId: '',
        name: '',
        startDate: '',
        endDate: '',
        registrationStart: '',
        registrationEnd: '',
      });
      await fetchSemesters();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create semester');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>;
      case 'UPCOMING':
        return <Badge className="bg-blue-500"><Clock className="h-3 w-3 mr-1" />Upcoming</Badge>;
      case 'COMPLETED':
        return <Badge className="bg-gray-500"><Archive className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'ARCHIVED':
        return <Badge className="bg-gray-400"><Archive className="h-3 w-3 mr-1" />Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const isRegistrationOpen = (semester: Semester) => {
    const now = new Date();
    const start = new Date(semester.registrationStart);
    const end = new Date(semester.registrationEnd);
    return now >= start && now <= end;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Semester Management
            </h1>
            <p className="text-gray-600 mt-2">Manage academic semesters and registration periods</p>
          </div>

          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Semester
          </Button>
        </div>

        {/* Create Semester Form */}
        {showCreateForm && (
          <Card className="card-modern animate-fadeIn border-2 border-indigo-500">
            <CardHeader>
              <CardTitle>Create New Semester</CardTitle>
              <CardDescription>Set up a new semester with registration dates</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateSemester} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Semester Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Semester 1"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="academicYearId">Academic Year ID *</Label>
                    <Input
                      id="academicYearId"
                      value={formData.academicYearId}
                      onChange={(e) => setFormData({ ...formData, academicYearId: e.target.value })}
                      placeholder="Academic Year UUID"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate">Semester Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">Semester End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationStart">Registration Start *</Label>
                    <Input
                      id="registrationStart"
                      type="date"
                      value={formData.registrationStart}
                      onChange={(e) => setFormData({ ...formData, registrationStart: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="registrationEnd">Registration End *</Label>
                    <Input
                      id="registrationEnd"
                      type="date"
                      value={formData.registrationEnd}
                      onChange={(e) => setFormData({ ...formData, registrationEnd: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    Create Semester
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Semesters List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {semesters.map((semester, idx) => (
              <Card
                key={semester.id}
                className={`card-modern animate-fadeIn hover:shadow-xl transition-all ${
                  semester.status === 'ACTIVE' ? 'border-2 border-green-500' : ''
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">{semester.name}</CardTitle>
                      <CardDescription className="text-base mt-1">
                        {semester.academicYear.name}
                      </CardDescription>
                    </div>
                    {getStatusBadge(semester.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Dates */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(semester.startDate).toLocaleDateString()} - {new Date(semester.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="pl-6 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Registration Period:</span>
                        {isRegistrationOpen(semester) && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Open Now</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(semester.registrationStart).toLocaleDateString()} - {new Date(semester.registrationEnd).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  {semester._count && (
                    <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <BookOpen className="h-4 w-4 text-indigo-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Offerings</p>
                          <p className="text-lg font-bold">{semester._count.offerings}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Users className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Registrations</p>
                          <p className="text-lg font-bold">{semester._count.registrations}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    {semester.status === 'UPCOMING' && (
                      <Button size="sm" className="flex-1 bg-green-500 hover:bg-green-600">
                        Set Active
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Semesters</p>
                  <p className="text-2xl font-bold text-gray-900">{semesters.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {semesters.filter(s => s.status === 'ACTIVE').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {semesters.filter(s => s.status === 'UPCOMING').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {semesters.filter(s => s.status === 'COMPLETED').length}
                  </p>
                </div>
                <Archive className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="card-modern bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Semester Management Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2 text-sm">
            <p>
              • <strong>Registration Period:</strong> Should start 2-4 weeks before semester begins
            </p>
            <p>
              • <strong>Active Semester:</strong> Only one semester should be active at a time
            </p>
            <p>
              • <strong>Course Offerings:</strong> Create course offerings after setting up the semester
            </p>
            <p>
              • <strong>Status Changes:</strong> Automatically update semester status based on dates
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

