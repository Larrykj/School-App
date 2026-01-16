'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { TrendingUp, Award, BookOpen, Target, CheckCircle, AlertCircle } from 'lucide-react';

interface GPAData {
  currentGPA: number;
  cumulativeGPA: number;
  cumulativeCredits: number;
  academicStanding: string;
  graduationEligibility: {
    eligible: boolean;
    reason?: string;
    missingCredits?: number;
    currentGPA?: number;
  };
}

interface SemesterData {
  semester: string;
  academicYear: string;
  courses: Array<{
    code: string;
    name: string;
    creditHours: number;
    grade: string;
    gradePoints: number;
  }>;
  semesterGPA: number;
  cumulativeGPA: number;
  creditsEarned: number;
}

export default function GPADashboardPage() {
  const [gpaData, setGPAData] = useState<GPAData | null>(null);
  const [semesterHistory, setSemesterHistory] = useState<SemesterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGPAData();
  }, []);

  const fetchGPAData = async () => {
    try {
      // Mock enrollment ID - in production, get from auth context
      const enrollmentId = 'mock-enrollment-id';
      
      const response = await api.get(`/academic/gpa/${enrollmentId}`);
      setGPAData(response.data);
    } catch (error) {
      console.error('Failed to fetch GPA data:', error);
      // Use demo data
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setGPAData({
      currentGPA: 3.2,
      cumulativeGPA: 3.15,
      cumulativeCredits: 45,
      academicStanding: 'Second Class Honors (Upper Division)',
      graduationEligibility: {
        eligible: false,
        reason: 'Insufficient credit hours',
        missingCredits: 75,
      },
    });

    setSemesterHistory([
      {
        semester: 'Semester 1',
        academicYear: '2024/2025',
        courses: [
          { code: 'CS101', name: 'Intro to Programming', creditHours: 3, grade: 'A', gradePoints: 4.0 },
          { code: 'MATH101', name: 'Calculus I', creditHours: 4, grade: 'B', gradePoints: 3.0 },
          { code: 'ENG101', name: 'Communication Skills', creditHours: 3, grade: 'C', gradePoints: 2.0 },
        ],
        semesterGPA: 3.0,
        cumulativeGPA: 3.0,
        creditsEarned: 10,
      },
      {
        semester: 'Semester 2',
        academicYear: '2023/2024',
        courses: [
          { code: 'CS201', name: 'OOP', creditHours: 3, grade: 'A', gradePoints: 4.0 },
          { code: 'MATH201', name: 'Calculus II', creditHours: 4, grade: 'B', gradePoints: 3.0 },
          { code: 'PHY101', name: 'Physics I', creditHours: 3, grade: 'B', gradePoints: 3.0 },
        ],
        semesterGPA: 3.3,
        cumulativeGPA: 3.15,
        creditsEarned: 10,
      },
    ]);
  };

  const getStandingColor = (standing: string) => {
    if (standing.includes('First Class')) return 'from-yellow-400 to-yellow-600';
    if (standing.includes('Upper')) return 'from-green-400 to-green-600';
    if (standing.includes('Lower')) return 'from-blue-400 to-blue-600';
    if (standing.includes('Pass')) return 'from-gray-400 to-gray-600';
    return 'from-red-400 to-red-600';
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.5) return 'text-yellow-600';
    if (gpa >= 3.0) return 'text-green-600';
    if (gpa >= 2.5) return 'text-blue-600';
    if (gpa >= 2.0) return 'text-gray-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'E': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Academic Performance
          </h1>
          <p className="text-gray-600 mt-2">Track your GPA and academic progress</p>
        </div>

        {/* GPA Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Cumulative GPA */}
          <Card className="card-modern animate-fadeIn border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-8 w-8 opacity-80" />
                <Award className="h-6 w-6 opacity-60" />
              </div>
              <p className="text-sm opacity-90">Cumulative GPA</p>
              <p className="text-5xl font-bold mt-2">{gpaData?.cumulativeGPA.toFixed(2)}</p>
              <p className="text-xs mt-2 opacity-75">Out of 4.0</p>
            </CardContent>
          </Card>

          {/* Current Semester GPA */}
          <Card className="card-modern animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-green-400 to-green-600 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Current Semester</p>
              <p className={`text-4xl font-bold mt-2 ${getGPAColor(gpaData?.currentGPA || 0)}`}>
                {gpaData?.currentGPA.toFixed(2)}
              </p>
              <p className="text-xs text-gray-500 mt-2">GPA</p>
            </CardContent>
          </Card>

          {/* Credits Earned */}
          <Card className="card-modern animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Credits Earned</p>
              <p className="text-4xl font-bold mt-2 text-blue-600">
                {gpaData?.cumulativeCredits}
              </p>
              <p className="text-xs text-gray-500 mt-2">Out of 120</p>
            </CardContent>
          </Card>

          {/* Academic Standing */}
          <Card className="card-modern animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-2 bg-gradient-to-br ${getStandingColor(gpaData?.academicStanding || '')} rounded-lg`}>
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">Academic Standing</p>
              <p className="text-sm font-bold mt-2 text-gray-900">
                {gpaData?.academicStanding}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Graduation Eligibility */}
        <Card className={`card-modern animate-fadeIn ${gpaData?.graduationEligibility.eligible ? 'border-green-500' : 'border-yellow-500'}`} style={{ animationDelay: '400ms' }}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              {gpaData?.graduationEligibility.eligible ? (
                <CheckCircle className="h-8 w-8 text-green-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-8 w-8 text-yellow-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">
                  {gpaData?.graduationEligibility.eligible ? 'Eligible for Graduation! 🎓' : 'Graduation Requirements'}
                </h3>
                {gpaData?.graduationEligibility.eligible ? (
                  <p className="text-gray-600">
                    Congratulations! You have met all requirements for graduation.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-gray-600">{gpaData?.graduationEligibility.reason}</p>
                    {gpaData?.graduationEligibility.missingCredits && (
                      <p className="text-sm text-gray-500">
                        You need <span className="font-bold">{gpaData.graduationEligibility.missingCredits}</span> more credits to graduate.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semester History */}
        <Card className="card-modern animate-fadeIn" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle>Academic History</CardTitle>
            <CardDescription>Your semester-by-semester performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {semesterHistory.map((semester, idx) => (
              <div key={idx} className="border-l-4 border-indigo-500 pl-6 py-4 bg-gray-50 rounded-r-lg">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{semester.semester}</h4>
                    <p className="text-sm text-gray-600">{semester.academicYear}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Semester GPA</p>
                    <p className={`text-2xl font-bold ${getGPAColor(semester.semesterGPA)}`}>
                      {semester.semesterGPA.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-300">
                        <th className="text-left py-2 px-2">Course Code</th>
                        <th className="text-left py-2 px-2">Course Name</th>
                        <th className="text-center py-2 px-2">Credits</th>
                        <th className="text-center py-2 px-2">Grade</th>
                        <th className="text-center py-2 px-2">Points</th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((course, cidx) => (
                        <tr key={cidx} className="border-b border-gray-200">
                          <td className="py-2 px-2 font-medium">{course.code}</td>
                          <td className="py-2 px-2">{course.name}</td>
                          <td className="py-2 px-2 text-center">{course.creditHours}</td>
                          <td className="py-2 px-2 text-center">
                            <Badge className={getGradeColor(course.grade)}>
                              {course.grade}
                            </Badge>
                          </td>
                          <td className="py-2 px-2 text-center font-semibold">
                            {course.gradePoints.toFixed(1)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-indigo-50 font-semibold">
                        <td colSpan={2} className="py-2 px-2">Total</td>
                        <td className="py-2 px-2 text-center">{semester.creditsEarned}</td>
                        <td colSpan={2} className="py-2 px-2 text-center">
                          CGPA: {semester.cumulativeGPA.toFixed(2)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Grading Scale Reference */}
        <Card className="card-modern animate-fadeIn" style={{ animationDelay: '600ms' }}>
          <CardHeader>
            <CardTitle>Grading Scale</CardTitle>
            <CardDescription>Kenyan University Grading System</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { grade: 'A', range: '70-100%', points: '4.0', desc: 'Excellent', color: 'green' },
                { grade: 'B', range: '60-69%', points: '3.0', desc: 'Good', color: 'blue' },
                { grade: 'C', range: '50-59%', points: '2.0', desc: 'Satisfactory', color: 'yellow' },
                { grade: 'D', range: '40-49%', points: '1.0', desc: 'Pass', color: 'orange' },
                { grade: 'E', range: '0-39%', points: '0.0', desc: 'Fail', color: 'red' },
              ].map((item) => (
                <div key={item.grade} className={`p-4 bg-${item.color}-50 border border-${item.color}-200 rounded-lg text-center`}>
                  <div className={`text-3xl font-bold text-${item.color}-600 mb-2`}>{item.grade}</div>
                  <div className="text-sm text-gray-700 font-medium">{item.range}</div>
                  <div className="text-xs text-gray-600 mt-1">{item.points} points</div>
                  <div className="text-xs text-gray-500 mt-1">{item.desc}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

