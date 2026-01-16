'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { BookOpen, ArrowLeft, Search, UserCheck, Loader2 } from 'lucide-react';

export default function IssueBookPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search states
  const [studentSearch, setStudentSearch] = useState('');
  const [bookSearch, setBookSearch] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  
  // Selected items
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [selectedBook, setSelectedBook] = useState<any>(null);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (studentSearch) {
      searchStudents();
    }
  }, [studentSearch]);

  useEffect(() => {
    if (bookSearch) {
      searchBooks();
    }
  }, [bookSearch]);

  const searchStudents = async () => {
    try {
      const response = await api.get('/students', {
        params: { search: studentSearch, limit: 10 }
      });
      setStudents(response.data.students || []);
    } catch (error) {
      console.error('Failed to search students:', error);
    }
  };

  const searchBooks = async () => {
    try {
      const response = await api.get('/library/books', {
        params: { search: bookSearch }
      });
      // Filter only available books
      const availableBooks = (response.data.books || []).filter((b: any) => b.available > 0);
      setBooks(availableBooks);
    } catch (error) {
      console.error('Failed to search books:', error);
    }
  };

  const handleIssue = async () => {
    if (!selectedStudent || !selectedBook || !dueDate) return;

    setLoading(true);
    setError('');

    try {
      await api.post('/library/issue', {
        studentId: selectedStudent.id,
        bookId: selectedBook.id,
        dueDate,
        notes,
      });

      alert('Book issued successfully!');
      router.push('/dashboard/library');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to issue book');
      console.error('Error issuing book:', err);
    } finally {
      setLoading(false);
    }
  };

  // Set default due date (14 days from now)
  useEffect(() => {
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 14);
    setDueDate(defaultDueDate.toISOString().split('T')[0]);
  }, []);

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Issue Book</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Issue a book to a student
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    step >= s
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > s ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-600">
            <span>Select Student</span>
            <span>Select Book</span>
            <span>Confirm</span>
          </div>
        </div>

        {error && (
          <div className="alert-error animate-shake mb-6">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Step 1: Select Student */}
        {step === 1 && (
          <Card className="card-modern border-0 animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                Select Student
              </CardTitle>
              <CardDescription>Search for the student borrowing the book</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name or admission number..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {students.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      onClick={() => {
                        setSelectedStudent(student);
                        setStep(2);
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer hover:border-indigo-500 transition-all ${
                        selectedStudent?.id === student.id ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {student.firstName[0]}{student.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{student.admissionNumber}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Select Book */}
        {step === 2 && selectedStudent && (
          <Card className="card-modern border-0 animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                Select Book
              </CardTitle>
              <CardDescription>
                Issuing book to: {selectedStudent.firstName} {selectedStudent.lastName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by title, author, or ISBN..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              {books.length > 0 && (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {books.map((book) => (
                    <div
                      key={book.id}
                      onClick={() => {
                        setSelectedBook(book);
                        setStep(3);
                      }}
                      className={`p-4 border-2 rounded-lg cursor-pointer hover:border-green-500 transition-all ${
                        selectedBook?.id === book.id ? 'border-green-500 bg-green-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{book.title}</p>
                          <p className="text-sm text-gray-500">{book.author}</p>
                          {book.isbn && (
                            <p className="text-xs text-gray-400 mt-1">ISBN: {book.isbn}</p>
                          )}
                        </div>
                        <Badge variant="success">
                          {book.available} Available
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Button variant="outline" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Confirm */}
        {step === 3 && selectedStudent && selectedBook && (
          <Card className="card-modern border-0 animate-fadeIn">
            <CardHeader>
              <CardTitle>Confirm Issue Details</CardTitle>
              <CardDescription>Review and set the due date</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Student:</span>
                  <span className="font-medium">
                    {selectedStudent.firstName} {selectedStudent.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Book:</span>
                  <span className="font-medium">{selectedBook.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Author:</span>
                  <span className="font-medium">{selectedBook.author}</span>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Due Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                  className="input-modern"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Standard borrowing period is 14 days
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  placeholder="Any additional notes..."
                  className="input-modern"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setStep(2)} disabled={loading}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleIssue}
                  disabled={loading}
                  className="flex-1 btn-gradient-success"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Issuing Book...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Issue Book
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

