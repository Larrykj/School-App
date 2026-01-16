'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { FileText, Download, Printer, Eye, Calendar } from 'lucide-react';

interface Transcript {
  id: string;
  generatedDate: string;
  isOfficial: boolean;
}

interface TranscriptData {
  student: {
    name: string;
    registrationNumber: string;
    nationalId?: string;
    program: string;
    department: string;
  };
  academic: {
    enrollmentDate: Date;
    expectedGraduation?: Date;
    yearOfStudy: number;
    currentGPA: number;
    cumulativeCredits: number;
    status: string;
    academicStanding: string;
  };
  semesters: Array<{
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
  }>;
  summary: {
    totalCreditsRequired: number;
    totalCreditsEarned: number;
    overallGPA: number;
    academicStanding: string;
    graduationEligibility: {
      eligible: boolean;
      reason?: string;
    };
  };
}

export default function TranscriptPage() {
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [viewingTranscript, setViewingTranscript] = useState<TranscriptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchTranscripts();
  }, []);

  const fetchTranscripts = async () => {
    try {
      // Mock enrollment ID
      const enrollmentId = 'mock-enrollment-id';
      
      const response = await api.get(`/academic/transcripts/${enrollmentId}`);
      setTranscripts(response.data.transcripts || []);
    } catch (error) {
      console.error('Failed to fetch transcripts:', error);
      // Use demo data
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setTranscripts([
      {
        id: 'trans1',
        generatedDate: new Date().toISOString(),
        isOfficial: false,
      },
      {
        id: 'trans2',
        generatedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        isOfficial: true,
      },
    ]);
  };

  const generateNewTranscript = async (isOfficial: boolean) => {
    setGenerating(true);
    try {
      const enrollmentId = 'mock-enrollment-id';
      
      await api.post(`/academic/transcripts/${enrollmentId}`, { isOfficial });
      
      alert('Transcript generated successfully!');
      await fetchTranscripts();
    } catch (error) {
      alert('Failed to generate transcript');
    } finally {
      setGenerating(false);
    }
  };

  const viewTranscript = async (transcriptId: string) => {
    try {
      const response = await api.get(`/academic/transcripts/${transcriptId}`);
      setViewingTranscript(response.data.transcript.data);
    } catch (error) {
      alert('Failed to load transcript');
    }
  };

  const printTranscript = async () => {
    try {
      const enrollmentId = 'mock-enrollment-id';
      
      // Open transcript HTML in new window
      const response = await api.get(`/academic/transcripts/${enrollmentId}/html`, {
        responseType: 'text',
      });
      
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(response.data);
        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
          printWindow.print();
        }, 250);
      }
    } catch (error) {
      alert('Failed to open transcript for printing');
    }
  };

  if (viewingTranscript) {
    return (
      <Layout>
        <div className="p-6 space-y-6 bg-white min-h-screen">
          <div className="flex justify-between items-center">
            <Button variant="outline" onClick={() => setViewingTranscript(null)}>
              ← Back to List
            </Button>
            <Button onClick={printTranscript} className="flex items-center gap-2">
              <Printer className="h-4 w-4" />
              Print Transcript
            </Button>
          </div>

          {/* Transcript Preview */}
          <div className="max-w-4xl mx-auto bg-white shadow-2xl p-12 border-4 border-gray-200">
            {/* Header */}
            <div className="text-center border-b-4 border-gray-800 pb-6 mb-8">
              <h1 className="text-4xl font-bold mb-2">ACADEMIC TRANSCRIPT</h1>
              <h2 className="text-2xl text-gray-700">Official Record of Academic Achievement</h2>
            </div>

            {/* Student Info */}
            <div className="space-y-3 mb-8">
              <div className="flex">
                <span className="font-bold w-48">Student Name:</span>
                <span>{viewingTranscript.student.name}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-48">Registration Number:</span>
                <span>{viewingTranscript.student.registrationNumber}</span>
              </div>
              {viewingTranscript.student.nationalId && (
                <div className="flex">
                  <span className="font-bold w-48">National ID:</span>
                  <span>{viewingTranscript.student.nationalId}</span>
                </div>
              )}
              <div className="flex">
                <span className="font-bold w-48">Program:</span>
                <span>{viewingTranscript.student.program}</span>
              </div>
              <div className="flex">
                <span className="font-bold w-48">Department:</span>
                <span>{viewingTranscript.student.department}</span>
              </div>
            </div>

            {/* Semesters */}
            {viewingTranscript.semesters.map((semester, idx) => (
              <div key={idx} className="mb-8">
                <div className="bg-gray-200 font-bold p-3 mb-3">
                  {semester.semester} - {semester.academicYear}
                </div>
                <table className="w-full border-collapse border border-gray-400 mb-2">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-400 p-2 text-left">Course Code</th>
                      <th className="border border-gray-400 p-2 text-left">Course Name</th>
                      <th className="border border-gray-400 p-2 text-center">Credits</th>
                      <th className="border border-gray-400 p-2 text-center">Grade</th>
                      <th className="border border-gray-400 p-2 text-center">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {semester.courses.map((course, cidx) => (
                      <tr key={cidx}>
                        <td className="border border-gray-400 p-2">{course.code}</td>
                        <td className="border border-gray-400 p-2">{course.name}</td>
                        <td className="border border-gray-400 p-2 text-center">{course.creditHours}</td>
                        <td className="border border-gray-400 p-2 text-center font-bold">{course.grade}</td>
                        <td className="border border-gray-400 p-2 text-center">{course.gradePoints.toFixed(2)}</td>
                      </tr>
                    ))}
                    <tr className="bg-gray-100 font-bold">
                      <td colSpan={2} className="border border-gray-400 p-2">Semester Summary</td>
                      <td className="border border-gray-400 p-2 text-center">{semester.creditsEarned}</td>
                      <td colSpan={2} className="border border-gray-400 p-2 text-center">
                        Semester GPA: {semester.semesterGPA.toFixed(2)} | Cumulative: {semester.cumulativeGPA.toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

            {/* Summary */}
            <div className="border-4 border-gray-800 p-6 bg-gray-50 mt-8">
              <h3 className="text-2xl font-bold mb-4">Academic Summary</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-bold w-64">Cumulative GPA:</span>
                  <span className="text-xl">{viewingTranscript.summary.overallGPA.toFixed(2)} / 4.0</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-64">Credits Earned:</span>
                  <span>{viewingTranscript.summary.totalCreditsEarned} / {viewingTranscript.summary.totalCreditsRequired}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-64">Academic Standing:</span>
                  <span>{viewingTranscript.summary.academicStanding}</span>
                </div>
                <div className="flex">
                  <span className="font-bold w-64">Graduation Status:</span>
                  <span>
                    {viewingTranscript.summary.graduationEligibility.eligible
                      ? 'Eligible for Graduation'
                      : viewingTranscript.summary.graduationEligibility.reason}
                  </span>
                </div>
              </div>
            </div>

            {/* Grading Scale */}
            <div className="mt-8 text-sm text-gray-600">
              <strong>Grading Scale:</strong> A (70-100) = 4.0 | B (60-69) = 3.0 | C (50-59) = 2.0 | D (40-49) = 1.0 | E (0-39) = 0.0
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-400 text-sm text-gray-600">
              <p>This is an official academic transcript generated on {new Date().toLocaleDateString()}.</p>
              <p className="mt-2">This document contains the complete academic record as maintained by the institution.</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex justify-between items-start animate-fadeIn">
          <div>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Academic Transcripts
            </h1>
            <p className="text-gray-600 mt-2">View and download your academic transcripts</p>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => generateNewTranscript(false)}
              disabled={generating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {generating ? 'Generating...' : 'Generate Unofficial'}
            </Button>
            <Button
              onClick={() => generateNewTranscript(true)}
              disabled={generating}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {generating ? 'Generating...' : 'Request Official'}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {transcripts.length === 0 ? (
              <Card className="col-span-full card-modern">
                <CardContent className="p-12 text-center">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg text-gray-600 mb-2">No transcripts available</p>
                  <p className="text-sm text-gray-500 mb-6">Generate your first transcript to get started</p>
                  <Button onClick={() => generateNewTranscript(false)}>
                    Generate Transcript
                  </Button>
                </CardContent>
              </Card>
            ) : (
              transcripts.map((transcript, idx) => (
                <Card key={transcript.id} className="card-modern animate-fadeIn hover:shadow-xl transition-all" style={{ animationDelay: `${idx * 100}ms` }}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <FileText className="h-12 w-12 text-indigo-500" />
                      {transcript.isOfficial && (
                        <Badge className="bg-green-500">Official</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Generated: {new Date(transcript.generatedDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => viewTranscript(transcript.id)}
                        className="flex-1 flex items-center justify-center gap-2"
                        variant="outline"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Button>
                      <Button
                        onClick={printTranscript}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        <Printer className="h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Info Card */}
        <Card className="card-modern animate-fadeIn bg-blue-50 border-blue-200" style={{ animationDelay: '300ms' }}>
          <CardHeader>
            <CardTitle className="text-blue-900">About Transcripts</CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800 space-y-2 text-sm">
            <p>
              <strong>Unofficial Transcript:</strong> Can be generated instantly for your personal use. Great for applications, planning, or review.
            </p>
            <p>
              <strong>Official Transcript:</strong> Requires admin approval and carries an official seal. Used for job applications, further education, etc.
            </p>
            <p className="text-xs text-blue-600 mt-4">
              Official transcripts may take 2-5 business days to process.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

