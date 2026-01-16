'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { BookOpen, Users, CheckCircle, Edit, Save, Calculator, TrendingUp } from 'lucide-react';

interface CourseOffering {
  id: string;
  course: {
    code: string;
    name: string;
    creditHours: number;
  };
  semester: {
    name: string;
    academicYear: {
      name: string;
    };
  };
  _count?: {
    registrations: number;
  };
}

interface StudentGrade {
  enrollmentId: string;
  offeringId: string;
  student: {
    name: string;
    registrationNumber: string;
  };
  catMarks?: number;
  examMarks?: number;
  totalMarks?: number;
  letterGrade?: string;
  gradePoints?: number;
  isPublished: boolean;
}

export default function GradeSubmissionPage() {
  const [offerings, setOfferings] = useState<CourseOffering[]>([]);
  const [selectedOffering, setSelectedOffering] = useState<string | null>(null);
  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingStudent, setEditingStudent] = useState<string | null>(null);
  const [grades, setGrades] = useState<{[key: string]: { cat: number; exam: number }}>({});

  useEffect(() => {
    fetchOfferings();
  }, []);

  const fetchOfferings = async () => {
    try {
      // Get current semester
      const semesterRes = await api.get('/academic/semesters/active');
      const semesterId = semesterRes.data.semester.id;

      // Get lecturer's offerings (mock lecturer ID for demo)
      const response = await api.get('/academic/offerings', {
        params: { semesterId },
      });

      setOfferings(response.data.offerings || []);
    } catch (error) {
      console.error('Failed to fetch offerings:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setOfferings([
      {
        id: 'off1',
        course: {
          code: 'CS101',
          name: 'Introduction to Programming',
          creditHours: 3,
        },
        semester: {
          name: 'Semester 1',
          academicYear: { name: '2024/2025' },
        },
        _count: { registrations: 45 },
      },
      {
        id: 'off2',
        course: {
          code: 'CS301',
          name: 'Data Structures',
          creditHours: 3,
        },
        semester: {
          name: 'Semester 1',
          academicYear: { name: '2024/2025' },
        },
        _count: { registrations: 38 },
      },
    ]);
  };

  const fetchStudents = async (offeringId: string) => {
    try {
      // In production, fetch enrolled students for this offering
      // For demo, use mock data
      setDemoStudents();
    } catch (error) {
      console.error('Failed to fetch students:', error);
      setDemoStudents();
    }
  };

  const setDemoStudents = () => {
    setStudents([
      {
        enrollmentId: 'enr1',
        offeringId: selectedOffering!,
        student: { name: 'John Doe', registrationNumber: 'BIT/2024/001' },
        catMarks: 28,
        examMarks: 65,
        totalMarks: 57.4,
        letterGrade: 'C',
        gradePoints: 2.0,
        isPublished: true,
      },
      {
        enrollmentId: 'enr2',
        offeringId: selectedOffering!,
        student: { name: 'Jane Smith', registrationNumber: 'BIT/2024/002' },
        catMarks: 25,
        examMarks: 70,
        totalMarks: 56.5,
        letterGrade: 'C',
        gradePoints: 2.0,
        isPublished: true,
      },
      {
        enrollmentId: 'enr3',
        offeringId: selectedOffering!,
        student: { name: 'Mike Johnson', registrationNumber: 'BIT/2024/003' },
        isPublished: false,
      },
      {
        enrollmentId: 'enr4',
        offeringId: selectedOffering!,
        student: { name: 'Sarah Williams', registrationNumber: 'BIT/2024/004' },
        isPublished: false,
      },
    ]);
  };

  const handleSelectOffering = (offeringId: string) => {
    setSelectedOffering(offeringId);
    fetchStudents(offeringId);
  };

  const calculateGrade = (cat: number, exam: number) => {
    const total = (cat * 0.3) + (exam * 0.7);
    let grade = 'E';
    let points = 0;

    if (total >= 70) { grade = 'A'; points = 4.0; }
    else if (total >= 60) { grade = 'B'; points = 3.0; }
    else if (total >= 50) { grade = 'C'; points = 2.0; }
    else if (total >= 40) { grade = 'D'; points = 1.0; }

    return { total: total.toFixed(1), grade, points };
  };

  const handleEditGrade = (enrollmentId: string, cat?: number, exam?: number) => {
    setEditingStudent(enrollmentId);
    setGrades({
      ...grades,
      [enrollmentId]: {
        cat: cat || 0,
        exam: exam || 0,
      },
    });
  };

  const handleSubmitGrade = async (enrollmentId: string) => {
    const grade = grades[enrollmentId];
    if (!grade || !selectedOffering) return;

    if (grade.cat > 30 || grade.exam > 70) {
      alert('Invalid marks! CAT should be out of 30, Exam out of 70');
      return;
    }

    setSubmitting(true);
    try {
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;

      await api.post('/academic/grades', {
        enrollmentId,
        offeringId: selectedOffering,
        catMarks: grade.cat,
        examMarks: grade.exam,
        submittedBy: user?.id || 'lecturer-id',
      });

      alert('Grade submitted successfully!');
      setEditingStudent(null);
      
      // Refresh students
      fetchStudents(selectedOffering);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit grade');
    } finally {
      setSubmitting(false);
    }
  };

  const getGradeColor = (grade?: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'E': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const selectedCourse = offerings.find(o => o.id === selectedOffering);
  const gradedCount = students.filter(s => s.isPublished).length;
  const pendingCount = students.filter(s => !s.isPublished).length;

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Grade Submission
          </h1>
          <p className="text-gray-600 mt-2">Submit and manage student grades</p>
        </div>

        {/* Select Course */}
        {!selectedOffering ? (
          <div className="space-y-4">
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Select Course</CardTitle>
                <CardDescription>Choose a course to submit grades</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                  </div>
                ) : offerings.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                    <p>No course offerings assigned to you</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offerings.map((offering) => (
                      <Card
                        key={offering.id}
                        className="hover:shadow-lg transition-all cursor-pointer border-2 hover:border-indigo-500"
                        onClick={() => handleSelectOffering(offering.id)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">
                                {offering.course.code}
                              </h3>
                              <p className="text-sm text-gray-600">{offering.course.name}</p>
                            </div>
                            <Badge className="bg-indigo-100 text-indigo-700">
                              {offering.course.creditHours} Credits
                            </Badge>
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>{offering.semester.name} {offering.semester.academicYear.name}</span>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{offering._count?.registrations || 0} students</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Course Info & Stats */}
            <div className="flex justify-between items-start">
              <Card className="card-modern flex-1">
                <CardContent className="p-6">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedOffering(null);
                      setStudents([]);
                    }}
                    className="mb-4"
                  >
                    ← Back to Courses
                  </Button>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedCourse?.course.code}</h2>
                    <p className="text-gray-600">{selectedCourse?.course.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {selectedCourse?.semester.name} {selectedCourse?.semester.academicYear.name}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-3 gap-4 ml-4">
                <Card className="card-modern">
                  <CardContent className="p-4 text-center">
                    <Users className="h-6 w-6 mx-auto mb-2 text-indigo-600" />
                    <p className="text-sm text-gray-600">Total Students</p>
                    <p className="text-2xl font-bold">{students.length}</p>
                  </CardContent>
                </Card>

                <Card className="card-modern">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600" />
                    <p className="text-sm text-gray-600">Graded</p>
                    <p className="text-2xl font-bold text-green-600">{gradedCount}</p>
                  </CardContent>
                </Card>

                <Card className="card-modern">
                  <CardContent className="p-4 text-center">
                    <Edit className="h-6 w-6 mx-auto mb-2 text-yellow-600" />
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Students Table */}
            <Card className="card-modern">
              <CardHeader>
                <CardTitle>Student Grades</CardTitle>
                <CardDescription>
                  CAT (30%) + Exam (70%) = Total (100%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left p-3 text-sm font-semibold">Reg Number</th>
                        <th className="text-left p-3 text-sm font-semibold">Student Name</th>
                        <th className="text-center p-3 text-sm font-semibold">CAT /30</th>
                        <th className="text-center p-3 text-sm font-semibold">Exam /70</th>
                        <th className="text-center p-3 text-sm font-semibold">Total</th>
                        <th className="text-center p-3 text-sm font-semibold">Grade</th>
                        <th className="text-center p-3 text-sm font-semibold">Points</th>
                        <th className="text-center p-3 text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {students.map((student) => {
                        const isEditing = editingStudent === student.enrollmentId;
                        const currentGrades = grades[student.enrollmentId];
                        const preview = currentGrades && calculateGrade(currentGrades.cat, currentGrades.exam);

                        return (
                          <tr key={student.enrollmentId} className="border-b hover:bg-gray-50">
                            <td className="p-3 text-sm">{student.student.registrationNumber}</td>
                            <td className="p-3 text-sm font-medium">{student.student.name}</td>
                            
                            <td className="p-3 text-center">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  min="0"
                                  max="30"
                                  value={currentGrades?.cat || ''}
                                  onChange={(e) => setGrades({
                                    ...grades,
                                    [student.enrollmentId]: {
                                      ...currentGrades,
                                      cat: parseFloat(e.target.value) || 0,
                                    },
                                  })}
                                  className="w-20 mx-auto"
                                />
                              ) : (
                                <span className="text-sm">{student.catMarks || '-'}</span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  min="0"
                                  max="70"
                                  value={currentGrades?.exam || ''}
                                  onChange={(e) => setGrades({
                                    ...grades,
                                    [student.enrollmentId]: {
                                      ...currentGrades,
                                      exam: parseFloat(e.target.value) || 0,
                                    },
                                  })}
                                  className="w-20 mx-auto"
                                />
                              ) : (
                                <span className="text-sm">{student.examMarks || '-'}</span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              <span className="text-sm font-semibold">
                                {isEditing && preview ? preview.total : student.totalMarks?.toFixed(1) || '-'}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              {(isEditing && preview) || student.letterGrade ? (
                                <Badge className={getGradeColor(isEditing && preview ? preview.grade : student.letterGrade)}>
                                  {isEditing && preview ? preview.grade : student.letterGrade}
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-400">-</span>
                              )}
                            </td>

                            <td className="p-3 text-center">
                              <span className="text-sm">
                                {isEditing && preview ? preview.points.toFixed(1) : student.gradePoints?.toFixed(1) || '-'}
                              </span>
                            </td>

                            <td className="p-3 text-center">
                              {isEditing ? (
                                <div className="flex gap-1 justify-center">
                                  <Button
                                    size="sm"
                                    onClick={() => handleSubmitGrade(student.enrollmentId)}
                                    disabled={submitting}
                                    className="flex items-center gap-1"
                                  >
                                    <Save className="h-3 w-3" />
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setEditingStudent(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditGrade(
                                    student.enrollmentId,
                                    student.catMarks,
                                    student.examMarks
                                  )}
                                  className="flex items-center gap-1"
                                >
                                  <Edit className="h-3 w-3" />
                                  {student.isPublished ? 'Edit' : 'Add'}
                                </Button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Grading Info */}
            <Card className="card-modern bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Grading Information
                </CardTitle>
              </CardHeader>
              <CardContent className="text-blue-800 space-y-2 text-sm">
                <p>
                  <strong>Grade Calculation:</strong> Total = (CAT × 0.3) + (Exam × 0.7)
                </p>
                <div className="grid grid-cols-5 gap-2 mt-3">
                  {[
                    { grade: 'A', range: '70-100%', points: '4.0' },
                    { grade: 'B', range: '60-69%', points: '3.0' },
                    { grade: 'C', range: '50-59%', points: '2.0' },
                    { grade: 'D', range: '40-49%', points: '1.0' },
                    { grade: 'E', range: '0-39%', points: '0.0' },
                  ].map((item) => (
                    <div key={item.grade} className="bg-white p-2 rounded text-center border border-blue-200">
                      <div className="font-bold text-lg">{item.grade}</div>
                      <div className="text-xs text-gray-600">{item.range}</div>
                      <div className="text-xs text-blue-600">{item.points} pts</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  );
}

