'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import {
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  Eye,
  ThumbsUp,
  ThumbsDown,
  FileText,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';

interface Application {
  id: string;
  applicationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  submittedAt?: string;
  program: {
    code: string;
    name: string;
  };
  intake: string;
  _count?: {
    documents: number;
  };
}

interface Statistics {
  total: number;
  draft: number;
  submitted: number;
  underReview: number;
  approved: number;
  rejected: number;
  waitlisted: number;
}

export default function AdmissionsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchData();
  }, [selectedStatus]);

  const fetchData = async () => {
    try {
      const params: any = {};
      if (selectedStatus !== 'all') {
        params.status = selectedStatus.toUpperCase();
      }

      const [appsRes, statsRes] = await Promise.all([
        api.get('/applications', { params }),
        api.get('/applications/statistics'),
      ]);

      setApplications(appsRes.data.applications || []);
      setStatistics(statsRes.data.statistics);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    setStatistics({
      total: 45,
      draft: 8,
      submitted: 15,
      underReview: 12,
      approved: 8,
      rejected: 2,
      waitlisted: 0,
    });

    setApplications([
      {
        id: '1',
        applicationNumber: 'APP20240001',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+254712345678',
        status: 'SUBMITTED',
        submittedAt: '2024-11-15T10:30:00Z',
        program: { code: 'BIT', name: 'Bachelor of Information Technology' },
        intake: 'September 2024',
        _count: { documents: 4 },
      },
      {
        id: '2',
        applicationNumber: 'APP20240002',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+254787654321',
        status: 'UNDER_REVIEW',
        submittedAt: '2024-11-14T14:20:00Z',
        program: { code: 'DIT', name: 'Diploma in Information Technology' },
        intake: 'September 2024',
        _count: { documents: 4 },
      },
      {
        id: '3',
        applicationNumber: 'APP20240003',
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.j@example.com',
        phone: '+254798765432',
        status: 'APPROVED',
        submittedAt: '2024-11-10T09:15:00Z',
        program: { code: 'MBA', name: 'Master of Business Administration' },
        intake: 'January 2025',
        _count: { documents: 5 },
      },
    ]);
  };

  const handleAction = async (applicationId: string, action: 'approve' | 'reject' | 'review') => {
    try {
      if (action === 'reject') {
        const reason = prompt('Please provide a reason for rejection:');
        if (!reason) return;

        await api.put(`/applications/${applicationId}/reject`, { reason });
        alert('Application rejected');
      } else if (action === 'approve') {
        if (confirm('Are you sure you want to approve this application?')) {
          await api.put(`/applications/${applicationId}/approve`);
          alert('Application approved! Admission number generated.');
        }
      } else if (action === 'review') {
        await api.put(`/applications/${applicationId}/review`, {
          notes: 'Under review by admin',
        });
        alert('Application moved to review');
      }

      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.error || 'Action failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: any = {
      DRAFT: { color: 'bg-gray-500', icon: FileText, label: 'Draft' },
      SUBMITTED: { color: 'bg-blue-500', icon: Clock, label: 'Submitted' },
      UNDER_REVIEW: { color: 'bg-yellow-500', icon: AlertCircle, label: 'Under Review' },
      APPROVED: { color: 'bg-green-500', icon: CheckCircle, label: 'Approved' },
      REJECTED: { color: 'bg-red-500', icon: XCircle, label: 'Rejected' },
      WAITLISTED: { color: 'bg-purple-500', icon: Clock, label: 'Waitlisted' },
    };

    const config = statusMap[status] || statusMap.DRAFT;
    const Icon = config.icon;

    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    );
  };

  const filteredApplications = applications.filter(
    (app) =>
      app.applicationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header */}
        <div className="animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Admissions Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Manage student applications and admissions</p>
        </div>

        {/* Statistics Cards */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className={`card-modern cursor-pointer transition-all ${
                selectedStatus === 'all' ? 'border-2 border-indigo-500' : ''
              }`}
              onClick={() => setSelectedStatus('all')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Applications</p>
                    <p className="text-3xl font-bold text-gray-900">{statistics.total}</p>
                  </div>
                  <Users className="h-10 w-10 text-indigo-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`card-modern cursor-pointer transition-all ${
                selectedStatus === 'submitted' ? 'border-2 border-blue-500' : ''
              }`}
              onClick={() => setSelectedStatus('submitted')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="text-3xl font-bold text-blue-600">{statistics.submitted}</p>
                  </div>
                  <Clock className="h-10 w-10 text-blue-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`card-modern cursor-pointer transition-all ${
                selectedStatus === 'under_review' ? 'border-2 border-yellow-500' : ''
              }`}
              onClick={() => setSelectedStatus('under_review')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Under Review</p>
                    <p className="text-3xl font-bold text-yellow-600">{statistics.underReview}</p>
                  </div>
                  <AlertCircle className="h-10 w-10 text-yellow-400" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`card-modern cursor-pointer transition-all ${
                selectedStatus === 'approved' ? 'border-2 border-green-500' : ''
              }`}
              onClick={() => setSelectedStatus('approved')}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-3xl font-bold text-green-600">{statistics.approved}</p>
                  </div>
                  <CheckCircle className="h-10 w-10 text-green-400" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search & Filter */}
        <Card className="card-modern">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by application number, name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {selectedStatus === 'all' ? 'All Applications' : `${selectedStatus} Applications`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Applications Table */}
        <Card className="card-modern">
          <CardHeader>
            <CardTitle>Applications ({filteredApplications.length})</CardTitle>
            <CardDescription>Review and manage student applications</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
                <p>No applications found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-300">
                      <th className="text-left p-3 text-sm font-semibold">App Number</th>
                      <th className="text-left p-3 text-sm font-semibold">Applicant</th>
                      <th className="text-left p-3 text-sm font-semibold">Program</th>
                      <th className="text-left p-3 text-sm font-semibold">Intake</th>
                      <th className="text-center p-3 text-sm font-semibold">Documents</th>
                      <th className="text-center p-3 text-sm font-semibold">Status</th>
                      <th className="text-center p-3 text-sm font-semibold">Submitted</th>
                      <th className="text-center p-3 text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredApplications.map((app) => (
                      <tr key={app.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-mono text-sm font-semibold text-indigo-600">
                            {app.applicationNumber}
                          </span>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-medium text-sm">
                              {app.firstName} {app.lastName}
                            </p>
                            <p className="text-xs text-gray-600">{app.email}</p>
                            <p className="text-xs text-gray-500">{app.phone}</p>
                          </div>
                        </td>
                        <td className="p-3">
                          <div>
                            <p className="font-semibold text-sm">{app.program.code}</p>
                            <p className="text-xs text-gray-600">{app.program.name}</p>
                          </div>
                        </td>
                        <td className="p-3 text-sm">{app.intake}</td>
                        <td className="p-3 text-center">
                          <Badge variant="outline" className="text-xs">
                            {app._count?.documents || 0}/4
                          </Badge>
                        </td>
                        <td className="p-3 text-center">{getStatusBadge(app.status)}</td>
                        <td className="p-3 text-center text-xs text-gray-600">
                          {app.submittedAt
                            ? new Date(app.submittedAt).toLocaleDateString()
                            : '-'}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1 justify-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedApp(app)}
                              title="View Details"
                            >
                              <Eye className="h-3 w-3" />
                            </Button>

                            {app.status === 'SUBMITTED' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAction(app.id, 'review')}
                                title="Start Review"
                                className="bg-yellow-50 hover:bg-yellow-100"
                              >
                                <AlertCircle className="h-3 w-3 text-yellow-600" />
                              </Button>
                            )}

                            {(app.status === 'SUBMITTED' || app.status === 'UNDER_REVIEW') && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAction(app.id, 'approve')}
                                  title="Approve"
                                  className="bg-green-50 hover:bg-green-100"
                                >
                                  <ThumbsUp className="h-3 w-3 text-green-600" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAction(app.id, 'reject')}
                                  title="Reject"
                                  className="bg-red-50 hover:bg-red-100"
                                >
                                  <ThumbsDown className="h-3 w-3 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-modern bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-1">Approval Rate</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {statistics
                      ? Math.round(
                          (statistics.approved / (statistics.approved + statistics.rejected || 1)) *
                            100
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {statistics?.approved} approved of{' '}
                    {(statistics?.approved || 0) + (statistics?.rejected || 0)} reviewed
                  </p>
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
                  <h3 className="font-semibold text-green-900 mb-1">Pending Review</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {(statistics?.submitted || 0) + (statistics?.underReview || 0)}
                  </p>
                  <p className="text-xs text-green-700 mt-1">Applications awaiting action</p>
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
                  <h3 className="font-semibold text-purple-900 mb-1">New Students</h3>
                  <p className="text-2xl font-bold text-purple-600">{statistics?.approved || 0}</p>
                  <p className="text-xs text-purple-700 mt-1">This admission cycle</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Application Detail Modal (Simple) */}
        {selectedApp && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedApp(null)}
          >
            <Card
              className="card-modern max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle>Application Details</CardTitle>
                <CardDescription>{selectedApp.applicationNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Applicant Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p>
                      <strong>Name:</strong> {selectedApp.firstName} {selectedApp.lastName}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedApp.email}
                    </p>
                    <p>
                      <strong>Phone:</strong> {selectedApp.phone}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Program Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <p>
                      <strong>Program:</strong> {selectedApp.program.name} (
                      {selectedApp.program.code})
                    </p>
                    <p>
                      <strong>Intake:</strong> {selectedApp.intake}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedApp.status)}
                    {selectedApp.submittedAt && (
                      <span className="text-sm text-gray-600">
                        Submitted {new Date(selectedApp.submittedAt).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={() => setSelectedApp(null)} variant="outline" className="flex-1">
                    Close
                  </Button>
                  {(selectedApp.status === 'SUBMITTED' ||
                    selectedApp.status === 'UNDER_REVIEW') && (
                    <>
                      <Button
                        onClick={() => {
                          handleAction(selectedApp.id, 'approve');
                          setSelectedApp(null);
                        }}
                        className="flex-1 bg-green-500 hover:bg-green-600"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => {
                          handleAction(selectedApp.id, 'reject');
                          setSelectedApp(null);
                        }}
                        className="flex-1 bg-red-500 hover:bg-red-600"
                      >
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </Layout>
  );
}

