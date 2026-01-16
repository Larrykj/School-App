'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { 
  Bus, MapPin, Users, Plus, Search, Route as RouteIcon, 
  Navigation, CheckCircle, AlertCircle 
} from 'lucide-react';

export default function TransportPage() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddRoute, setShowAddRoute] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalRoutes: 0,
    totalVehicles: 0,
    assignedStudents: 0
  });

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      const response = await api.get('/transport/routes');
      const routesData = response.data.routes || [];
      setRoutes(routesData);

      // Calculate stats
      const totalRoutes = routesData.length;
      const totalVehicles = new Set(routesData.map((r: any) => r.vehicleId).filter(Boolean)).size;
      const assignedStudents = routesData.reduce((sum: number, r: any) => sum + (r.assignments?.length || 0), 0);

      setStats({ totalRoutes, totalVehicles, assignedStudents });
    } catch (error) {
      console.error('Failed to fetch transport routes:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Transport Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage bus routes, vehicles, and student assignments
            </p>
          </div>
          <Button onClick={() => window.location.href = '/dashboard/transport/new'}>
            <Plus className="h-4 w-4 mr-2" />
            Add Route
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <RouteIcon className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalRoutes}</div>
              <p className="text-xs text-gray-500 mt-1">Active transport routes</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <Bus className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.totalVehicles}</div>
              <p className="text-xs text-gray-500 mt-1">Buses/Vans in service</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students Assigned</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.assignedStudents}</div>
              <p className="text-xs text-gray-500 mt-1">Using school transport</p>
            </CardContent>
          </Card>
        </div>

        {/* Routes List */}
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Transport Routes</CardTitle>
            <CardDescription>List of all available routes and their details</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading routes...</p>
                </div>
              </div>
            ) : routes.length > 0 ? (
              <div className="space-y-4">
                {routes.map((route) => (
                  <div key={route.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{route.routeName}</h3>
                          <Badge variant={route.status === 'ACTIVE' ? 'success' : 'secondary'}>
                            {route.status}
                          </Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Bus className="h-4 w-4 mr-1" />
                            Vehicle: {route.vehicle?.registrationNumber || 'Not Assigned'}
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            Driver: {route.driverId || 'Not Assigned'}
                          </div>
                          <div className="flex items-center font-medium text-gray-900">
                            Fee: {formatCurrency(Number(route.fee))}
                          </div>
                        </div>

                        {route.pickupPoints && (
                          <div className="flex items-start gap-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mt-0.5" />
                            <span>
                              Stops: {JSON.parse(route.pickupPoints).join(' → ')}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => window.location.href = `/dashboard/transport/${route.id}`}
                        >
                          Manage
                        </Button>
                        <div className="text-xs text-center text-gray-500">
                          {route.assignments?.length || 0} Students
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <RouteIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No transport routes found</p>
                <p className="text-sm text-gray-500 mt-2">
                  Create your first route to start managing transport
                </p>
                <Button className="mt-4" onClick={() => setShowAddRoute(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Route
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

