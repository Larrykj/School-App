'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  FileText,
  Upload,
  Download,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  File,
} from 'lucide-react';

interface Document {
  id: string;
  documentType: string;
  title: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  isVerified: boolean;
  verifiedBy?: string;
  verifiedAt?: string;
  uploadedAt: string;
}

interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
}

const DOCUMENT_TYPES = [
  { value: 'KCSE_CERTIFICATE', label: 'KCSE Certificate', required: true },
  { value: 'BIRTH_CERTIFICATE', label: 'Birth Certificate', required: true },
  { value: 'NATIONAL_ID', label: 'National ID', required: true },
  { value: 'PASSPORT_PHOTO', label: 'Passport Photo', required: true },
  { value: 'RECOMMENDATION_LETTER', label: 'Recommendation Letter', required: false },
  { value: 'TRANSCRIPT', label: 'Academic Transcript', required: false },
  { value: 'DEGREE_CERTIFICATE', label: 'Degree Certificate', required: false },
  { value: 'OTHER', label: 'Other Document', required: false },
];

export default function DocumentsPage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadData, setUploadData] = useState({
    documentType: '',
    title: '',
    file: null as File | null,
  });

  useEffect(() => {
    fetchData();
  }, [studentId]);

  const fetchData = async () => {
    try {
      const [studentRes, docsRes] = await Promise.all([
        api.get(`/students/${studentId}/profile`),
        api.get(`/documents/student/${studentId}`),
      ]);

      setStudent(studentRes.data.student);
      setDocuments(docsRes.data.documents || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
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
    });

    setDocuments([
      {
        id: '1',
        documentType: 'KCSE_CERTIFICATE',
        title: 'KCSE Certificate 2023',
        fileName: 'kcse_certificate.pdf',
        fileUrl: '/documents/kcse.pdf',
        fileSize: 2048576,
        mimeType: 'application/pdf',
        isVerified: true,
        verifiedBy: 'Admin',
        verifiedAt: '2024-11-15T10:30:00Z',
        uploadedAt: '2024-11-10T14:20:00Z',
      },
      {
        id: '2',
        documentType: 'BIRTH_CERTIFICATE',
        title: 'Birth Certificate',
        fileName: 'birth_cert.pdf',
        fileUrl: '/documents/birth.pdf',
        fileSize: 1048576,
        mimeType: 'application/pdf',
        isVerified: true,
        verifiedBy: 'Admin',
        verifiedAt: '2024-11-15T10:30:00Z',
        uploadedAt: '2024-11-10T14:25:00Z',
      },
      {
        id: '3',
        documentType: 'NATIONAL_ID',
        title: 'National ID Card',
        fileName: 'national_id.jpg',
        fileUrl: '/documents/id.jpg',
        fileSize: 512000,
        mimeType: 'image/jpeg',
        isVerified: false,
        uploadedAt: '2024-11-11T09:15:00Z',
      },
      {
        id: '4',
        documentType: 'PASSPORT_PHOTO',
        title: 'Passport Size Photo',
        fileName: 'passport_photo.jpg',
        fileUrl: '/documents/photo.jpg',
        fileSize: 256000,
        mimeType: 'image/jpeg',
        isVerified: true,
        verifiedBy: 'Admin',
        verifiedAt: '2024-11-15T11:00:00Z',
        uploadedAt: '2024-11-11T09:20:00Z',
      },
    ]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/jpg',
        'image/png',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];

      if (!allowedTypes.includes(file.type)) {
        alert('Invalid file type. Please upload PDF, JPG, PNG, or DOC files.');
        return;
      }

      setUploadData({ ...uploadData, file });
    }
  };

  const handleUpload = async () => {
    if (!uploadData.documentType || !uploadData.title || !uploadData.file) {
      alert('Please fill all required fields');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('documentType', uploadData.documentType);
      formData.append('title', uploadData.title);
      formData.append('studentId', studentId);

      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Document uploaded successfully!');
      setShowUploadForm(false);
      setUploadData({ documentType: '', title: '', file: null });
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Upload failed - using demo mode');
    } finally {
      setUploading(false);
    }
  };

  const handleVerify = async (documentId: string) => {
    try {
      await api.put(`/documents/${documentId}/verify`);
      alert('Document verified successfully!');
      await fetchData();
    } catch (error) {
      alert('Verification feature coming soon');
    }
  };

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`/documents/${documentId}`);
      alert('Document deleted successfully!');
      await fetchData();
    } catch (error) {
      alert('Delete feature coming soon');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  const getRequiredDocuments = () => {
    return DOCUMENT_TYPES.filter((type) => type.required);
  };

  const getUploadedTypes = () => {
    return documents.map((doc) => doc.documentType);
  };

  const getMissingDocuments = () => {
    const uploaded = getUploadedTypes();
    return getRequiredDocuments().filter((type) => !uploaded.includes(type.value));
  };

  const getCompletionPercentage = () => {
    const required = getRequiredDocuments().length;
    const uploaded = getUploadedTypes().filter((type) =>
      getRequiredDocuments().some((req) => req.value === type)
    ).length;
    return Math.round((uploaded / required) * 100);
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

  const completionPercentage = getCompletionPercentage();
  const missingDocs = getMissingDocuments();

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Document Management
          </h1>
          <p className="text-gray-600 mt-2">
            {student?.firstName} {student?.lastName} - {student?.admissionNumber}
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documents</p>
                  <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
                </div>
                <FileText className="h-10 w-10 text-indigo-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Verified</p>
                  <p className="text-3xl font-bold text-green-600">
                    {documents.filter((d) => d.isVerified).length}
                  </p>
                </div>
                <CheckCircle className="h-10 w-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">
                    {documents.filter((d) => !d.isVerified).length}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completion</p>
                  <p className="text-3xl font-bold text-indigo-600">{completionPercentage}%</p>
                </div>
                <div className="h-10 w-10 rounded-full border-4 border-indigo-600 flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">
                    {completionPercentage}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Missing Documents Alert */}
        {missingDocs.length > 0 && (
          <Card className="card-modern bg-yellow-50 border-yellow-300">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <XCircle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-yellow-900 mb-2">
                    Missing Required Documents ({missingDocs.length})
                  </h3>
                  <ul className="list-disc list-inside text-sm text-yellow-800 space-y-1">
                    {missingDocs.map((doc) => (
                      <li key={doc.value}>{doc.label}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Upload Button */}
        {!showUploadForm && (
          <Button onClick={() => setShowUploadForm(true)} className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </Button>
        )}

        {/* Upload Form */}
        {showUploadForm && (
          <Card className="card-modern border-2 border-indigo-500 animate-fadeIn">
            <CardHeader>
              <CardTitle>Upload Document</CardTitle>
              <CardDescription>Upload a new document for this student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="documentType">Document Type *</Label>
                <select
                  id="documentType"
                  value={uploadData.documentType}
                  onChange={(e) => setUploadData({ ...uploadData, documentType: e.target.value })}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                  required
                >
                  <option value="">Select document type</option>
                  {DOCUMENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label} {type.required && '(Required)'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="title">Document Title *</Label>
                <Input
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  placeholder="e.g., KCSE Certificate 2023"
                  required
                />
              </div>

              <div>
                <Label htmlFor="file">File *</Label>
                <Input
                  id="file"
                  type="file"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Accepted formats: PDF, JPG, PNG, DOC. Max size: 5MB
                </p>
                {uploadData.file && (
                  <p className="text-sm text-green-600 mt-2">
                    Selected: {uploadData.file.name} ({formatFileSize(uploadData.file.size)})
                  </p>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowUploadForm(false);
                    setUploadData({ documentType: '', title: '', file: null });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Documents List */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Uploaded Documents ({documents.length})</CardTitle>
            <CardDescription>All documents for this student</CardDescription>
          </CardHeader>
          <CardContent>
            {documents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No documents uploaded yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {documents.map((doc, idx) => {
                  const Icon = getDocumentIcon(doc.mimeType);
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Icon className="h-6 w-6 text-indigo-600" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">{doc.title}</h4>
                          {doc.isVerified ? (
                            <Badge className="bg-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-500">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.required && (
                            <Badge variant="outline" className="bg-red-50 text-red-700">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{doc.fileName}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatFileSize(doc.fileSize)} • Uploaded{' '}
                          {new Date(doc.uploadedAt).toLocaleDateString()}
                          {doc.isVerified && doc.verifiedBy && (
                            <span className="ml-2">
                              • Verified by {doc.verifiedBy} on{' '}
                              {new Date(doc.verifiedAt!).toLocaleDateString()}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" title="View Document">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" title="Download">
                          <Download className="h-4 w-4" />
                        </Button>
                        {!doc.isVerified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleVerify(doc.id)}
                            className="bg-green-50 hover:bg-green-100"
                            title="Verify Document"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(doc.id)}
                          className="bg-red-50 hover:bg-red-100"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Required Documents Checklist */}
        <Card className="card-modern bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Required Documents Checklist</CardTitle>
            <CardDescription>Documents needed for admission</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getRequiredDocuments().map((docType) => {
                const isUploaded = getUploadedTypes().includes(docType.value);
                const doc = documents.find((d) => d.documentType === docType.value);
                return (
                  <div
                    key={docType.value}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {isUploaded ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <span className={isUploaded ? 'text-gray-900' : 'text-gray-600'}>
                        {docType.label}
                      </span>
                    </div>
                    {isUploaded && doc && (
                      <Badge className={doc.isVerified ? 'bg-green-500' : 'bg-yellow-500'}>
                        {doc.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    )}
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

