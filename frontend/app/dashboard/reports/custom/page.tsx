'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Filter, FileText } from 'lucide-react';
import axios from 'axios';

export default function CustomReportBuilder() {
  const [reportType, setReportType] = useState('fees');
  const [filters, setFilters] = useState({
    academicYear: '2024',
    term: '',
    classId: '',
    dateFrom: '',
    dateTo: '',
    paymentMode: '',
    status: '',
  });
  const [generating, setGenerating] = useState(false);

  const handleGenerateReport = async () => {
    try {
      setGenerating(true);
      const token = localStorage.getItem('token');
      
      // Build API endpoint based on report type
      let endpoint = '';
      const params: any = {};

      switch (reportType) {
        case 'fees':
          endpoint = '/api/analytics/fees';
          params.academicYear = filters.academicYear;
          if (filters.term) params.term = filters.term;
          break;
        case 'performance':
          endpoint = '/api/analytics/performance';
          params.academicYear = filters.academicYear;
          if (filters.term) params.term = filters.term;
          if (filters.classId) params.classId = filters.classId;
          break;
        case 'attendance':
          endpoint = '/api/analytics/attendance';
          if (filters.dateFrom) params.startDate = filters.dateFrom;
          if (filters.dateTo) params.endDate = filters.dateTo;
          if (filters.classId) params.classId = filters.classId;
          break;
        default:
          break;
      }

      const response = await axios.get(`http://localhost:5000${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      // For now, just log the data
      // In production, you'd generate a PDF or Excel file
      console.log('Report Data:', response.data);
      alert('Report generated! Check console for data.');
      
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    try {
      const token = localStorage.getItem('token');
      
      // In production, this would call a backend endpoint to generate the file
      alert(`Exporting as ${format.toUpperCase()}...`);
      
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Custom Report Builder</h1>
        <p className="text-gray-600 mt-1">Create customized reports with advanced filters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Configuration */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Report Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="fees">Fee Collection Report</option>
                  <option value="performance">Performance Report</option>
                  <option value="attendance">Attendance Report</option>
                  <option value="students">Student List Report</option>
                  <option value="payments">Payment History Report</option>
                </select>
              </div>

              {/* Academic Year */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Academic Year
                </label>
                <select
                  value={filters.academicYear}
                  onChange={(e) => setFilters({ ...filters, academicYear: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                </select>
              </div>

              {/* Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Term (Optional)
                </label>
                <select
                  value={filters.term}
                  onChange={(e) => setFilters({ ...filters, term: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2"
                >
                  <option value="">All Terms</option>
                  <option value="Term 1">Term 1</option>
                  <option value="Term 2">Term 2</option>
                  <option value="Term 3">Term 3</option>
                </select>
              </div>

              {/* Class Filter */}
              {(reportType === 'performance' || reportType === 'attendance') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Class (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Class ID"
                    value={filters.classId}
                    onChange={(e) => setFilters({ ...filters, classId: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  />
                </div>
              )}

              {/* Date Range */}
              {reportType === 'attendance' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateFrom}
                      onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      value={filters.dateTo}
                      onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    />
                  </div>
                </div>
              )}

              {/* Payment Mode Filter */}
              {reportType === 'payments' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Mode
                  </label>
                  <select
                    value={filters.paymentMode}
                    onChange={(e) => setFilters({ ...filters, paymentMode: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">All Modes</option>
                    <option value="CASH">Cash</option>
                    <option value="MPESA">M-Pesa</option>
                    <option value="BANK">Bank</option>
                    <option value="CHEQUE">Cheque</option>
                  </select>
                </div>
              )}

              {/* Status Filter */}
              {(reportType === 'fees' || reportType === 'payments') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                  >
                    <option value="">All</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PENDING">Pending</option>
                    <option value="FAILED">Failed</option>
                  </select>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleGenerateReport}
                  disabled={generating}
                  className="flex-1"
                >
                  {generating ? 'Generating...' : 'Generate Report'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Export Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={() => handleExport('pdf')}
                variant="outline"
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </Button>
              <Button
                onClick={() => handleExport('excel')}
                variant="outline"
                className="w-full"
              >
                <FileText className="w-4 h-4 mr-2" />
                Export as Excel
              </Button>
            </CardContent>
          </Card>

          {/* Quick Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Templates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <button
                onClick={() => {
                  setReportType('fees');
                  setFilters({ ...filters, status: '' });
                }}
                className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-sm">Fee Collection Summary</p>
                <p className="text-xs text-gray-500">All fee collections this year</p>
              </button>
              
              <button
                onClick={() => {
                  setReportType('performance');
                  setFilters({ ...filters, term: 'Term 1' });
                }}
                className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-sm">Term Performance</p>
                <p className="text-xs text-gray-500">Student performance by term</p>
              </button>
              
              <button
                onClick={() => {
                  setReportType('attendance');
                  const today = new Date();
                  const thirtyDaysAgo = new Date(today);
                  thirtyDaysAgo.setDate(today.getDate() - 30);
                  setFilters({
                    ...filters,
                    dateFrom: thirtyDaysAgo.toISOString().split('T')[0],
                    dateTo: today.toISOString().split('T')[0],
                  });
                }}
                className="w-full text-left px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <p className="font-medium text-sm">Monthly Attendance</p>
                <p className="text-xs text-gray-500">Last 30 days attendance</p>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

