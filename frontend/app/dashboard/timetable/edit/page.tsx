'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Calendar, Clock, Save, Plus, Trash2 } from 'lucide-react';

export default function EditTimetablePage() {
  const router = useRouter();
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);

  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];
  const periods = [1, 2, 3, 4, 5, 6, 7, 8];

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable(selectedClass);
    }
  }, [selectedClass]);

  const fetchInitialData = async () => {
    try {
      // Fetch classes
      try {
        const classesRes = await api.get('/classes');
        const classesData = classesRes.data.classes || [];
        setClasses(classesData);
        if (classesData.length > 0) {
          setSelectedClass(classesData[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch classes:', error);
        // Set some default classes for demo
        setClasses([
          { id: 'class1', name: 'Form 1A' },
          { id: 'class2', name: 'Form 1B' },
          { id: 'class3', name: 'Form 2A' },
        ]);
        setSelectedClass('class1');
      }

      // Fetch subjects
      try {
        const subjectsRes = await api.get('/subjects');
        const subjectsData = subjectsRes.data.subjects || subjectsRes.data || [];
        
        // If no subjects in database, show demo subjects
        if (subjectsData.length === 0) {
          console.warn('No subjects found in database, using demo data');
          setSubjects([
            { id: 'math', name: 'Mathematics' },
            { id: 'eng', name: 'English' },
            { id: 'sci', name: 'Science' },
            { id: 'hist', name: 'History' },
            { id: 'geo', name: 'Geography' },
            { id: 'pe', name: 'Physical Education' },
            { id: 'chem', name: 'Chemistry' },
            { id: 'phys', name: 'Physics' },
            { id: 'bio', name: 'Biology' },
            { id: 'comp', name: 'Computer Science' },
          ]);
        } else {
          setSubjects(subjectsData);
        }
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        // Set default subjects for demo
        setSubjects([
          { id: 'math', name: 'Mathematics' },
          { id: 'eng', name: 'English' },
          { id: 'sci', name: 'Science' },
          { id: 'hist', name: 'History' },
          { id: 'geo', name: 'Geography' },
          { id: 'pe', name: 'Physical Education' },
          { id: 'chem', name: 'Chemistry' },
          { id: 'phys', name: 'Physics' },
          { id: 'bio', name: 'Biology' },
          { id: 'comp', name: 'Computer Science' },
        ]);
      }

      // Fetch teachers
      try {
        const teachersRes = await api.get('/teachers');
        const teachersData = teachersRes.data.teachers || teachersRes.data || [];
        
        // If no teachers in database, show demo teachers
        if (teachersData.length === 0) {
          console.warn('No teachers found in database, using demo data');
          setTeachers([
            { id: 'teacher1', firstName: 'John', lastName: 'Smith', name: 'John Smith' },
            { id: 'teacher2', firstName: 'Jane', lastName: 'Doe', name: 'Jane Doe' },
            { id: 'teacher3', firstName: 'Mike', lastName: 'Johnson', name: 'Mike Johnson' },
            { id: 'teacher4', firstName: 'Sarah', lastName: 'Wilson', name: 'Sarah Wilson' },
            { id: 'teacher5', firstName: 'David', lastName: 'Brown', name: 'David Brown' },
          ]);
        } else {
          setTeachers(teachersData);
        }
      } catch (error) {
        console.error('Failed to fetch teachers:', error);
        // Set default teachers for demo
        setTeachers([
          { id: 'teacher1', firstName: 'John', lastName: 'Smith', name: 'John Smith' },
          { id: 'teacher2', firstName: 'Jane', lastName: 'Doe', name: 'Jane Doe' },
          { id: 'teacher3', firstName: 'Mike', lastName: 'Johnson', name: 'Mike Johnson' },
          { id: 'teacher4', firstName: 'Sarah', lastName: 'Wilson', name: 'Sarah Wilson' },
          { id: 'teacher5', firstName: 'David', lastName: 'Brown', name: 'David Brown' },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  };

  const fetchTimetable = async (classId: string) => {
    try {
      const response = await api.get(`/timetable/class/${classId}`);
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
      setTimetable([]);
    }
  };

  const getSlot = (day: string, period: number) => {
    return timetable.find(t => t.day === day && t.period === period);
  };

  const handleSlotChange = (day: string, period: number, field: string, value: any) => {
    const existingSlot = getSlot(day, period);
    
    if (existingSlot) {
      setTimetable(timetable.map(slot => 
        slot.day === day && slot.period === period
          ? { ...slot, [field]: value }
          : slot
      ));
    } else {
      setTimetable([...timetable, {
        day,
        period,
        classId: selectedClass,
        [field]: value,
        startTime: '08:00',
        endTime: '09:00',
      }]);
    }
  };

  const handleRemoveSlot = (day: string, period: number) => {
    setTimetable(timetable.filter(slot => !(slot.day === day && slot.period === period)));
  };

  const handleSave = async () => {
    if (!selectedClass) {
      alert('Please select a class');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        periods: timetable
          .filter(slot => slot.subjectId || slot.subject) // Only save slots with subjects
          .map(slot => ({
            day: slot.day,
            periodNumber: slot.period, // Backend expects 'periodNumber'
            subject: slot.subjectId || slot.subject,
            teacherId: slot.teacherId || slot.teacher?.id || null,
            startTime: slot.startTime || '08:00',
            endTime: slot.endTime || '09:00',
            room: slot.room || null,
          })),
        academicYear: '2024',
        term: 'Term 1',
      };

      await api.put(`/timetable/class/${selectedClass}`, payload); // Changed to PUT
      
      alert('Timetable saved successfully!');
      router.push('/dashboard/timetable');
    } catch (error: any) {
      console.error('Failed to save timetable:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save timetable. Please try again.';
      
      // Handle network errors (backend not running)
      if (error.message === 'Network Error' || error.code === 'ERR_NETWORK') {
        alert('Backend server is not running. Timetable changes cannot be saved.\n\nPlease start the backend server and try again.');
      } else if (error.response?.status === 404) {
        alert('Timetable API endpoint not found. Please ensure the backend is updated.');
      } else {
        alert(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fadeIn">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Timetable
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="text-gradient">Edit Timetable</span>
              </h1>
              <p className="text-gray-600 mt-2">Manage class schedules and teacher assignments</p>
            </div>
            <Button onClick={handleSave} disabled={loading || !selectedClass}>
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Class Selector */}
        <Card className="card-modern border-0 mb-6">
          <CardHeader>
            <CardTitle>Select Class</CardTitle>
            <CardDescription>Choose the class to edit the timetable for</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3 flex-wrap">
              {classes.map((cls) => (
                <Button
                  key={cls.id}
                  variant={selectedClass === cls.id ? 'default' : 'outline'}
                  onClick={() => setSelectedClass(cls.id)}
                >
                  {cls.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Timetable Editor */}
        {selectedClass && (
          <Card className="card-modern border-0">
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
              <CardDescription>
                Click on a slot to edit, or add new classes to empty slots
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600">
                      <th className="border border-indigo-500 p-3 text-left text-sm font-semibold text-white">
                        Day / Period
                      </th>
                      {periods.map(p => (
                        <th key={p} className="border border-indigo-500 p-3 text-center text-sm font-semibold text-white">
                          Period {p}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {days.map(day => (
                      <tr key={day}>
                        <td className="border border-gray-300 p-3 font-semibold text-sm bg-gray-50">
                          {day.charAt(0) + day.slice(1).toLowerCase()}
                        </td>
                        {periods.map(period => {
                          const slot = getSlot(day, period);
                          return (
                            <td key={period} className="border border-gray-300 p-2 min-w-[180px]">
                              {slot ? (
                                <div className="space-y-2">
                                  <select
                                    value={slot.subjectId || slot.subject || ''}
                                    onChange={(e) => handleSlotChange(day, period, 'subjectId', e.target.value)}
                                    className="w-full text-xs border rounded p-1"
                                  >
                                    <option value="">Select Subject</option>
                                    {subjects.map(subj => (
                                      <option key={subj.id} value={subj.id}>
                                        {subj.name}
                                      </option>
                                    ))}
                                  </select>
                                  
                                  <select
                                    value={slot.teacherId || slot.teacher?.id || ''}
                                    onChange={(e) => handleSlotChange(day, period, 'teacherId', e.target.value)}
                                    className="w-full text-xs border rounded p-1"
                                  >
                                    <option value="">Select Teacher</option>
                                    {teachers.map(teacher => (
                                      <option key={teacher.id} value={teacher.id}>
                                        {teacher.name || `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.user?.firstName + ' ' + teacher.user?.lastName || 'Unknown'}
                                      </option>
                                    ))}
                                  </select>
                                  
                                  <div className="flex gap-1">
                                    <input
                                      type="time"
                                      value={slot.startTime || '08:00'}
                                      onChange={(e) => handleSlotChange(day, period, 'startTime', e.target.value)}
                                      className="w-full text-xs border rounded p-1"
                                    />
                                    <input
                                      type="time"
                                      value={slot.endTime || '09:00'}
                                      onChange={(e) => handleSlotChange(day, period, 'endTime', e.target.value)}
                                      className="w-full text-xs border rounded p-1"
                                    />
                                  </div>
                                  
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    className="w-full"
                                    onClick={() => handleRemoveSlot(day, period)}
                                  >
                                    <Trash2 className="h-3 w-3 mr-1" />
                                    Remove
                                  </Button>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => handleSlotChange(day, period, 'subjectId', '')}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Class
                                </Button>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Tip:</strong> Select a subject and teacher for each slot, set the time range, 
                  and click "Save Changes" when done. Empty slots will not be saved.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

