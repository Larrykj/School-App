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
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  FileText,
  Heart,
  AlertTriangle,
  CreditCard,
  Edit,
  Save,
  X,
  Upload,
  Camera,
} from 'lucide-react';

interface StudentProfile {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationalId?: string;
  email?: string;
  phone?: string;
  address?: string;
  county?: string;
  subCounty?: string;
  photoUrl?: string;
  bloodGroup?: string;
  disabilities?: string;
  medicalConditions?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  kuccpsIndex?: string;
  placementType?: string;
  isActive: boolean;
  enrollmentDate: string;
  class?: {
    name: string;
  };
}

export default function StudentProfilePage() {
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [editData, setEditData] = useState<Partial<StudentProfile>>({});

  useEffect(() => {
    fetchStudentProfile();
  }, [studentId]);

  const fetchStudentProfile = async () => {
    try {
      const response = await api.get(`/students/${studentId}/profile`);
      setStudent(response.data.student);
      setEditData(response.data.student);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setDemoData();
    } finally {
      setLoading(false);
    }
  };

  const setDemoData = () => {
    const demo: StudentProfile = {
      id: studentId,
      admissionNumber: 'BIT/2024/001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2000-05-15',
      gender: 'Male',
      nationalId: '12345678',
      email: 'john.doe@student.edu',
      phone: '+254712345678',
      address: '123 Main Street',
      county: 'Nairobi',
      subCounty: 'Westlands',
      photoUrl: '',
      bloodGroup: 'O+',
      disabilities: 'None',
      medicalConditions: 'None',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+254787654321',
      kuccpsIndex: 'KUCCPS123456',
      placementType: 'GOVERNMENT',
      isActive: true,
      enrollmentDate: '2024-09-01',
      class: { name: 'BIT Year 1' },
    };
    setStudent(demo);
    setEditData(demo);
  };

  const handleEdit = () => {
    setEditing(true);
    setEditData(student || {});
  };

  const handleCancel = () => {
    setEditing(false);
    setEditData(student || {});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/students/${studentId}/profile`, editData);
      setStudent(editData as StudentProfile);
      setEditing(false);
      alert('Profile updated successfully!');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setEditData({ ...editData, [field]: value });
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

  return (
    <Layout>
      <div className="p-6 space-y-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 min-h-screen">
        {/* Header with Photo */}
        <Card className="card-modern animate-fadeIn">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              {/* Profile Photo */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {student.photoUrl ? (
                    <img
                      src={student.photoUrl}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  ) : (
                    <span>
                      {student.firstName[0]}
                      {student.lastName[0]}
                    </span>
                  )}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-indigo-600 rounded-full text-white hover:bg-indigo-700">
                  <Camera className="h-4 w-4" />
                </button>
              </div>

              {/* Student Info */}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {student.firstName} {student.lastName}
                    </h1>
                    <p className="text-lg text-gray-600 mt-1">
                      {student.admissionNumber}
                    </p>
                    {student.class && (
                      <Badge className="mt-2 bg-indigo-100 text-indigo-700">
                        {student.class.name}
                      </Badge>
                    )}
                  </div>

                  {!editing ? (
                    <Button onClick={handleEdit} className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div>
                    <p className="text-xs text-gray-600">Status</p>
                    <Badge className={student.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                      {student.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Enrolled</p>
                    <p className="font-semibold">
                      {new Date(student.enrollmentDate).toLocaleDateString()}
                    </p>
                  </div>
                  {student.placementType && (
                    <div>
                      <p className="text-xs text-gray-600">Sponsorship</p>
                      <p className="font-semibold">{student.placementType}</p>
                    </div>
                  )}
                  {student.bloodGroup && (
                    <div>
                      <p className="text-xs text-gray-600">Blood Group</p>
                      <p className="font-semibold text-red-600">{student.bloodGroup}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'personal', label: 'Personal Info', icon: User },
            { id: 'contact', label: 'Contact', icon: Phone },
            { id: 'academic', label: 'Academic', icon: GraduationCap },
            { id: 'medical', label: 'Medical', icon: Heart },
            { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'default' : 'outline'}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2"
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'personal' && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Basic student details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>First Name</Label>
                  {editing ? (
                    <Input
                      value={editData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.firstName}</p>
                  )}
                </div>

                <div>
                  <Label>Last Name</Label>
                  {editing ? (
                    <Input
                      value={editData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.lastName}</p>
                  )}
                </div>

                <div>
                  <Label>Date of Birth</Label>
                  {editing ? (
                    <Input
                      type="date"
                      value={editData.dateOfBirth}
                      onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Gender</Label>
                  {editing ? (
                    <select
                      value={editData.gender}
                      onChange={(e) => handleChange('gender', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.gender}</p>
                  )}
                </div>

                <div>
                  <Label>National ID</Label>
                  {editing ? (
                    <Input
                      value={editData.nationalId || ''}
                      onChange={(e) => handleChange('nationalId', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.nationalId || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label>Admission Number</Label>
                  <p className="p-2 bg-gray-50 rounded font-mono font-semibold text-indigo-600">
                    {student.admissionNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'contact' && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>How to reach the student</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Email Address</Label>
                  {editing ? (
                    <Input
                      type="email"
                      value={editData.email || ''}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.email || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label>Phone Number</Label>
                  {editing ? (
                    <Input
                      type="tel"
                      value={editData.phone || ''}
                      onChange={(e) => handleChange('phone', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.phone || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label>County</Label>
                  {editing ? (
                    <Input
                      value={editData.county || ''}
                      onChange={(e) => handleChange('county', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.county || 'Not provided'}</p>
                  )}
                </div>

                <div>
                  <Label>Sub-County</Label>
                  {editing ? (
                    <Input
                      value={editData.subCounty || ''}
                      onChange={(e) => handleChange('subCounty', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.subCounty || 'Not provided'}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label>Physical Address</Label>
                  {editing ? (
                    <Input
                      value={editData.address || ''}
                      onChange={(e) => handleChange('address', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{student.address || 'Not provided'}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'academic' && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
              <CardDescription>Enrollment and program details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Admission Number</Label>
                  <p className="p-2 bg-gray-50 rounded font-mono font-semibold">
                    {student.admissionNumber}
                  </p>
                </div>

                <div>
                  <Label>Class/Program</Label>
                  <p className="p-2 bg-gray-50 rounded">
                    {student.class?.name || 'Not assigned'}
                  </p>
                </div>

                <div>
                  <Label>Enrollment Date</Label>
                  <p className="p-2 bg-gray-50 rounded">
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <Label>Student Status</Label>
                  <Badge className={student.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                    {student.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {student.kuccpsIndex && (
                  <>
                    <div>
                      <Label>KUCCPS Index</Label>
                      <p className="p-2 bg-gray-50 rounded font-mono">
                        {student.kuccpsIndex}
                      </p>
                    </div>

                    <div>
                      <Label>Placement Type</Label>
                      <Badge
                        className={
                          student.placementType === 'GOVERNMENT'
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                        }
                      >
                        {student.placementType}
                      </Badge>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'medical' && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>Health and medical details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Blood Group</Label>
                  {editing ? (
                    <select
                      value={editData.bloodGroup || ''}
                      onChange={(e) => handleChange('bloodGroup', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    >
                      <option value="">Select</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  ) : (
                    <p className="p-2 bg-gray-50 rounded text-red-600 font-semibold">
                      {student.bloodGroup || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Disabilities</Label>
                  {editing ? (
                    <Input
                      value={editData.disabilities || ''}
                      onChange={(e) => handleChange('disabilities', e.target.value)}
                      placeholder="None or specify"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">
                      {student.disabilities || 'None'}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label>Medical Conditions</Label>
                  {editing ? (
                    <textarea
                      value={editData.medicalConditions || ''}
                      onChange={(e) => handleChange('medicalConditions', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      rows={4}
                      placeholder="Any chronic illnesses, allergies, or conditions..."
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded min-h-[100px]">
                      {student.medicalConditions || 'None reported'}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'emergency' && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Emergency Contact</CardTitle>
              <CardDescription>Person to contact in case of emergency</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Contact Name</Label>
                  {editing ? (
                    <Input
                      value={editData.emergencyContactName || ''}
                      onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">
                      {student.emergencyContactName || 'Not provided'}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Contact Phone</Label>
                  {editing ? (
                    <Input
                      type="tel"
                      value={editData.emergencyContactPhone || ''}
                      onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">
                      {student.emergencyContactPhone || 'Not provided'}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold mb-1">Important</p>
                  <p>
                    This contact will be called in case of medical emergencies, accidents, or
                    urgent situations requiring immediate attention.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-modern hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <FileText className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Documents</h3>
                  <p className="text-sm text-gray-600">View uploaded documents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <CreditCard className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">ID Card</h3>
                  <p className="text-sm text-gray-600">Generate student ID</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-modern hover:shadow-lg transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">Academic Records</h3>
                  <p className="text-sm text-gray-600">View grades & transcripts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

