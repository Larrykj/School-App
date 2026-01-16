'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User, BookOpen, Plus, Download } from 'lucide-react';

export default function TimetablePage() {
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [classes, setClasses] = useState<any[]>([]);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable(selectedClass);
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await api.get('/classes');
      const classesData = response.data.classes || [];
      setClasses(classesData);
      if (classesData.length > 0) {
        setSelectedClass(classesData[0].id);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      // Set demo classes if API not available
      const demoClasses = [
        { id: 'class1', name: 'Form 1A' },
        { id: 'class2', name: 'Form 1B' },
        { id: 'class3', name: 'Form 2A' },
        { id: 'class4', name: 'Form 2B' },
      ];
      setClasses(demoClasses);
      setSelectedClass(demoClasses[0].id);
      setLoading(false);
    }
  };

  const fetchTimetable = async (classId: string) => {
    setLoading(true);
    try {
      const response = await api.get(`/timetable/class/${classId}`, {
        params: {
          academicYear: '2024',
          term: 'Term 1',
        },
      });
      const timetableData = response.data.timetable || {};
      
      // Backend returns grouped by day: { Monday: [...], Tuesday: [...] }
      // Convert to flat array for frontend use
      const flatTimetable: any[] = [];
      Object.entries(timetableData).forEach(([day, periods]: [string, any]) => {
        if (Array.isArray(periods)) {
          periods.forEach((slot: any) => {
            flatTimetable.push({
              ...slot,
              day: day.toUpperCase(),
            });
          });
        }
      });
      
      setTimetable(flatTimetable);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
      // Set demo timetable if API not available
      setTimetable([
        {
          day: 'MONDAY',
          period: 1,
          subject: 'Mathematics',
          teacher: 'John Doe',
          startTime: '08:00',
          endTime: '09:00',
        },
        {
          day: 'MONDAY',
          period: 2,
          subject: 'English',
          teacher: 'Jane Smith',
          startTime: '09:00',
          endTime: '10:00',
        },
        {
          day: 'TUESDAY',
          period: 1,
          subject: 'Science',
          teacher: 'Mike Johnson',
          startTime: '08:00',
          endTime: '09:00',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getSlot = (day: string, period: number) => {
    return timetable.find(t => t.day === day && t.period === period);
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Timetable Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage class schedules and teacher assignments
            </p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline"
              onClick={() => {
                alert('PDF export feature coming soon!');
                // TODO: Implement PDF export
              }}
            >
              <Download className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Button
              onClick={() => window.location.href = '/dashboard/timetable/edit'}
            >
              <Plus className="h-4 w-4 mr-2" />
              Edit Schedule
            </Button>
          </div>
        </div>

        {/* Class Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Class</label>
          {classes.length > 0 ? (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {classes.map((cls) => (
                <Button
                  key={cls.id}
                  variant={selectedClass === cls.id ? 'default' : 'outline'}
                  onClick={() => setSelectedClass(cls.id)}
                  className="whitespace-nowrap"
                  size="lg"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  {cls.name}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600 mb-4">No classes found</p>
              <Button onClick={() => window.location.href = '/dashboard/classes/new'}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Class
              </Button>
            </div>
          )}
        </div>

        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <CardHeader>
            <CardTitle>Weekly Schedule</CardTitle>
            <CardDescription>
              {classes.find(c => c.id === selectedClass)?.name} • Term 1 2024
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      <th className="border border-indigo-500 p-4 text-left text-sm font-semibold text-white">Day / Period</th>
                      {periods.map(p => (
                        <th key={p} className="border border-indigo-500 p-4 text-center text-sm font-semibold text-white">
                          Period {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map(day => (
                      <tr key={day} className="hover:bg-indigo-50/30 transition-colors">
                        <td className="border border-gray-300 p-4 font-semibold text-sm bg-gradient-to-r from-gray-50 to-gray-100">
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </td>
                        {periods.map(period => {
                          const slot = getSlot(day, period);
                          return (
                            <td key={period} className="border border-gray-300 p-2 min-w-[140px] bg-white">
                              {slot ? (
                                <div 
                                  className="bg-gradient-to-br from-indigo-50 to-purple-50 p-3 rounded-lg border border-indigo-200 text-center cursor-pointer hover:shadow-md transition-all group"
                                  onClick={() => {
                                    // TODO: Open edit modal
                                    alert(`Edit: ${slot.subject} - ${day} Period ${period}`);
                                  }}
                                >
                                  <p className="font-semibold text-indigo-900 text-sm mb-1">{slot.subject}</p>
                                  {slot.teacher && (
                                    <div className="flex items-center justify-center text-xs text-indigo-700 mb-1">
                                      <User className="h-3 w-3 mr-1" />
                                      <span>
                                        {typeof slot.teacher === 'string' 
                                          ? slot.teacher 
                                          : slot.teacher.user?.firstName || 'Unknown'}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center justify-center text-xs text-gray-600">
                                    <Clock className="h-3 w-3 mr-1" />
                                    <span>{slot.startTime} - {slot.endTime}</span>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    // TODO: Open add modal
                                    alert(`Add class: ${day} Period ${period}`);
                                  }}
                                  className="h-full w-full min-h-[90px] flex flex-col items-center justify-center text-gray-400 text-xs border-2 border-dashed border-gray-200 rounded-lg hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 hover:border-indigo-300 hover:text-indigo-600 cursor-pointer transition-all group"
                                >
                                  <Plus className="h-5 w-5 mb-1 group-hover:scale-110 transition-transform" />
                                  <span className="text-xs font-medium">Add Class</span>
                                </button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

