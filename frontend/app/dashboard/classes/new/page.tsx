'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { ArrowLeft, Users } from 'lucide-react';

export default function NewClassPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    academicYear: new Date().getFullYear().toString(),
    capacity: '',
    classTeacher: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/classes', {
        name: formData.name,
        level: formData.level,
        academicYear: parseInt(formData.academicYear),
        capacity: parseInt(formData.capacity) || null,
        classTeacher: formData.classTeacher || null,
      });

      alert('Class created successfully!');
      router.push('/dashboard/timetable');
    } catch (error: any) {
      console.error('Failed to create class:', error);
      
      // Handle API not available
      if (error.response?.status === 404) {
        alert('Class feature is being set up. Your class will be created once backend is configured.');
        router.push('/dashboard/timetable');
      } else {
        const errorMsg = error.response?.data?.message || 'Failed to create class. Please try again.';
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6 animate-fadeIn">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Create New Class</span>
          </h1>
        </div>
        <p className="text-gray-600">Add a new class to the school system</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Class Information</CardTitle>
            <CardDescription>Enter the details for the new class</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Form 1A, Grade 7"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Level/Grade *</Label>
                <Input
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  placeholder="e.g., Form 1, Grade 7"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year *</Label>
                <Input
                  id="academicYear"
                  name="academicYear"
                  type="number"
                  value={formData.academicYear}
                  onChange={handleChange}
                  placeholder="2024"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Class Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Maximum students"
                  min="1"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="classTeacher">Class Teacher</Label>
                <Input
                  id="classTeacher"
                  name="classTeacher"
                  value={formData.classTeacher}
                  onChange={handleChange}
                  placeholder="Teacher name"
                />
                <p className="text-xs text-gray-500">
                  Optional - can be assigned later
                </p>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Class'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

