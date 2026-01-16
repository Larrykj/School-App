'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { Users, DollarSign, Search, CheckCircle, ArrowLeft } from 'lucide-react';

interface FeeStructure {
  id: string;
  name: string;
  amount: string;
  term: string;
  academicYear: string;
  description?: string;
}

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  class?: {
    name: string;
  };
}

export default function AssignFeePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const feeId = searchParams.get('feeId');

  const [feeStructure, setFeeStructure] = useState<FeeStructure | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (feeId) {
      fetchData();
    }
  }, [feeId]);

  useEffect(() => {
    filterStudents();
  }, [searchTerm, students]);

  const fetchData = async () => {
    try {
      const [feeRes, studentsRes] = await Promise.all([
        api.get(`/fees/structures/${feeId}`),
        api.get('/students'),
      ]);

      setFeeStructure(feeRes.data.feeStructure);
      setStudents(studentsRes.data.students || []);
      setFilteredStudents(studentsRes.data.students || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setFeeStructure({
      id: feeId || '1',
      name: 'Tuition Fee',
      amount: '50000',
      term: 'Term 1',
      academicYear: '2024',
      description: 'Standard tuition fee',
    });

    const demoStudents = [
      {
        id: '1',
        admissionNumber: 'STD001',
        firstName: 'John',
        lastName: 'Doe',
        class: { name: 'Form 4A' },
      },
      {
        id: '2',
        admissionNumber: 'STD002',
        firstName: 'Jane',
        lastName: 'Smith',
        class: { name: 'Form 4A' },
      },
      {
        id: '3',
        admissionNumber: 'STD003',
        firstName: 'Mike',
        lastName: 'Johnson',
        class: { name: 'Form 3B' },
      },
      {
        id: '4',
        admissionNumber: 'STD004',
        firstName: 'Sarah',
        lastName: 'Williams',
        class: { name: 'Form 3B' },
      },
    ];

    setStudents(demoStudents);
    setFilteredStudents(demoStudents);
  };

  const filterStudents = () => {
    if (!searchTerm.trim()) {
      setFilteredStudents(students);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = students.filter(
      (student) =>
        student.admissionNumber.toLowerCase().includes(term) ||
        student.firstName.toLowerCase().includes(term) ||
        student.lastName.toLowerCase().includes(term) ||
        student.class?.name.toLowerCase().includes(term)
    );

    setFilteredStudents(filtered);
  };

  const toggleStudent = (studentId: string) => {
    const newSelected = new Set(selectedStudents);
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId);
    } else {
      newSelected.add(studentId);
    }
    setSelectedStudents(newSelected);
  };

  const toggleAll = () => {
    if (selectedStudents.size === filteredStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredStudents.map((s) => s.id)));
    }
  };

  const handleAssign = async () => {
    if (selectedStudents.size === 0) {
      alert('Please select at least one student');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/fees/assign', {
        feeStructureId: feeId,
        studentIds: Array.from(selectedStudents),
      });

      alert(`Fee assigned to ${selectedStudents.size} student(s) successfully!`);
      router.push('/dashboard/fees');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to assign fees');
    } finally {
      setSubmitting(false);
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

  if (!feeStructure) {
    return (
      <Layout>
        <div className="p-6">
          <Card className="card-modern">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600 mb-4">Fee structure not found</p>
              <Button onClick={() => router.push('/dashboard/fees')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Fees
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between animate-fadeIn">
          <div>
            <Button
              variant="outline"
              onClick={() => router.push('/dashboard/fees')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Fees
            </Button>
            <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Assign Fee to Students
            </h1>
            <p className="text-gray-600 mt-2">Select students to assign this fee</p>
          </div>
        </div>

        {/* Fee Details */}
        <Card className="card-modern border-2 border-indigo-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{feeStructure.name}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {feeStructure.term} - {feeStructure.academicYear}
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-3xl font-bold text-indigo-600">
                  <DollarSign className="h-8 w-8" />
                  KES {parseFloat(feeStructure.amount).toLocaleString()}
                </div>
              </div>
            </div>
          </CardHeader>
          {feeStructure.description && (
            <CardContent>
              <p className="text-gray-600">{feeStructure.description}</p>
            </CardContent>
          )}
        </Card>

        {/* Selection Summary */}
        <Card className="card-modern bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selected Students</p>
                  <p className="text-3xl font-bold text-green-600">{selectedStudents.size}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Amount</p>
                <p className="text-3xl font-bold text-green-600">
                  KES {(selectedStudents.size * parseFloat(feeStructure.amount)).toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search & Filters */}
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name, admission number, or class..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={toggleAll}>
                {selectedStudents.size === filteredStudents.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Students ({filteredStudents.length})</CardTitle>
            <CardDescription>Click on students to select them</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No students found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudents.has(student.id);
                  return (
                    <Card
                      key={student.id}
                      className={`cursor-pointer transition-all hover:shadow-lg ${
                        isSelected
                          ? 'border-2 border-green-500 bg-green-50'
                          : 'border-2 border-gray-200 hover:border-indigo-300'
                      }`}
                      onClick={() => toggleStudent(student.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900">
                              {student.firstName} {student.lastName}
                            </h4>
                            <p className="text-sm text-gray-600">{student.admissionNumber}</p>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          )}
                        </div>
                        {student.class && (
                          <Badge variant="outline" className="text-xs">
                            {student.class.name}
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {selectedStudents.size > 0 && (
          <Card className="card-modern bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    You're about to assign this fee to {selectedStudents.size} student(s)
                  </p>
                  <p className="text-lg font-bold text-indigo-600">
                    Total: KES {(selectedStudents.size * parseFloat(feeStructure.amount)).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedStudents(new Set())}
                    disabled={submitting}
                  >
                    Clear Selection
                  </Button>
                  <Button onClick={handleAssign} disabled={submitting} className="min-w-[150px]">
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Assigning...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Assign Fee
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

