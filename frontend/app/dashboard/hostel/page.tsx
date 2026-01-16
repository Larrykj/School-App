'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { Bed, Users, Home, Plus, CheckCircle, XCircle } from 'lucide-react';

export default function HostelPage() {
  const [dorms, setDorms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDorms: 0,
    totalCapacity: 0,
    occupiedBeds: 0
  });

  useEffect(() => {
    fetchDorms();
  }, []);

  const fetchDorms = async () => {
    try {
      const response = await api.get('/dorms'); // Assuming this endpoint exists
      const dormsData = response.data.dorms || [];
      setDorms(dormsData);

      const totalDorms = dormsData.length;
      const totalCapacity = dormsData.reduce((sum: number, d: any) => sum + (d.capacity || 0), 0);
      const occupiedBeds = dormsData.reduce((sum: number, d: any) => sum + (d.students?.length || 0), 0);

      setStats({ totalDorms, totalCapacity, occupiedBeds });
    } catch (error) {
      console.error('Failed to fetch dorms:', error);
      // Fallback for demo if endpoint fails
      setStats({ totalDorms: 0, totalCapacity: 0, occupiedBeds: 0 });
      setDorms([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Hostel Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage dormitories, room allocation, and capacity
            </p>
          </div>
          <Button onClick={() => window.location.href = '/dashboard/hostel/new'}>
            <Plus className="h-4 w-4 mr-2" />
            Add Dormitory
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Dormitories</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Home className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalDorms}</div>
              <p className="text-xs text-gray-500 mt-1">Boys & Girls Hostels</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <Bed className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalCapacity}</div>
              <p className="text-xs text-gray-500 mt-1">Total beds available</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Occupancy</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.totalCapacity > 0 
                  ? `${Math.round((stats.occupiedBeds / stats.totalCapacity) * 100)}%` 
                  : '0%'}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.occupiedBeds} beds occupied
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dorms.length > 0 ? (
            dorms.map((dorm, index) => (
              <Card key={dorm.id} className="card-modern border-0 animate-fadeIn" style={{ animationDelay: `${400 + index * 50}ms` }}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{dorm.name}</CardTitle>
                    <Badge variant={dorm.type === 'BOYS' ? 'default' : 'secondary'}>
                      {dorm.type}
                    </Badge>
                  </div>
                  <CardDescription>
                    {dorm.capacity} Beds • {dorm.students?.length || 0} Occupied
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          (dorm.students?.length || 0) >= dorm.capacity ? 'bg-red-500' : 'bg-green-500'
                        }`}
                        style={{ 
                          width: `${Math.min(((dorm.students?.length || 0) / dorm.capacity) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Occupancy</span>
                      <span>{dorm.students?.length || 0}/{dorm.capacity}</span>
                    </div>
                    
                    <div className="pt-4 border-t flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Assign Student
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Home className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No dormitories found</p>
                <p className="text-sm text-gray-500 mb-4">
                  Add a dormitory to start managing hostel allocation
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Dormitory
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}

