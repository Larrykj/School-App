'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { MessageSquare, Send, Users, CheckCircle, XCircle, Clock, Plus } from 'lucide-react';

export default function SMSPage() {
  const [smsLogs, setSmsLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [stats, setStats] = useState({ sent: 0, delivered: 0, failed: 0 });

  // Compose form state
  const [recipient, setRecipient] = useState<'all' | 'class' | 'individual'>('all');
  const [classId, setClassId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchSMS();
  }, []);

  const fetchSMS = async () => {
    try {
      const response = await api.get('/sms/logs', { params: { limit: 50 } });
      const logs = response.data.logs || [];
      setSmsLogs(logs);

      // Calculate stats
      const sent = logs.length;
      const delivered = logs.filter((log: any) => log.status === 'DELIVERED').length;
      const failed = logs.filter((log: any) => log.status === 'FAILED').length;
      setStats({ sent, delivered, failed });
    } catch (error) {
      console.error('Failed to fetch SMS logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendSMS = async () => {
    if (!message.trim()) {
      alert('Please enter a message');
      return;
    }

    setSending(true);
    try {
      const data: any = { message };

      if (recipient === 'individual') {
        if (!phoneNumber) {
          alert('Please enter a phone number');
          return;
        }
        data.phoneNumbers = [phoneNumber];
      } else if (recipient === 'class') {
        if (!classId) {
          alert('Please select a class');
          return;
        }
        data.classId = classId;
      }

      await api.post('/sms/send', data);
      
      alert('SMS sent successfully!');
      setMessage('');
      setPhoneNumber('');
      setShowCompose(false);
      fetchSMS();
    } catch (error: any) {
      console.error('Failed to send SMS:', error);
      alert(error.response?.data?.error || 'Failed to send SMS');
    } finally {
      setSending(false);
    }
  };

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">SMS Communication</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Send bulk SMS to students, parents, and staff
            </p>
          </div>
          <Button onClick={() => setShowCompose(!showCompose)}>
            <Plus className="h-4 w-4 mr-2" />
            Compose SMS
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Send className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.sent}</div>
              <p className="text-xs text-gray-500 mt-1">SMS messages</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Delivered</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.delivered}</div>
              <p className="text-xs text-gray-500 mt-1">
                {stats.sent > 0 ? `${Math.round((stats.delivered / stats.sent) * 100)}% success rate` : '0% success rate'}
              </p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
              <div className="p-2 bg-red-50 rounded-lg">
                <XCircle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.failed}</div>
              <p className="text-xs text-gray-500 mt-1">Delivery failures</p>
            </CardContent>
          </Card>
        </div>

        {/* Compose SMS */}
        {showCompose && (
          <Card className="card-modern border-0 mb-8 animate-fadeIn">
            <CardHeader>
              <CardTitle>Compose SMS</CardTitle>
              <CardDescription>Send SMS to students, parents, or staff</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Recipient Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Send To
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant={recipient === 'all' ? 'default' : 'outline'}
                    onClick={() => setRecipient('all')}
                    className="justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    All Parents
                  </Button>
                  <Button
                    variant={recipient === 'class' ? 'default' : 'outline'}
                    onClick={() => setRecipient('class')}
                    className="justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Specific Class
                  </Button>
                  <Button
                    variant={recipient === 'individual' ? 'default' : 'outline'}
                    onClick={() => setRecipient('individual')}
                    className="justify-start"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Individual
                  </Button>
                </div>
              </div>

              {/* Class Selection (if class is selected) */}
              {recipient === 'class' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Class
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Choose a class...</option>
                    {/* These would be fetched from API */}
                    <option value="1">Grade 1A</option>
                    <option value="2">Grade 2B</option>
                    <option value="3">Grade 3C</option>
                  </select>
                </div>
              )}

              {/* Phone Number (if individual is selected) */}
              {recipient === 'individual' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="07XX XXX XXX or 2547XX XXX XXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message ({message.length}/160 characters)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={4}
                  placeholder="Type your message here..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={160}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Keep messages clear and concise
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={() => setShowCompose(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSendSMS} disabled={sending || !message.trim()}>
                  {sending ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send SMS
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* SMS Logs */}
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>SMS History</CardTitle>
            <CardDescription>Recent SMS messages sent from the system</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading SMS logs...</p>
                </div>
              </div>
            ) : smsLogs.length > 0 ? (
              <div className="space-y-4">
                {smsLogs.map((log) => (
                  <div key={log.id} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              log.status === 'DELIVERED' ? 'success' :
                              log.status === 'PENDING' ? 'warning' : 'destructive'
                            }
                          >
                            {log.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{log.phoneNumber}</span>
                        </div>
                        <p className="text-sm text-gray-900 mb-2">{log.message}</p>
                        <p className="text-xs text-gray-500">{formatDate(log.sentAt)}</p>
                      </div>
                      <div className="ml-4">
                        {log.status === 'DELIVERED' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : log.status === 'PENDING' ? (
                          <Clock className="h-5 w-5 text-yellow-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No SMS sent yet</p>
                <p className="text-sm text-gray-500 mt-2">
                  Send your first SMS to communicate with parents and students
                </p>
                <Button className="mt-4" onClick={() => setShowCompose(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Compose SMS
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

