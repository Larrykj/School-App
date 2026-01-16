'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { DollarSign, Plus, Download, Filter, TrendingUp, AlertCircle } from 'lucide-react';

export default function FeesPage() {
  const [feeStructures, setFeeStructures] = useState<any[]>([]);
  const [termSummary, setTermSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('active');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    try {
      const [structuresRes, summaryRes] = await Promise.all([
        api.get('/fees/structures', {
          params: filter !== 'all' ? { isActive: filter === 'active' } : {}
        }),
        api.get('/fees/summary', {
          params: {
            term: 'Term 1',
            academicYear: new Date().getFullYear().toString()
          }
        }).catch(() => ({ data: { summary: null } }))
      ]);

      setFeeStructures(structuresRes.data.feeStructures || []);
      setTermSummary(summaryRes.data.summary);
    } catch (error: any) {
      // Fall back to demo data if backend not available
      if (!error.response || error.message === 'Network Error') {
        setFeeStructures([
          {
            id: '1',
            name: 'Tuition Fee',
            amount: '50000',
            term: 'Term 1',
            academicYear: '2024',
            isActive: true,
            description: 'Standard tuition fee for all students'
          },
          {
            id: '2',
            name: 'Activity Fee',
            amount: '15000',
            term: 'Term 1',
            academicYear: '2024',
            isActive: true,
            description: 'Co-curricular activities and sports'
          },
          {
            id: '3',
            name: 'Library Fee',
            amount: '5000',
            term: 'Term 1',
            academicYear: '2024',
            isActive: true,
            description: 'Library access and book maintenance'
          },
          {
            id: '4',
            name: 'Laboratory Fee',
            amount: '8000',
            term: 'Term 1',
            academicYear: '2024',
            isActive: true,
            description: 'Science laboratory materials and equipment'
          },
          {
            id: '5',
            name: 'Transport Fee (Optional)',
            amount: '12000',
            term: 'Term 1',
            academicYear: '2024',
            isActive: true,
            description: 'School bus transportation service'
          },
        ]);
        setTermSummary({
          totalExpected: 3600000,
          totalCollected: 2700000,
          outstanding: 900000,
          collectionRate: 75.0,
        });
      } else {
        console.error('Failed to fetch fees:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading fee data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Fee Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage fee structures, track payments, and generate reports
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/fees/reports'}>
              <Download className="h-4 w-4 mr-2" />
              Reports
            </Button>
            <Button onClick={() => window.location.href = '/dashboard/fees/new'}>
              <Plus className="h-4 w-4 mr-2" />
              New Fee Structure
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        {termSummary && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Expected</CardTitle>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <DollarSign className="h-4 w-4 text-gray-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(termSummary.totalExpected || 0)}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {termSummary.term} {termSummary.academicYear}
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
                <div className="p-2 bg-green-50 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(termSummary.totalCollected || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {termSummary.totalExpected > 0
                    ? `${Math.round((termSummary.totalCollected / termSummary.totalExpected) * 100)}% collected`
                    : '0% collected'}
                </p>
              </CardContent>
            </Card>

            <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {formatCurrency(termSummary.outstanding || 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">Pending collection</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('active')}
          >
            Active
          </Button>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button
            variant={filter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('inactive')}
          >
            Inactive
          </Button>
        </div>

        {/* Fee Structures Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feeStructures.map((fee, index) => (
            <Card key={fee.id} className="card-modern border-0 animate-fadeIn" style={{ animationDelay: `${400 + index * 50}ms` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{fee.name}</CardTitle>
                    <CardDescription>
                      {fee.term || 'Annual'} • {fee.academicYear}
                    </CardDescription>
                  </div>
                  <Badge variant={fee.isActive ? 'success' : 'secondary'}>
                    {fee.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-3xl font-bold text-indigo-600">
                      {formatCurrency(Number(fee.amount))}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => window.location.href = `/dashboard/fees/assign?feeId=${fee.id}`}
                    >
                      Assign to Students
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => window.location.href = `/dashboard/fees/${fee.id}`}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {feeStructures.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <DollarSign className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No fee structures found</p>
                <p className="text-sm text-gray-500 mb-4">
                  Create your first fee structure to get started
                </p>
                <Button onClick={() => window.location.href = '/dashboard/fees/new'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Fee Structure
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fee Type Breakdown */}
        {termSummary && termSummary.byFeeType && termSummary.byFeeType.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Fee Collection by Type</CardTitle>
              <CardDescription>Breakdown of collections per fee category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {termSummary.byFeeType.map((feeType: any, index: number) => {
                  const percentage = feeType.expected > 0
                    ? (feeType.collected / feeType.expected) * 100
                    : 0;

                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{feeType.feeType}</span>
                        <span className="text-sm text-gray-500">
                          {formatCurrency(feeType.collected)} / {formatCurrency(feeType.expected)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">{Math.round(percentage)}% collected</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

