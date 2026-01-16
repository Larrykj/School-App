'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  Calendar,
  Clock,
  FileText,
  Plus,
  Edit,
  Trash2,
  Users,
  MapPin,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BookOpen,
} from 'lucide-react';

interface Exam {
  id: string;
  title: string;
  examType: string;
  subject: string;
  class: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  venue: string;
  totalMarks: number;
  passingMarks: number;
  instructions?: string;
  status: 'UPCOMING' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  _count?: {
    students: number;
  };
}

const EXAM_TYPES = [
  { value: 'MID_TERM', label: 'Mid-Term Exam', color: 'bg-blue-500' },
  { value: 'END_TERM', label: 'End-Term Exam', color: 'bg-purple-500' },
  { value: 'CONTINUOUS_ASSESSMENT', label: 'CAT', color: 'bg-yellow-500' },
  { value: 'FINAL', label: 'Final Exam', color: 'bg-red-500' },
];

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    examType: 'MID_TERM',
    subject: '',
    class: '',
    date: '',
    startTime: '',
    endTime: '',
    duration: 120,
    venue: '',
    totalMarks: 100,
    passingMarks: 40,
    instructions: '',
  });

  useEffect(() => {
    fetchExams();
  }, [filter]);

  const fetchExams = async () => {
    try {
      const params = filter !== 'all' ? { status: filter } : {};
      const response = await api.get('/exams', { params });
      setExams(response.data.exams || []);
    } catch (error) {
      console.error('Failed to fetch exams:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setExams([
      {
        id: '1',
        title: 'Mathematics Mid-Term Examination',
        examType: 'MID_TERM',
        subject: 'Mathematics',
        class: 'Form 4A',
        date: '2024-12-15',
        startTime: '08:00',
        endTime: '10:00',
        duration: 120,
        venue: 'Main Hall',
        totalMarks: 100,
        passingMarks: 40,
        status: 'UPCOMING',
        _count: { students: 45 },
      },
      {
        id: '2',
        title: 'English Literature CAT',
        examType: 'CONTINUOUS_ASSESSMENT',
        subject: 'English',
        class: 'Form 4A',
        date: '2024-12-10',
        startTime: '10:30',
        endTime: '11:30',
        duration: 60,
        venue: 'Room 203',
        totalMarks: 30,
        passingMarks: 12,
        status: 'COMPLETED',
        _count: { students: 45 },
      },
      {
        id: '3',
        title: 'Physics Final Exam',
        examType: 'FINAL',
        subject: 'Physics',
        class: 'Form 4B',
        date: '2024-12-20',
        startTime: '14:00',
        endTime: '17:00',
        duration: 180,
        venue: 'Science Lab',
        totalMarks: 100,
        passingMarks: 40,
        status: 'UPCOMING',
        _count: { students: 38 },
      },
    ]);
  };

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/exams', formData);
      alert('Exam created successfully!');
      setShowCreateForm(false);
      setFormData({
        title: '',
        examType: 'MID_TERM',
        subject: '',
        class: '',
        date: '',
        startTime: '',
        endTime: '',
        duration: 120,
        venue: '',
        totalMarks: 100,
        passingMarks: 40,
        instructions: '',
      });
      await fetchExams();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create exam');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      UPCOMING: { color: 'bg-blue-500', icon: Clock, label: 'Upcoming' },
      ONGOING: { color: 'bg-green-500', icon: AlertCircle, label: 'Ongoing' },
      COMPLETED: { color: 'bg-gray-500', icon: CheckCircle, label: 'Completed' },
      CANCELLED: { color: 'bg-red-500', icon: AlertCircle, label: 'Cancelled' },
    };

    const config = statusMap[status] || statusMap.UPCOMING;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const getExamTypeBadge = (type: string) => {
    const examType = EXAM_TYPES.find((t) => t.value === type);
    return (
      <Badge className={examType?.color || 'bg-gray-500'}>
        {examType?.label || type}
      </Badge>
    );
  };

  const filteredExams = exams.filter((exam) => {
    if (filter === 'all') return true;
    return exam.status === filter.toUpperCase();
  });

  const stats = {
    total: exams.length,
    upcoming: exams.filter((e) => e.status === 'UPCOMING').length,
    ongoing: exams.filter((e) => e.status === 'ONGOING').length,
    completed: exams.filter((e) => e.status === 'COMPLETED').length,
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Examination Management
            </h1>
            <p className="text-gray-600 mt-2">Manage exams, schedules, and assessments</p>
          </div>

          <Button onClick={() => setShowCreateForm(!showCreateForm)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Exam
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card
            className={`card-modern cursor-pointer transition-all ${
              filter === 'all' ? 'border-2 border-indigo-500' : ''
            }`}
            onClick={() => setFilter('all')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Exams</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <FileText className="h-10 w-10 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`card-modern cursor-pointer transition-all ${
              filter === 'upcoming' ? 'border-2 border-blue-500' : ''
            }`}
            onClick={() => setFilter('upcoming')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Upcoming</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.upcoming}</p>
                </div>
                <Clock className="h-10 w-10 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`card-modern cursor-pointer transition-all ${
              filter === 'ongoing' ? 'border-2 border-green-500' : ''
            }`}
            onClick={() => setFilter('ongoing')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ongoing</p>
                  <p className="text-3xl font-bold text-green-600">{stats.ongoing}</p>
                </div>
                <AlertCircle className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className={`card-modern cursor-pointer transition-all ${
              filter === 'completed' ? 'border-2 border-gray-500' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-gray-600">{stats.completed}</p>
                </div>
                <CheckCircle className="h-10 w-10 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Create Exam Form */}
        {showCreateForm && (
          <Card className="card-modern border-2 border-indigo-500 animate-fadeIn">
            <CardHeader>
              <CardTitle>Create New Exam</CardTitle>
              <CardDescription>Schedule a new examination</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="title">Exam Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleChange('title', e.target.value)}
                      placeholder="e.g., Mathematics Mid-Term Examination"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="examType">Exam Type *</Label>
                    <select
                      id="examType"
                      value={formData.examType}
                      onChange={(e) => handleChange('examType', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      required
                    >
                      {EXAM_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      placeholder="e.g., Mathematics"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="class">Class *</Label>
                    <Input
                      id="class"
                      value={formData.class}
                      onChange={(e) => handleChange('class', e.target.value)}
                      placeholder="e.g., Form 4A"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleChange('date', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="startTime">Start Time *</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => handleChange('startTime', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => handleChange('endTime', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (minutes) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleChange('duration', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="venue">Venue *</Label>
                    <Input
                      id="venue"
                      value={formData.venue}
                      onChange={(e) => handleChange('venue', e.target.value)}
                      placeholder="e.g., Main Hall"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="totalMarks">Total Marks *</Label>
                    <Input
                      id="totalMarks"
                      type="number"
                      value={formData.totalMarks}
                      onChange={(e) => handleChange('totalMarks', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="passingMarks">Passing Marks *</Label>
                    <Input
                      id="passingMarks"
                      type="number"
                      value={formData.passingMarks}
                      onChange={(e) => handleChange('passingMarks', parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="instructions">Instructions</Label>
                    <textarea
                      id="instructions"
                      value={formData.instructions}
                      onChange={(e) => handleChange('instructions', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      rows={3}
                      placeholder="Special instructions for students..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Exam</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Exams List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredExams.map((exam, idx) => (
              <Card
                key={exam.id}
                className="card-modern hover:shadow-xl transition-all animate-fadeIn"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    {getExamTypeBadge(exam.examType)}
                    {getStatusBadge(exam.status)}
                  </div>
                  <CardTitle className="text-xl">{exam.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <BookOpen className="h-4 w-4" />
                      <span>{exam.subject}</span>
                      <span className="text-gray-400">•</span>
                      <span>{exam.class}</span>
                    </div>
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Date & Time */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-indigo-600" />
                      <span>{new Date(exam.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-indigo-600" />
                      <span>
                        {exam.startTime} - {exam.endTime}
                      </span>
                    </div>
                  </div>

                  {/* Venue & Students */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-indigo-600" />
                      <span>{exam.venue}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-indigo-600" />
                      <span>{exam._count?.students || 0} students</span>
                    </div>
                  </div>

                  {/* Marks Info */}
                  <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Marks:</span>
                      <span className="font-bold text-indigo-600">{exam.totalMarks}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Passing Marks:</span>
                      <span className="font-bold text-green-600">{exam.passingMarks}</span>
                    </div>
                    <div className="flex justify-between text-sm mt-1">
                      <span className="text-gray-600">Duration:</span>
                      <span className="font-bold text-gray-900">{exam.duration} mins</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-1" />
                      Students
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">This Week</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
                  <p className="text-xs text-blue-700 mt-1">Upcoming exams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">Completed</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                  <p className="text-xs text-green-700 mt-1">Results pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-purple-900 mb-1">Total Students</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {exams.reduce((sum, e) => sum + (e._count?.students || 0), 0)}
                  </p>
                  <p className="text-xs text-purple-700 mt-1">Across all exams</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

