'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Calendar, Plus, CheckCircle, Clock, Archive } from 'lucide-react';

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  _count?: {
    semesters: number;
  };
}

export default function AcademicYearManagementPage() {
  const [years, setYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
  });

  useEffect(() => {
    fetchYears();
  }, []);

  const fetchYears = async () => {
    try {
      // In production, fetch from API
      // const response = await api.get('/academic/years');
      // setYears(response.data.years || []);
      setDemoData();
    } catch (error) {
      console.error('Failed to fetch years:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setYears([
      {
        id: '1',
        name: '2024/2025',
        startDate: '2024-09-01',
        endDate: '2025-08-31',
        status: 'ACTIVE',
        _count: { semesters: 2 },
      },
      {
        id: '2',
        name: '2025/2026',
        startDate: '2025-09-01',
        endDate: '2026-08-31',
        status: 'UPCOMING',
        _count: { semesters: 0 },
      },
      {
        id: '3',
        name: '2023/2024',
        startDate: '2023-09-01',
        endDate: '2024-08-31',
        status: 'COMPLETED',
        _count: { semesters: 2 },
      },
    ]);
  };

  const handleCreateYear = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // In production, post to API
      // await api.post('/academic/years', formData);
      alert('Academic year created successfully!');
      setShowCreateForm(false);
      setFormData({ name: '', startDate: '', endDate: '' });
      await fetchYears();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create academic year');
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
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Academic Year Management
            </h1>
            <p className="text-gray-600 mt-2">Manage academic years and their semesters</p>
          </div>

          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Academic Year
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Years</p>
                  <p className="text-2xl font-bold text-gray-900">{years.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Year</p>
                  <p className="text-2xl font-bold text-green-600">
                    {years.filter(y => y.status === 'ACTIVE').length}
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
                  <p className="text-sm text-gray-600">Total Semesters</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {years.reduce((sum, y) => sum + (y._count?.semesters || 0), 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="card-modern animate-fadeIn border-2 border-indigo-500">
            <CardHeader>
              <CardTitle>Create New Academic Year</CardTitle>
              <CardDescription>Set up a new academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateYear} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Academic Year *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., 2024/2025"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="startDate">Start Date *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endDate">End Date *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
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
                    Create Academic Year
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Years List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {years.map((year, idx) => (
              <Card
                key={year.id}
                className={`card-modern animate-fadeIn hover:shadow-xl transition-all ${
                  year.status === 'ACTIVE' ? 'border-2 border-green-500' : ''
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-3xl">{year.name}</CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(year.status)}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Semester Count */}
                  <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Semesters</p>
                    <p className="text-3xl font-bold text-indigo-600">
                      {year._count?.semesters || 0}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    {year.status === 'ACTIVE' && (
                      <Button size="sm" className="flex-1">
                        Manage Semesters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="card-modern bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Academic Year Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2 text-sm">
            <p>
              • <strong>Naming Convention:</strong> Use format "YYYY/YYYY" (e.g., 2024/2025)
            </p>
            <p>
              • <strong>Duration:</strong> Typically runs from September to August
            </p>
            <p>
              • <strong>Active Year:</strong> Only one academic year should be active at a time
            </p>
            <p>
              • <strong>Semesters:</strong> Create 2-3 semesters per academic year after setup
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

