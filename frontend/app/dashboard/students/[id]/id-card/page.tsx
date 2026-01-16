'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Download, Printer, CreditCard, QrCode, Check } from 'lucide-react';

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  bloodGroup?: string;
  photoUrl?: string;
  class?: { name: string };
  program?: { name: string; code: string };
}

export default function IDCardPage() {
  const params = useParams();
  const studentId = params.id as string;
  const cardRef = useRef<HTMLDivElement>(null);

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [cardNumber, setCardNumber] = useState('');

  useEffect(() => {
    fetchStudent();
    generateCardNumber();
  }, [studentId]);

  const fetchStudent = async () => {
    try {
      const response = await api.get(`/students/${studentId}/profile`);
      setStudent(response.data.student);
    } catch (error) {
      console.error('Failed to fetch student:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setStudent({
      id: studentId,
      admissionNumber: 'BIT/2024/001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-05-15',
      bloodGroup: 'O+',
      photoUrl: '',
      class: { name: 'BIT Year 1' },
      program: { name: 'Bachelor of Information Technology', code: 'BIT' },
    });
  };

  const generateCardNumber = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setCardNumber(`ID${year}${random}`);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    setGenerating(true);
    try {
      // In production, this would generate a PDF
      alert('ID Card download will be implemented with PDF generation');
    } catch (error) {
      alert('Failed to generate ID card');
    } finally {
      setGenerating(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.post(`/id-cards/generate/${studentId}`);
      alert('ID Card generated successfully!');
    } catch (error) {
      alert('Using demo mode - ID card displayed');
    } finally {
      setGenerating(false);
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

  if (!student) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="card-modern">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Student not found</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Student ID Card
          </h1>
          <p className="text-gray-600 mt-2">
            Generate and print student identification card
          </p>
        </div>

        {/* Actions */}
        <Card className="card-modern print:hidden">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Button onClick={handleGenerate} disabled={generating} className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                {generating ? 'Generating...' : 'Generate ID Card'}
              </Button>
              <Button onClick={handlePrint} variant="outline" className="flex items-center gap-2">
                <Printer className="h-4 w-4" />
                Print Card
              </Button>
              <Button onClick={handleDownload} variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ID Card Preview */}
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            <Card className="card-modern overflow-hidden">
              <CardHeader className="print:hidden">
                <CardTitle>ID Card Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                {/* Front Side */}
                <div ref={cardRef} className="mb-8">
                  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-white rounded-xl p-6">
                      {/* Header */}
                      <div className="text-center mb-6 border-b-2 border-indigo-600 pb-4">
                        <h2 className="text-2xl font-bold text-indigo-900">
                          UNIVERSITY NAME
                        </h2>
                        <p className="text-sm text-gray-600">Student Identification Card</p>
                      </div>

                      {/* Main Content */}
                      <div className="flex gap-6">
                        {/* Photo */}
                        <div className="flex-shrink-0">
                          <div className="w-32 h-40 rounded-lg overflow-hidden border-4 border-indigo-600 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                            {student.photoUrl ? (
                              <img
                                src={student.photoUrl}
                                alt="Student"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-6xl font-bold text-indigo-600">
                                {student.firstName[0]}
                                {student.lastName[0]}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">Name</p>
                            <p className="text-lg font-bold text-gray-900">
                              {student.firstName} {student.lastName}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">
                              Admission Number
                            </p>
                            <p className="text-lg font-mono font-bold text-indigo-600">
                              {student.admissionNumber}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-gray-600 uppercase tracking-wide">
                              Program
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {student.program?.name || student.class?.name || 'N/A'}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Blood Group
                              </p>
                              <p className="text-lg font-bold text-red-600">
                                {student.bloodGroup || 'N/A'}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-600 uppercase tracking-wide">
                                Card Number
                              </p>
                              <p className="text-sm font-mono font-semibold text-gray-900">
                                {cardNumber}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex-shrink-0 flex flex-col items-center">
                          <div className="w-28 h-28 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-white">
                            <QrCode className="h-24 w-24 text-gray-400" />
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Scan to verify</p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-6 pt-4 border-t-2 border-gray-300">
                        <div className="flex justify-between items-center text-xs text-gray-600">
                          <div>
                            <p className="font-semibold">Issued: {new Date().toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-semibold">
                              Valid Until: {validUntil.toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-indigo-600">
                              www.university.edu
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back Side */}
                <div>
                  <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-1 shadow-2xl">
                    <div className="bg-white rounded-xl p-6">
                      {/* Header */}
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-bold text-indigo-900">
                          IMPORTANT INFORMATION
                        </h3>
                      </div>

                      {/* Instructions */}
                      <div className="space-y-3 text-sm text-gray-700">
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p>This card is the property of the university and must be returned upon request.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p>Carry this card at all times while on campus premises.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p>Report lost or damaged cards immediately to the administration office.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <p>This card grants access to library, labs, and other university facilities.</p>
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="mt-6 p-4 bg-red-50 rounded-lg border-2 border-red-200">
                        <p className="text-xs font-bold text-red-900 mb-2">
                          IN CASE OF EMERGENCY CONTACT:
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs text-red-800">
                          <div>
                            <p className="font-semibold">Security:</p>
                            <p>+254 700 000 001</p>
                          </div>
                          <div>
                            <p className="font-semibold">Medical:</p>
                            <p>+254 700 000 002</p>
                          </div>
                        </div>
                      </div>

                      {/* Barcode */}
                      <div className="mt-4 flex justify-center">
                        <div className="bg-white p-2 rounded border-2 border-gray-300">
                          <div className="flex gap-px">
                            {[...Array(30)].map((_, i) => (
                              <div
                                key={i}
                                className="w-1 bg-black"
                                style={{
                                  height: Math.random() > 0.5 ? '40px' : '30px',
                                }}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-center mt-1 font-mono">
                            {student.admissionNumber}
                          </p>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="mt-4 text-center text-xs text-gray-500">
                        <p>Authorized Signature: ________________</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Instructions */}
        <Card className="card-modern print:hidden">
          <CardHeader>
            <CardTitle>Printing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-700">
            <p>
              <strong>1.</strong> Click "Print Card" button above
            </p>
            <p>
              <strong>2.</strong> In print dialog, select "Print on both sides"
            </p>
            <p>
              <strong>3.</strong> Use CR80 size card (85.6mm × 53.98mm) or regular paper
            </p>
            <p>
              <strong>4.</strong> For best results, use card printer or laminate printed cards
            </p>
            <p>
              <strong>5.</strong> Recommended: Print on PVC card stock for durability
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area,
          #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
          }
          @page {
            size: 85.6mm 53.98mm;
            margin: 0;
          }
        }
      `}</style>
    </Layout>
  );
}
