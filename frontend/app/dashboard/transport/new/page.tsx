'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { ArrowLeft, Bus } from 'lucide-react';

export default function NewRoutePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    routeName: '',
    vehicleNumber: '',
    vehicleType: 'BUS',
    driverName: '',
    driverPhone: '',
    driverLicense: '',
    capacity: '',
    pickupPoints: '',
    dropoffPoints: '',
    departureTime: '',
    estimatedDuration: '',
    fare: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/transport/routes', {
        routeName: formData.routeName,
        vehicleNumber: formData.vehicleNumber,
        vehicleType: formData.vehicleType,
        driverName: formData.driverName,
        driverPhone: formData.driverPhone,
        driverLicense: formData.driverLicense,
        capacity: parseInt(formData.capacity),
        pickupPoints: formData.pickupPoints.split(',').map(p => p.trim()).filter(p => p),
        dropoffPoints: formData.dropoffPoints.split(',').map(p => p.trim()).filter(p => p),
        departureTime: formData.departureTime,
        estimatedDuration: formData.estimatedDuration,
        fare: parseFloat(formData.fare),
      });

      alert('Transport route created successfully!');
      router.push('/dashboard/transport');
    } catch (error) {
      console.error('Failed to create route:', error);
      alert('Failed to create route. Please try again.');
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
            <Bus className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Add New Transport Route</span>
          </h1>
        </div>
        <p className="text-gray-600">Create a new transport route for student transportation</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Route Information</CardTitle>
            <CardDescription>Enter the details for the new transport route</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Route Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="routeName">Route Name *</Label>
                <Input
                  id="routeName"
                  name="routeName"
                  value={formData.routeName}
                  onChange={handleChange}
                  placeholder="e.g., City Center Route"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fare">Fare (KES) *</Label>
                <Input
                  id="fare"
                  name="fare"
                  type="number"
                  step="0.01"
                  value={formData.fare}
                  onChange={handleChange}
                  placeholder="Monthly fare"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="departureTime">Departure Time *</Label>
                <Input
                  id="departureTime"
                  name="departureTime"
                  type="time"
                  value={formData.departureTime}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedDuration">Duration (minutes)</Label>
                <Input
                  id="estimatedDuration"
                  name="estimatedDuration"
                  type="number"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  placeholder="Estimated travel time"
                  min="1"
                />
              </div>
            </div>

            {/* Pickup and Dropoff Points */}
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold">Route Stops</h3>
              
              <div className="space-y-2">
                <Label htmlFor="pickupPoints">Pickup Points (comma-separated) *</Label>
                <textarea
                  id="pickupPoints"
                  name="pickupPoints"
                  value={formData.pickupPoints}
                  onChange={handleChange}
                  placeholder="e.g., Main Gate, Shopping Center, Railway Station"
                  className="flex min-h-[80px] w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dropoffPoints">Dropoff Points (comma-separated) *</Label>
                <textarea
                  id="dropoffPoints"
                  name="dropoffPoints"
                  value={formData.dropoffPoints}
                  onChange={handleChange}
                  placeholder="e.g., School Main Entrance, Sports Complex"
                  className="flex min-h-[80px] w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
            </div>

            {/* Vehicle Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleNumber">Vehicle Number *</Label>
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    placeholder="e.g., KBZ 123X"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type *</Label>
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="BUS">Bus</option>
                    <option value="VAN">Van</option>
                    <option value="MINIBUS">Minibus</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Vehicle Capacity *</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="Number of seats"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Driver Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Driver Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="driverName">Driver Name *</Label>
                  <Input
                    id="driverName"
                    name="driverName"
                    value={formData.driverName}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverPhone">Driver Phone *</Label>
                  <Input
                    id="driverPhone"
                    name="driverPhone"
                    value={formData.driverPhone}
                    onChange={handleChange}
                    placeholder="+254 7XX XXX XXX"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driverLicense">Driver License Number</Label>
                  <Input
                    id="driverLicense"
                    name="driverLicense"
                    value={formData.driverLicense}
                    onChange={handleChange}
                    placeholder="License number"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Creating...' : 'Create Route'}
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

