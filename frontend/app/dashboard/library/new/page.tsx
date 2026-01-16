'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/lib/api';
import { Book, ArrowLeft, Save, Loader2 } from 'lucide-react';

export default function NewBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    publisher: '',
    publishedYear: '',
    category: '',
    quantity: '1',
    description: '',
    shelfLocation: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        available: parseInt(formData.quantity),
        publishedYear: formData.publishedYear ? parseInt(formData.publishedYear) : undefined,
      };

      await api.post('/library/books', payload);
      
      alert('Book added successfully!');
      router.push('/dashboard/library');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to add book');
      console.error('Error adding book:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'Mathematics',
    'History',
    'Geography',
    'Literature',
    'Reference',
    'Biography',
    'Technology',
    'Arts',
    'Religion',
    'Philosophy',
    'Other'
  ];

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeIn">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Library
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Add New Book</span>
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Add a new book to your library catalog
          </p>
        </div>

        {/* Form Card */}
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Book className="h-5 w-5 text-indigo-600" />
              </div>
              Book Details
            </CardTitle>
            <CardDescription>Enter the book information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="alert-error animate-shake">
                  <p className="font-medium">Error</p>
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Book Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      placeholder="e.g., To Kill a Mockingbird"
                      className="input-modern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Author <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      required
                      placeholder="Harper Lee"
                      className="input-modern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN
                    </label>
                    <Input
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      placeholder="978-0-061-12008-4"
                      className="input-modern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Publisher
                    </label>
                    <Input
                      name="publisher"
                      value={formData.publisher}
                      onChange={handleChange}
                      placeholder="Publisher name"
                      className="input-modern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Published Year
                    </label>
                    <Input
                      type="number"
                      name="publishedYear"
                      value={formData.publishedYear}
                      onChange={handleChange}
                      min="1000"
                      max="2100"
                      placeholder="2024"
                      className="input-modern"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="input-modern"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      required
                      min="1"
                      placeholder="1"
                      className="input-modern"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Number of copies available
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Shelf Location
                    </label>
                    <Input
                      name="shelfLocation"
                      value={formData.shelfLocation}
                      onChange={handleChange}
                      placeholder="e.g., Shelf A3, Row 2"
                      className="input-modern"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Brief description or summary of the book"
                      className="input-modern"
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>📚 Tip:</strong> Make sure to verify the ISBN number for accurate book identification. You can add multiple copies by setting the quantity.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 btn-gradient"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding Book...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Add Book to Library
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

