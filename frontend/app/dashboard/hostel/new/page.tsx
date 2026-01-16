'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { ArrowLeft, Home } from 'lucide-react';

export default function NewDormitoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    gender: 'BOYS',
    capacity: '',
    numberOfRooms: '',
    supervisorName: '',
    supervisorPhone: '',
    location: '',
    facilities: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/hostel/dormitories', {
        name: formData.name,
        gender: formData.gender,
        capacity: parseInt(formData.capacity),
        numberOfRooms: parseInt(formData.numberOfRooms),
        supervisorName: formData.supervisorName,
        supervisorPhone: formData.supervisorPhone,
        location: formData.location,
        facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f),
      });

      alert('Dormitory created successfully!');
      router.push('/dashboard/hostel');
    } catch (error) {
      console.error('Failed to create dormitory:', error);
      alert('Failed to create dormitory. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
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
            <Home className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Add New Dormitory</span>
          </h1>
        </div>
        <p className="text-gray-600">Create a new hostel dormitory for student accommodation</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Dormitory Information</CardTitle>
            <CardDescription>Enter the details for the new dormitory</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Dormitory Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Block A - Boys Hostel"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="BOYS">Boys</option>
                  <option value="GIRLS">Girls</option>
                  <option value="MIXED">Mixed</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Total Capacity *</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Total number of beds"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numberOfRooms">Number of Rooms *</Label>
                <Input
                  id="numberOfRooms"
                  name="numberOfRooms"
                  type="number"
                  value={formData.numberOfRooms}
                  onChange={handleChange}
                  placeholder="Total rooms"
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., North Campus, Building 3"
                />
              </div>
            </div>

            {/* Supervisor Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Supervisor Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supervisorName">Supervisor Name</Label>
                  <Input
                    id="supervisorName"
                    name="supervisorName"
                    value={formData.supervisorName}
                    onChange={handleChange}
                    placeholder="Full name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisorPhone">Supervisor Phone</Label>
                  <Input
                    id="supervisorPhone"
                    name="supervisorPhone"
                    value={formData.supervisorPhone}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                  />
                </div>
              </div>
            </div>

            {/* Facilities */}
            <div className="space-y-2">
              <Label htmlFor="facilities">Facilities (comma-separated)</Label>
              <textarea
                id="facilities"
                name="facilities"
                value={formData.facilities}
                onChange={handleChange}
                placeholder="e.g., WiFi, Study Room, Common Room, Laundry, Kitchen"
                className="flex min-h-[80px] w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <p className="text-xs text-gray-500">
                Separate multiple facilities with commas
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Dormitory'}
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

