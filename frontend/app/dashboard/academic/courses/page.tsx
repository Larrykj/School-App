'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { BookOpen, Users, Clock, MapPin, CheckCircle, XCircle, AlertCircle, GraduationCap } from 'lucide-react';

interface Course {
  offeringId: string;
  courseCode: string;
  courseName: string;
  creditHours: number;
  isElective: boolean;
  lecturer: string;
  venue?: string;
  maxStudents: number;
  enrolled: number;
  spotsLeft: number;
  isFull: boolean;
  canRegister: boolean;
  prerequisitesMet: boolean;
  missingPrerequisites: string[];
}

interface RegisteredCourse {
  registrationId: string;
  status: string;
  courseCode: string;
  courseName: string;
  creditHours: number;
  lecturer: string;
  venue?: string;
}

export default function CourseRegistrationPage() {
  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
  const [semesterId, setSemesterId] = useState<string | null>(null);
  const [semesterName, setSemesterName] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Get active semester
      const semesterRes = await api.get('/academic/semesters/active');
      const semester = semesterRes.data.semester;
      setSemesterId(semester.id);
      setSemesterName(semester.name);

      // Get student's enrollment (mock for now - should come from auth context)
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // For demo, use first enrollment if exists
        const enrollmentRes = await api.get(`/students/${user.id}`);
        // Mock enrollment ID - in production, get from student's enrollments
        const mockEnrollmentId = 'enrollment-' + user.id;
        setEnrollmentId(mockEnrollmentId);

        // Fetch available and registered courses
        await Promise.all([
          fetchAvailableCourses(mockEnrollmentId, semester.id),
          fetchRegisteredCourses(mockEnrollmentId, semester.id),
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // Use demo data
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableCourses = async (enrollmentId: string, semesterId: string) => {
    try {
      const response = await api.get('/academic/registrations/available', {
        params: { enrollmentId, semesterId },
      });
      setAvailableCourses(response.data.courses || []);
    } catch (error) {
      console.error('Failed to fetch available courses:', error);
    }
  };

  const fetchRegisteredCourses = async (enrollmentId: string, semesterId: string) => {
    try {
      const response = await api.get('/academic/registrations/student', {
        params: { enrollmentId, semesterId },
      });
      setRegisteredCourses(response.data.courses || []);
    } catch (error) {
      console.error('Failed to fetch registered courses:', error);
    }
  };

  const setDemoData = () => {
    setSemesterName('Semester 1 2024/2025');
    setEnrollmentId('demo-enrollment');
    
    setAvailableCourses([
      {
        offeringId: '1',
        courseCode: 'CS101',
        courseName: 'Introduction to Programming',
        creditHours: 3,
        isElective: false,
        lecturer: 'Dr. John Smith',
        venue: 'Lab A',
        maxStudents: 50,
        enrolled: 35,
        spotsLeft: 15,
        isFull: false,
        canRegister: true,
        prerequisitesMet: true,
        missingPrerequisites: [],
      },
      {
        offeringId: '2',
        courseCode: 'MATH201',
        courseName: 'Calculus II',
        creditHours: 4,
        isElective: false,
        lecturer: 'Prof. Jane Doe',
        venue: 'Room 204',
        maxStudents: 40,
        enrolled: 38,
        spotsLeft: 2,
        isFull: false,
        canRegister: false,
        prerequisitesMet: false,
        missingPrerequisites: ['MATH101 - Calculus I'],
      },
      {
        offeringId: '3',
        courseCode: 'CS301',
        courseName: 'Data Structures',
        creditHours: 3,
        isElective: false,
        lecturer: 'Dr. Mike Johnson',
        venue: 'Lab B',
        maxStudents: 45,
        enrolled: 32,
        spotsLeft: 13,
        isFull: false,
        canRegister: true,
        prerequisitesMet: true,
        missingPrerequisites: [],
      },
    ]);

    setRegisteredCourses([
      {
        registrationId: 'reg1',
        status: 'APPROVED',
        courseCode: 'ENG101',
        courseName: 'Communication Skills',
        creditHours: 3,
        lecturer: 'Dr. Sarah Williams',
        venue: 'Room 101',
      },
      {
        registrationId: 'reg2',
        status: 'PENDING',
        courseCode: 'CS201',
        courseName: 'Object Oriented Programming',
        creditHours: 3,
        lecturer: 'Dr. David Brown',
        venue: 'Lab C',
      },
    ]);
  };

  const handleRegister = async (offeringId: string) => {
    if (!enrollmentId || !semesterId) {
      alert('Missing enrollment or semester information');
      return;
    }

    try {
      const response = await api.post('/academic/registrations', {
        enrollmentId,
        offeringId,
        semesterId,
      });

      alert(response.data.message);
      
      // Refresh data
      await Promise.all([
        fetchAvailableCourses(enrollmentId, semesterId),
        fetchRegisteredCourses(enrollmentId, semesterId),
      ]);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to register for course');
    }
  };

  const handleDrop = async (registrationId: string) => {
    if (!confirm('Are you sure you want to drop this course?')) {
      return;
    }

    try {
      const reason = prompt('Reason for dropping (optional):');
      
      await api.delete(`/academic/registrations/${registrationId}`, {
        data: { reason },
      });

      alert('Course dropped successfully');
      
      // Refresh data
      if (enrollmentId && semesterId) {
        await Promise.all([
          fetchAvailableCourses(enrollmentId, semesterId),
          fetchRegisteredCourses(enrollmentId, semesterId),
        ]);
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to drop course');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <Badge className="bg-green-500"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>;
      case 'PENDING':
        return <Badge className="bg-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const totalCredits = registeredCourses
    .filter(c => c.status !== 'REJECTED')
    .reduce((sum, course) => sum + course.creditHours, 0);

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Course Registration
            </h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {semesterName}
            </p>
          </div>
          
          <Card className="card-modern">
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-sm text-gray-600">Total Credits</p>
                <p className="text-3xl font-bold text-indigo-600">{totalCredits}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Registered Courses */}
            <div className="lg:col-span-1">
              <Card className="card-modern animate-fadeIn h-fit sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    My Courses ({registeredCourses.length})
                  </CardTitle>
                  <CardDescription>
                    Your registered courses for this semester
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {registeredCourses.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>No courses registered yet</p>
                    </div>
                  ) : (
                    registeredCourses.map((course) => (
                      <Card key={course.registrationId} className="border-2 hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-sm">{course.courseCode}</p>
                              <p className="text-xs text-gray-600">{course.courseName}</p>
                            </div>
                            {getStatusBadge(course.status)}
                          </div>
                          
                          <div className="space-y-1 text-xs text-gray-600 mt-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {course.lecturer}
                            </div>
                            {course.venue && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {course.venue}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {course.creditHours} Credits
                            </div>
                          </div>

                          {course.status !== 'REJECTED' && (
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full mt-3"
                              onClick={() => handleDrop(course.registrationId)}
                            >
                              Drop Course
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Available Courses */}
            <div className="lg:col-span-2">
              <Card className="card-modern animate-fadeIn" style={{ animationDelay: '100ms' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-500" />
                    Available Courses
                  </CardTitle>
                  <CardDescription>
                    Select courses to add to your schedule
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {availableCourses.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg">No courses available for registration</p>
                      <p className="text-sm mt-2">Check back during the registration period</p>
                    </div>
                  ) : (
                    availableCourses.map((course) => (
                      <Card
                        key={course.offeringId}
                        className={`border-2 hover:shadow-lg transition-all ${
                          !course.canRegister ? 'opacity-60' : ''
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-xl font-bold text-gray-900">
                                  {course.courseCode}
                                </h3>
                                {course.isElective && (
                                  <Badge variant="outline" className="text-xs">
                                    Elective
                                  </Badge>
                                )}
                                <Badge className="bg-indigo-100 text-indigo-700">
                                  {course.creditHours} Credits
                                </Badge>
                              </div>
                              
                              <p className="text-gray-700 font-medium mb-3">
                                {course.courseName}
                              </p>

                              <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>{course.lecturer}</span>
                                </div>
                                {course.venue && (
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    <span>{course.venue}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4" />
                                  <span>
                                    {course.enrolled}/{course.maxStudents} students
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {course.isFull ? (
                                    <XCircle className="h-4 w-4 text-red-500" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4 text-green-500" />
                                  )}
                                  <span>
                                    {course.spotsLeft} spots left
                                  </span>
                                </div>
                              </div>

                              {!course.prerequisitesMet && course.missingPrerequisites.length > 0 && (
                                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                    <div>
                                      <p className="text-sm font-medium text-yellow-800">
                                        Missing Prerequisites:
                                      </p>
                                      <ul className="text-xs text-yellow-700 mt-1 list-disc list-inside">
                                        {course.missingPrerequisites.map((prereq, idx) => (
                                          <li key={idx}>{prereq}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="ml-4">
                              <Button
                                onClick={() => handleRegister(course.offeringId)}
                                disabled={!course.canRegister || course.isFull}
                                className="whitespace-nowrap"
                              >
                                {course.isFull ? 'Full' : 'Register'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

