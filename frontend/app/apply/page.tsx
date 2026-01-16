'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import api from '@/lib/api';
import { CheckCircle, ArrowRight, ArrowLeft, User, GraduationCap, Users, Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnlineApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    middleName: '',
    dateOfBirth: '',
    gender: 'Male',
    nationality: 'Kenyan',
    nationalId: '',
    email: '',
    phone: '',
    // Address
    county: '',
    subCounty: '',
    address: '',
    postalCode: '',
    // Academic Background
    kcseIndex: '',
    kcseYear: new Date().getFullYear() - 1,
    kcseGrade: '',
    kcsePoints: '',
    secondarySchool: '',
    // Previous Education (optional)
    previousInstitution: '',
    previousProgram: '',
    previousGPA: '',
    graduationYear: '',
    // Program Selection
    programId: '',
    intake: 'September 2024',
    // KUCCPS (optional)
    kuccpsIndex: '',
    kuccpsPlacement: '',
    placementType: '',
    // Guardian Information
    guardianName: '',
    guardianPhone: '',
    guardianEmail: '',
    guardianRelationship: 'Parent',
    // Medical Information
    bloodGroup: '',
    disabilities: '',
    medicalConditions: '',
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
  });

  const totalSteps = 5;

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await api.post('/applications', {
        ...formData,
        dateOfBirth: new Date(formData.dateOfBirth),
        kcseYear: parseInt(formData.kcseYear as any) || undefined,
        kcsePoints: parseInt(formData.kcsePoints as any) || undefined,
        graduationYear: formData.graduationYear ? parseInt(formData.graduationYear as any) : undefined,
      });

      alert(`Application submitted successfully! Your application number is: ${response.data.application.applicationNumber}`);
      router.push('/dashboard');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  const getStepIcon = (stepNum: number) => {
    switch (stepNum) {
      case 1: return <User className="h-5 w-5" />;
      case 2: return <GraduationCap className="h-5 w-5" />;
      case 3: return <Users className="h-5 w-5" />;
      case 4: return <Heart className="h-5 w-5" />;
      case 5: return <CheckCircle className="h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Online Application
          </h1>
          <p className="text-gray-600">Apply for admission to our programs</p>
        </div>

        {/* Progress Steps */}
        <Card className="card-modern mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              {[1, 2, 3, 4, 5].map((stepNum) => (
                <div key={stepNum} className="flex items-center flex-1">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    stepNum === step
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : stepNum < step
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {stepNum < step ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      getStepIcon(stepNum)
                    )}
                  </div>
                  {stepNum < 5 && (
                    <div className={`flex-1 h-1 mx-2 ${
                      stepNum < step ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-xs text-gray-600">
              <span className={step === 1 ? 'font-bold text-indigo-600' : ''}>Personal</span>
              <span className={step === 2 ? 'font-bold text-indigo-600' : ''}>Academic</span>
              <span className={step === 3 ? 'font-bold text-indigo-600' : ''}>Program</span>
              <span className={step === 4 ? 'font-bold text-indigo-600' : ''}>Guardian</span>
              <span className={step === 5 ? 'font-bold text-indigo-600' : ''}>Review</span>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Personal Information */}
        {step === 1 && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-indigo-600" />
                Personal Information
              </CardTitle>
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="middleName">Middle Name</Label>
                  <Input
                    id="middleName"
                    value={formData.middleName}
                    onChange={(e) => handleChange('middleName', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <select
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nationalId">National ID / Birth Certificate No.</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) => handleChange('nationalId', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="nationality">Nationality *</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) => handleChange('nationality', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="+254712345678"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="county">County *</Label>
                  <Input
                    id="county"
                    value={formData.county}
                    onChange={(e) => handleChange('county', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="subCounty">Sub-County *</Label>
                  <Input
                    id="subCounty"
                    value={formData.subCounty}
                    onChange={(e) => handleChange('subCounty', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Physical Address *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => handleChange('postalCode', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Academic Background */}
        {step === 2 && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-indigo-600" />
                Academic Background
              </CardTitle>
              <CardDescription>Your education history</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* KCSE Details */}
              <div>
                <h3 className="text-lg font-semibold mb-4">KCSE / O-Level Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="kcseIndex">KCSE Index Number</Label>
                    <Input
                      id="kcseIndex"
                      value={formData.kcseIndex}
                      onChange={(e) => handleChange('kcseIndex', e.target.value)}
                      placeholder="12345678999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kcseYear">Year of Completion</Label>
                    <Input
                      id="kcseYear"
                      type="number"
                      value={formData.kcseYear}
                      onChange={(e) => handleChange('kcseYear', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="kcseGrade">Overall Grade</Label>
                    <Input
                      id="kcseGrade"
                      value={formData.kcseGrade}
                      onChange={(e) => handleChange('kcseGrade', e.target.value)}
                      placeholder="e.g., B+"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kcsePoints">Points</Label>
                    <Input
                      id="kcsePoints"
                      type="number"
                      value={formData.kcsePoints}
                      onChange={(e) => handleChange('kcsePoints', e.target.value)}
                      placeholder="e.g., 52"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <Label htmlFor="secondarySchool">Secondary School Name</Label>
                  <Input
                    id="secondarySchool"
                    value={formData.secondarySchool}
                    onChange={(e) => handleChange('secondarySchool', e.target.value)}
                  />
                </div>
              </div>

              {/* Previous Education (for postgraduate) */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Previous Higher Education (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">For postgraduate applicants or those with prior degrees</p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="previousInstitution">Institution Name</Label>
                    <Input
                      id="previousInstitution"
                      value={formData.previousInstitution}
                      onChange={(e) => handleChange('previousInstitution', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="previousProgram">Program/Degree</Label>
                      <Input
                        id="previousProgram"
                        value={formData.previousProgram}
                        onChange={(e) => handleChange('previousProgram', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="previousGPA">GPA/Grade</Label>
                      <Input
                        id="previousGPA"
                        value={formData.previousGPA}
                        onChange={(e) => handleChange('previousGPA', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="graduationYear">Graduation Year</Label>
                    <Input
                      id="graduationYear"
                      type="number"
                      value={formData.graduationYear}
                      onChange={(e) => handleChange('graduationYear', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* KUCCPS (if applicable) */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">KUCCPS Placement (If Applicable)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="kuccpsIndex">KUCCPS Index Number</Label>
                    <Input
                      id="kuccpsIndex"
                      value={formData.kuccpsIndex}
                      onChange={(e) => handleChange('kuccpsIndex', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="placementType">Placement Type</Label>
                    <select
                      id="placementType"
                      value={formData.placementType}
                      onChange={(e) => handleChange('placementType', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                    >
                      <option value="">Select Type</option>
                      <option value="GOVERNMENT">Government Sponsored</option>
                      <option value="PARALLEL">Parallel/Self Sponsored</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Program Selection */}
        {step === 3 && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Program Selection</CardTitle>
              <CardDescription>Choose your program and intake</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="programId">Program *</Label>
                <select
                  id="programId"
                  value={formData.programId}
                  onChange={(e) => handleChange('programId', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                  required
                >
                  <option value="">Select a program</option>
                  <option value="program-1">Bachelor of Information Technology</option>
                  <option value="program-2">Diploma in Information Technology</option>
                  <option value="program-3">Master of Business Administration</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">Select the program you wish to apply for</p>
              </div>

              <div>
                <Label htmlFor="intake">Intake Period *</Label>
                <select
                  id="intake"
                  value={formData.intake}
                  onChange={(e) => handleChange('intake', e.target.value)}
                  className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                  required
                >
                  <option value="September 2024">September 2024</option>
                  <option value="January 2025">January 2025</option>
                  <option value="May 2025">May 2025</option>
                </select>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Guardian & Emergency Info */}
        {step === 4 && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Guardian & Emergency Information</CardTitle>
              <CardDescription>For contact purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Guardian/Sponsor Information</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="guardianName">Guardian Name *</Label>
                    <Input
                      id="guardianName"
                      value={formData.guardianName}
                      onChange={(e) => handleChange('guardianName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guardianPhone">Guardian Phone *</Label>
                      <Input
                        id="guardianPhone"
                        type="tel"
                        value={formData.guardianPhone}
                        onChange={(e) => handleChange('guardianPhone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="guardianEmail">Guardian Email</Label>
                      <Input
                        id="guardianEmail"
                        type="email"
                        value={formData.guardianEmail}
                        onChange={(e) => handleChange('guardianEmail', e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="guardianRelationship">Relationship *</Label>
                    <select
                      id="guardianRelationship"
                      value={formData.guardianRelationship}
                      onChange={(e) => handleChange('guardianRelationship', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      required
                    >
                      <option value="Parent">Parent</option>
                      <option value="Guardian">Guardian</option>
                      <option value="Sponsor">Sponsor</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="emergencyContactName">Emergency Contact Name *</Label>
                    <Input
                      id="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContactPhone">Emergency Phone *</Label>
                      <Input
                        id="emergencyContactPhone"
                        type="tel"
                        value={formData.emergencyContactPhone}
                        onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyContactRelation">Relationship *</Label>
                      <Input
                        id="emergencyContactRelation"
                        value={formData.emergencyContactRelation}
                        onChange={(e) => handleChange('emergencyContactRelation', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Medical Information (Optional)</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <select
                        id="bloodGroup"
                        value={formData.bloodGroup}
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
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="disabilities">Disabilities (if any)</Label>
                    <Input
                      id="disabilities"
                      value={formData.disabilities}
                      onChange={(e) => handleChange('disabilities', e.target.value)}
                      placeholder="Specify any disabilities"
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalConditions">Medical Conditions</Label>
                    <textarea
                      id="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={(e) => handleChange('medicalConditions', e.target.value)}
                      className="w-full rounded-lg border-2 border-gray-300 px-4 py-2"
                      rows={3}
                      placeholder="Any chronic illnesses, allergies, or medical conditions we should know about"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Review & Submit */}
        {step === 5 && (
          <Card className="card-modern animate-fadeIn">
            <CardHeader>
              <CardTitle>Review Your Application</CardTitle>
              <CardDescription>Please review all information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <p><strong>Name:</strong> {formData.firstName} {formData.middleName} {formData.lastName}</p>
                <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Address:</strong> {formData.address}, {formData.subCounty}, {formData.county}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Academic Background</h4>
                <p><strong>KCSE Index:</strong> {formData.kcseIndex || 'Not provided'}</p>
                <p><strong>KCSE Year:</strong> {formData.kcseYear}</p>
                <p><strong>Grade:</strong> {formData.kcseGrade || 'Not provided'}</p>
                <p><strong>School:</strong> {formData.secondarySchool || 'Not provided'}</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Guardian Information</h4>
                <p><strong>Name:</strong> {formData.guardianName}</p>
                <p><strong>Phone:</strong> {formData.guardianPhone}</p>
                <p><strong>Relationship:</strong> {formData.guardianRelationship}</p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
                <p className="font-semibold mb-2">⚠️ Important Notes:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>After submission, you will receive an application number</li>
                  <li>You will need to upload required documents</li>
                  <li>Application will be reviewed within 5-7 working days</li>
                  <li>You will be notified via email and SMS</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          {step > 1 && (
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {step < totalSteps ? (
            <Button onClick={handleNext} className="ml-auto">
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="ml-auto min-w-[150px]"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

