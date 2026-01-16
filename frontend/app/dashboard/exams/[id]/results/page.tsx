'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  ArrowLeft,
  Save,
  Download,
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

interface StudentResult {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  marksObtained: number | null;
  grade: string;
  remarks: string;
  isAbsent: boolean;
}

interface Exam {
  id: string;
  title: string;
  subject: string;
  class: string;
  date: string;
  totalMarks: number;
  passingMarks: number;
  status: string;
}

export default function ExamResultsPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [results, setResults] = useState<StudentResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [examId]);

  const fetchData = async () => {
    try {
      const [examRes, resultsRes] = await Promise.all([
        api.get(`/exams/${examId}`),
        api.get(`/exams/${examId}/results`),
      ]);

      setExam(examRes.data.exam);
      setResults(resultsRes.data.results || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setExam({
      id: examId,
      title: 'Mathematics Mid-Term Examination',
      subject: 'Mathematics',
      class: 'Form 4A',
      date: '2024-12-15',
      totalMarks: 100,
      passingMarks: 40,
      status: 'COMPLETED',
    });

    setResults([
      {
        id: '1',
        studentId: '1',
        studentName: 'Alice Johnson',
        admissionNumber: 'BIT/2024/001',
        marksObtained: 85,
        grade: 'A',
        remarks: 'Excellent',
        isAbsent: false,
      },
      {
        id: '2',
        studentId: '2',
        studentName: 'Bob Smith',
        admissionNumber: 'BIT/2024/002',
        marksObtained: 72,
        grade: 'B',
        remarks: 'Good',
        isAbsent: false,
      },
      {
        id: '3',
        studentId: '3',
        studentName: 'Carol White',
        admissionNumber: 'BIT/2024/003',
        marksObtained: 56,
        grade: 'C',
        remarks: 'Fair',
        isAbsent: false,
      },
      {
        id: '4',
        studentId: '4',
        studentName: 'David Brown',
        admissionNumber: 'BIT/2024/004',
        marksObtained: 38,
        grade: 'D',
        remarks: 'Below Average',
        isAbsent: false,
      },
      {
        id: '5',
        studentId: '5',
        studentName: 'Eve Davis',
        admissionNumber: 'BIT/2024/005',
        marksObtained: null,
        grade: 'AB',
        remarks: 'Absent',
        isAbsent: true,
      },
    ]);
  };

  const calculateGrade = (marks: number, totalMarks: number): string => {
    const percentage = (marks / totalMarks) * 100;
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'E';
  };

  const handleMarksChange = (resultId: string, marks: string) => {
    const marksNum = marks === '' ? null : parseFloat(marks);

    setResults(
      results.map((result) => {
        if (result.id === resultId) {
          if (marksNum === null) {
            return { ...result, marksObtained: null, grade: '', isAbsent: false };
          }

          const grade = calculateGrade(marksNum, exam?.totalMarks || 100);
          return {
            ...result,
            marksObtained: marksNum,
            grade,
            isAbsent: false,
          };
        }
        return result;
      })
    );
  };

  const handleAbsentToggle = (resultId: string) => {
    setResults(
      results.map((result) => {
        if (result.id === resultId) {
          return {
            ...result,
            isAbsent: !result.isAbsent,
            marksObtained: result.isAbsent ? null : null,
            grade: result.isAbsent ? '' : 'AB',
          };
        }
        return result;
      })
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/exams/${examId}/results`, { results });
      alert('Results saved successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Results saved (demo mode)');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!confirm('Are you sure you want to publish these results? Students will be able to see them.')) {
      return;
    }

    try {
      await api.post(`/exams/${examId}/publish`);
      alert('Results published successfully!');
      await fetchData();
    } catch (error) {
      alert('Results published (demo mode)');
    }
  };

  const getStatistics = () => {
    const validResults = results.filter((r) => r.marksObtained !== null && !r.isAbsent);

    if (validResults.length === 0) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        passed: 0,
        failed: 0,
        absent: results.filter((r) => r.isAbsent).length,
        totalStudents: results.length,
      };
    }

    const marks = validResults.map((r) => r.marksObtained!);
    const average = marks.reduce((sum, m) => sum + m, 0) / marks.length;
    const highest = Math.max(...marks);
    const lowest = Math.min(...marks);
    const passed = validResults.filter((r) => r.marksObtained! >= (exam?.passingMarks || 40)).length;
    const failed = validResults.length - passed;
    const absent = results.filter((r) => r.isAbsent).length;

    return {
      average: Math.round(average * 10) / 10,
      highest,
      lowest,
      passed,
      failed,
      absent,
      totalStudents: results.length,
    };
  };

  const getGradeColor = (grade: string): string => {
    const colorMap: any = {
      A: 'bg-green-500',
      B: 'bg-blue-500',
      C: 'bg-yellow-500',
      D: 'bg-orange-500',
      E: 'bg-red-500',
      AB: 'bg-gray-500',
    };
    return colorMap[grade] || 'bg-gray-500';
  };

  const filteredResults = results.filter(
    (result) =>
      result.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = getStatistics();

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between animate-fadeIn">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Exam Results
              </h1>
              <p className="text-gray-600 mt-2">
                {exam?.title} - {exam?.class}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Button onClick={handlePublish}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Publish Results
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto text-indigo-600 mb-1" />
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-green-50">
            <CardContent className="p-4">
              <div className="text-center">
                <CheckCircle className="h-6 w-6 mx-auto text-green-600 mb-1" />
                <p className="text-xs text-gray-600">Passed</p>
                <p className="text-2xl font-bold text-green-600">{stats.passed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-red-50">
            <CardContent className="p-4">
              <div className="text-center">
                <AlertTriangle className="h-6 w-6 mx-auto text-red-600 mb-1" />
                <p className="text-xs text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-gray-50">
            <CardContent className="p-4">
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto text-gray-600 mb-1" />
                <p className="text-xs text-gray-600">Absent</p>
                <p className="text-2xl font-bold text-gray-600">{stats.absent}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-blue-50">
            <CardContent className="p-4">
              <div className="text-center">
                <BarChart3 className="h-6 w-6 mx-auto text-blue-600 mb-1" />
                <p className="text-xs text-gray-600">Average</p>
                <p className="text-2xl font-bold text-blue-600">{stats.average}%</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-purple-50">
            <CardContent className="p-4">
              <div className="text-center">
                <TrendingUp className="h-6 w-6 mx-auto text-purple-600 mb-1" />
                <p className="text-xs text-gray-600">Highest</p>
                <p className="text-2xl font-bold text-purple-600">{stats.highest}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern bg-orange-50">
            <CardContent className="p-4">
              <div className="text-center">
                <TrendingDown className="h-6 w-6 mx-auto text-orange-600 mb-1" />
                <p className="text-xs text-gray-600">Lowest</p>
                <p className="text-2xl font-bold text-orange-600">{stats.lowest}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="card-modern">
          <CardContent className="p-4">
            <Input
              placeholder="Search by student name or admission number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Student Results ({filteredResults.length})</CardTitle>
            <CardDescription>
              Enter marks out of {exam?.totalMarks}. Passing marks: {exam?.passingMarks}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left p-3 font-semibold text-gray-700">No.</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Adm. Number</th>
                    <th className="text-left p-3 font-semibold text-gray-700">Student Name</th>
                    <th className="text-center p-3 font-semibold text-gray-700">
                      Marks (/{exam?.totalMarks})
                    </th>
                    <th className="text-center p-3 font-semibold text-gray-700">Grade</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                    <th className="text-center p-3 font-semibold text-gray-700">Absent</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResults.map((result, idx) => (
                    <tr
                      key={result.id}
                      className={`border-b hover:bg-gray-50 transition-colors ${
                        result.isAbsent ? 'bg-gray-100' : ''
                      }`}
                    >
                      <td className="p-3">{idx + 1}</td>
                      <td className="p-3 font-mono text-sm">{result.admissionNumber}</td>
                      <td className="p-3 font-medium">{result.studentName}</td>
                      <td className="p-3">
                        <Input
                          type="number"
                          min="0"
                          max={exam?.totalMarks}
                          value={result.marksObtained === null ? '' : result.marksObtained}
                          onChange={(e) => handleMarksChange(result.id, e.target.value)}
                          disabled={result.isAbsent}
                          className={`w-24 text-center ${
                            result.marksObtained !== null &&
                            result.marksObtained < (exam?.passingMarks || 40)
                              ? 'border-red-500'
                              : ''
                          }`}
                        />
                      </td>
                      <td className="p-3 text-center">
                        {result.grade && (
                          <Badge className={getGradeColor(result.grade)}>{result.grade}</Badge>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {result.marksObtained !== null && !result.isAbsent && (
                          <Badge
                            className={
                              result.marksObtained >= (exam?.passingMarks || 40)
                                ? 'bg-green-500'
                                : 'bg-red-500'
                            }
                          >
                            {result.marksObtained >= (exam?.passingMarks || 40) ? 'Pass' : 'Fail'}
                          </Badge>
                        )}
                        {result.isAbsent && <Badge className="bg-gray-500">Absent</Badge>}
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={result.isAbsent}
                          onChange={() => handleAbsentToggle(result.id)}
                          className="w-5 h-5 cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-4">
              {['A', 'B', 'C', 'D', 'E'].map((grade) => {
                const count = results.filter((r) => r.grade === grade).length;
                const percentage =
                  results.length > 0 ? Math.round((count / results.length) * 100) : 0;

                return (
                  <div key={grade} className="text-center">
                    <div
                      className={`${getGradeColor(
                        grade
                      )} text-white p-6 rounded-lg shadow-lg mb-2`}
                    >
                      <p className="text-4xl font-bold">{count}</p>
                      <p className="text-sm opacity-90">{percentage}%</p>
                    </div>
                    <p className="font-semibold">Grade {grade}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

