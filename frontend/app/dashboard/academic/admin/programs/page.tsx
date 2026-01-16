'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { GraduationCap, Plus, BookOpen, Users, Award, Calendar } from 'lucide-react';

interface Program {
  id: string;
  code: string;
  name: string;
  programType: string;
  departmentId?: string;
  department?: {
    name: string;
  };
  duration: number;
  creditHours: number;
  description?: string;
  isActive: boolean;
  _count?: {
    students: number;
    courses: number;
  };
}

interface Department {
  id: string;
  code: string;
  name: string;
}

export default function ProgramManagementPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    programType: 'BACHELORS',
    departmentId: '',
    duration: 8,
    creditHours: 120,
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [programsRes, deptsRes] = await Promise.all([
        api.get('/academic/programs'),
        api.get('/academic/departments'),
      ]);

      setPrograms(programsRes.data.programs || []);
      setDepartments(deptsRes.data.departments || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setDepartments([
      { id: 'dept1', code: 'CS', name: 'Computer Science' },
      { id: 'dept2', code: 'BUS', name: 'Business' },
      { id: 'dept3', code: 'ENG', name: 'Engineering' },
    ]);

    setPrograms([
      {
        id: '1',
        code: 'BIT',
        name: 'Bachelor of Information Technology',
        programType: 'BACHELORS',
        department: { name: 'Computer Science' },
        duration: 8,
        creditHours: 120,
        description: '4-year degree program in IT',
        isActive: true,
        _count: { students: 250, courses: 45 },
      },
      {
        id: '2',
        code: 'DIT',
        name: 'Diploma in Information Technology',
        programType: 'DIPLOMA',
        department: { name: 'Computer Science' },
        duration: 4,
        creditHours: 60,
        description: '2-year diploma program',
        isActive: true,
        _count: { students: 180, courses: 25 },
      },
      {
        id: '3',
        code: 'MBA',
        name: 'Master of Business Administration',
        programType: 'MASTERS',
        department: { name: 'Business' },
        duration: 4,
        creditHours: 48,
        description: '2-year MBA program',
        isActive: true,
        _count: { students: 85, courses: 20 },
      },
    ]);
  };

  const handleCreateProgram = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/academic/programs', formData);
      alert('Program created successfully!');
      setShowCreateForm(false);
      setFormData({
        code: '',
        name: '',
        programType: 'BACHELORS',
        departmentId: '',
        duration: 8,
        creditHours: 120,
        description: '',
      });
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create program');
    }
  };

  const getProgramTypeBadge = (type: string) => {
    const colors: any = {
      CERTIFICATE: 'bg-gray-500',
      DIPLOMA: 'bg-blue-500',
      BACHELORS: 'bg-green-500',
      MASTERS: 'bg-purple-500',
      PHD: 'bg-red-500',
    };
    return <Badge className={colors[type] || 'bg-gray-500'}>{type}</Badge>;
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Program Management
            </h1>
            <p className="text-gray-600 mt-2">Manage academic programs and departments</p>
          </div>

          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Program
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Programs</p>
                  <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
                </div>
                <GraduationCap className="h-8 w-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-green-600">
                    {programs.reduce((sum, p) => sum + (p._count?.students || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {programs.reduce((sum, p) => sum + (p._count?.courses || 0), 0)}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Departments</p>
                  <p className="text-2xl font-bold text-purple-600">{departments.length}</p>
                </div>
                <Award className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Program Form */}
        {showCreateForm && (
          <Card className="card-modern animate-fadeIn border-2 border-indigo-500">
            <CardHeader>
              <CardTitle>Create New Program</CardTitle>
              <CardDescription>Set up a new academic program</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateProgram} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Program Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., BIT, DIT, MBA"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="programType">Program Type *</Label>
                    <select
                      id="programType"
                      value={formData.programType}
                      onChange={(e) => setFormData({ ...formData, programType: e.target.value })}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      required
                    >
                      <option value="CERTIFICATE">Certificate</option>
                      <option value="DIPLOMA">Diploma</option>
                      <option value="BACHELORS">Bachelor's Degree</option>
                      <option value="MASTERS">Master's Degree</option>
                      <option value="PHD">PhD</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="name">Program Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Bachelor of Information Technology"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="departmentId">Department</Label>
                    <select
                      id="departmentId"
                      value={formData.departmentId}
                      onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>
                          {dept.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (Semesters) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      e.g., 4 semesters (2 years), 8 semesters (4 years)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="creditHours">Total Credit Hours *</Label>
                    <Input
                      id="creditHours"
                      type="number"
                      min="1"
                      value={formData.creditHours}
                      onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      rows={3}
                      placeholder="Program description..."
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
                    Create Program
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Programs List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {programs.map((program, idx) => (
              <Card
                key={program.id}
                className="card-modern animate-fadeIn hover:shadow-xl transition-all"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl">{program.code}</CardTitle>
                        <p className="text-xs text-gray-500">{program.department?.name}</p>
                      </div>
                    </div>
                    {getProgramTypeBadge(program.programType)}
                  </div>
                  <CardDescription className="text-base font-medium text-gray-700">
                    {program.name}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  {program.description && (
                    <p className="text-sm text-gray-600">{program.description}</p>
                  )}

                  {/* Program Details */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-t border-b">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Duration</p>
                        <p className="text-sm font-bold">
                          {program.duration} sem ({program.duration / 2} yrs)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-xs text-gray-600">Credits</p>
                        <p className="text-sm font-bold">{program.creditHours}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  {program._count && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600">Students</p>
                        <p className="text-xl font-bold text-green-600">{program._count.students}</p>
                      </div>
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600">Courses</p>
                        <p className="text-xl font-bold text-blue-600">{program._count.courses}</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1">
                      Manage Courses
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Program Types Legend */}
        <Card className="card-modern bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Program Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
              <div>
                <Badge className="bg-gray-500 mb-2">CERTIFICATE</Badge>
                <p className="text-xs text-gray-600">Short courses (6-12 months)</p>
              </div>
              <div>
                <Badge className="bg-blue-500 mb-2">DIPLOMA</Badge>
                <p className="text-xs text-gray-600">2-3 year programs</p>
              </div>
              <div>
                <Badge className="bg-green-500 mb-2">BACHELORS</Badge>
                <p className="text-xs text-gray-600">4-5 year degrees</p>
              </div>
              <div>
                <Badge className="bg-purple-500 mb-2">MASTERS</Badge>
                <p className="text-xs text-gray-600">1-2 year postgraduate</p>
              </div>
              <div>
                <Badge className="bg-red-500 mb-2">PHD</Badge>
                <p className="text-xs text-gray-600">3-5 year doctorate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

