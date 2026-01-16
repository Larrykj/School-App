'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { BookOpen, Plus, Award, Filter, AlertCircle } from 'lucide-react';

interface Course {
  id: string;
  code: string;
  name: string;
  description?: string;
  creditHours: number;
  departmentId?: string;
  department?: {
    name: string;
  };
  level: number;
  isElective: boolean;
  isActive: boolean;
  prerequisites?: Array<{
    prerequisite: {
      code: string;
      name: string;
    };
    isStrict: boolean;
  }>;
}

interface Department {
  id: string;
  code: string;
  name: string;
}

export default function CourseManagementPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    creditHours: 3,
    departmentId: '',
    level: 1,
    isElective: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [courses, filterLevel, filterDept]);

  const fetchData = async () => {
    try {
      const [coursesRes, deptsRes] = await Promise.all([
        api.get('/academic/courses'),
        api.get('/academic/departments'),
      ]);

      setCourses(coursesRes.data.courses || []);
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
      { id: 'dept2', code: 'MATH', name: 'Mathematics' },
      { id: 'dept3', code: 'ENG', name: 'English' },
    ]);

    setCourses([
      {
        id: '1',
        code: 'CS101',
        name: 'Introduction to Programming',
        description: 'Basic programming concepts using Python',
        creditHours: 3,
        department: { name: 'Computer Science' },
        level: 1,
        isElective: false,
        isActive: true,
      },
      {
        id: '2',
        code: 'CS201',
        name: 'Object Oriented Programming',
        description: 'OOP concepts with Java',
        creditHours: 3,
        department: { name: 'Computer Science' },
        level: 2,
        isElective: false,
        isActive: true,
        prerequisites: [
          {
            prerequisite: { code: 'CS101', name: 'Intro to Programming' },
            isStrict: true,
          },
        ],
      },
      {
        id: '3',
        code: 'MATH101',
        name: 'Calculus I',
        description: 'Differential and integral calculus',
        creditHours: 4,
        department: { name: 'Mathematics' },
        level: 1,
        isElective: false,
        isActive: true,
      },
      {
        id: '4',
        code: 'CS301',
        name: 'Data Structures',
        description: 'Advanced data structures and algorithms',
        creditHours: 3,
        department: { name: 'Computer Science' },
        level: 3,
        isElective: false,
        isActive: true,
        prerequisites: [
          {
            prerequisite: { code: 'CS201', name: 'OOP' },
            isStrict: true,
          },
        ],
      },
      {
        id: '5',
        code: 'CS401',
        name: 'Machine Learning',
        description: 'Introduction to ML algorithms',
        creditHours: 3,
        department: { name: 'Computer Science' },
        level: 4,
        isElective: true,
        isActive: true,
      },
    ]);
  };

  const applyFilters = () => {
    let filtered = [...courses];

    if (filterLevel !== 'all') {
      filtered = filtered.filter(c => c.level === parseInt(filterLevel));
    }

    if (filterDept !== 'all') {
      filtered = filtered.filter(c => c.departmentId === filterDept);
    }

    setFilteredCourses(filtered);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post('/academic/courses', formData);
      alert('Course created successfully!');
      setShowCreateForm(false);
      setFormData({
        code: '',
        name: '',
        description: '',
        creditHours: 3,
        departmentId: '',
        level: 1,
        isElective: false,
      });
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create course');
    }
  };

  const getLevelBadge = (level: number) => {
    const colors = ['bg-green-500', 'bg-blue-500', 'bg-purple-500', 'bg-red-500'];
    return <Badge className={colors[level - 1] || 'bg-gray-500'}>Year {level}</Badge>;
  };

  const coursesByLevel = [1, 2, 3, 4].map(level => ({
    level,
    courses: filteredCourses.filter(c => c.level === level),
  }));

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Course Management
            </h1>
            <p className="text-gray-600 mt-2">Manage courses and prerequisites</p>
          </div>

          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Button>
        </div>

        {/* Stats & Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Courses</p>
                  <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3">
            <Card className="card-modern h-full">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <div className="flex-1 grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="filterLevel" className="text-xs">Filter by Year</Label>
                      <select
                        id="filterLevel"
                        value={filterLevel}
                        onChange={(e) => setFilterLevel(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-300 px-3 py-1.5 text-sm"
                      >
                        <option value="all">All Years</option>
                        <option value="1">Year 1</option>
                        <option value="2">Year 2</option>
                        <option value="3">Year 3</option>
                        <option value="4">Year 4</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="filterDept" className="text-xs">Filter by Department</Label>
                      <select
                        id="filterDept"
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="w-full rounded-lg border-2 border-gray-300 px-3 py-1.5 text-sm"
                      >
                        <option value="all">All Departments</option>
                        {departments.map((dept) => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Showing <span className="font-bold">{filteredCourses.length}</span> courses
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Course Form */}
        {showCreateForm && (
          <Card className="card-modern animate-fadeIn border-2 border-indigo-500">
            <CardHeader>
              <CardTitle>Create New Course</CardTitle>
              <CardDescription>Add a new course to the catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Course Code *</Label>
                    <Input
                      id="code"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g., CS101"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="creditHours">Credit Hours *</Label>
                    <Input
                      id="creditHours"
                      type="number"
                      min="1"
                      max="6"
                      value={formData.creditHours}
                      onChange={(e) => setFormData({ ...formData, creditHours: parseInt(e.target.value) })}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="name">Course Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Introduction to Programming"
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
                    <Label htmlFor="level">Year Level *</Label>
                    <select
                      id="level"
                      value={formData.level}
                      onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      required
                    >
                      <option value="1">Year 1</option>
                      <option value="2">Year 2</option>
                      <option value="3">Year 3</option>
                      <option value="4">Year 4</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description</Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      rows={3}
                      placeholder="Course description..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isElective"
                      checked={formData.isElective}
                      onChange={(e) => setFormData({ ...formData, isElective: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <Label htmlFor="isElective">This is an elective course</Label>
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
                    Create Course
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Courses by Level */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {coursesByLevel.map(({ level, courses: levelCourses }) => (
              levelCourses.length > 0 && (
                <Card key={level} className="card-modern">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {getLevelBadge(level)}
                          Year {level} Courses
                        </CardTitle>
                        <CardDescription>
                          {levelCourses.length} course{levelCourses.length !== 1 ? 's' : ''} available
                        </CardDescription>
                      </div>
                      <Award className="h-8 w-8 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {levelCourses.map((course) => (
                        <Card key={course.id} className="hover:shadow-lg transition-all border-2">
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-bold text-lg">{course.code}</h4>
                                <p className="text-xs text-gray-500">{course.department?.name}</p>
                              </div>
                              <div className="flex flex-col gap-1">
                                <Badge className="bg-indigo-100 text-indigo-700 text-xs">
                                  {course.creditHours} Credits
                                </Badge>
                                {course.isElective && (
                                  <Badge variant="outline" className="text-xs">
                                    Elective
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-sm font-medium text-gray-700 mb-2">
                              {course.name}
                            </p>

                            {course.description && (
                              <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                                {course.description}
                              </p>
                            )}

                            {course.prerequisites && course.prerequisites.length > 0 && (
                              <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                                <div className="flex items-start gap-1">
                                  <AlertCircle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-medium text-yellow-800">
                                      Prerequisites:
                                    </p>
                                    <ul className="text-xs text-yellow-700 mt-1">
                                      {course.prerequisites.map((prereq, idx) => (
                                        <li key={idx}>
                                          {prereq.prerequisite.code}
                                          {prereq.isStrict && ' (Required)'}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 text-xs">
                                Edit
                              </Button>
                              <Button size="sm" className="flex-1 text-xs">
                                Prerequisites
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="card-modern bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">Course Management Tips</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2 text-sm">
            <p>• <strong>Course Codes:</strong> Use consistent naming (e.g., CS101, MATH201)</p>
            <p>• <strong>Credit Hours:</strong> Typically 3-4 credits per course</p>
            <p>• <strong>Prerequisites:</strong> Set up course dependencies after creating courses</p>
            <p>• <strong>Electives:</strong> Mark courses that are optional for students</p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

