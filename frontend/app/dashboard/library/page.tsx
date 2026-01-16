'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Book, Search, Plus, RotateCcw, Clock, CheckCircle } from 'lucide-react';

export default function LibraryPage() {
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    totalBooks: 0,
    issuedBooks: 0,
    overdueBooks: 0
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/library/books');
      const booksData = response.data.books || [];
      setBooks(booksData);

      const totalBooks = booksData.reduce((sum: number, b: any) => sum + (b.quantity || 0), 0);
      const issuedBooks = booksData.reduce((sum: number, b: any) => sum + ((b.quantity || 0) - (b.available || 0)), 0);
      // Mock overdue for now as it requires checking borrow records
      const overdueBooks = 0; 

      setStats({ totalBooks, issuedBooks, overdueBooks });
    } catch (error) {
      console.error('Failed to fetch books:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(search.toLowerCase()) ||
    book.author?.toLowerCase().includes(search.toLowerCase()) ||
    book.isbn?.includes(search)
  );

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Library Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage book catalog, borrowing, and returns
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => window.location.href = '/dashboard/library/issue'}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Issue Book
            </Button>
            <Button onClick={() => window.location.href = '/dashboard/library/new'}>
              <Plus className="h-4 w-4 mr-2" />
              Add Book
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Book className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBooks}</div>
              <p className="text-xs text-gray-500 mt-1">In catalog</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issued Books</CardTitle>
              <div className="p-2 bg-blue-50 rounded-lg">
                <RotateCcw className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.issuedBooks}</div>
              <p className="text-xs text-gray-500 mt-1">Currently borrowed</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overdue</CardTitle>
              <div className="p-2 bg-red-50 rounded-lg">
                <Clock className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.overdueBooks}</div>
              <p className="text-xs text-gray-500 mt-1">Return pending</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by title, author, or ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Book Catalog</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : filteredBooks.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left table-modern">
                  <thead className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                      <th className="px-6 py-3">Title</th>
                      <th className="px-6 py-3">Author</th>
                      <th className="px-6 py-3">ISBN</th>
                      <th className="px-6 py-3">Availability</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{book.title}</td>
                        <td className="px-6 py-4">{book.author || '-'}</td>
                        <td className="px-6 py-4">{book.isbn || '-'}</td>
                        <td className="px-6 py-4">
                          <Badge variant={book.available > 0 ? 'success' : 'destructive'}>
                            {book.available} / {book.quantity} Available
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            disabled={book.available === 0}
                            onClick={() => window.location.href = `/dashboard/library/issue?bookId=${book.id}`}
                          >
                            Issue Book
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">No books found</p>
                <p className="text-sm text-gray-500 mb-4">Start building your library catalog</p>
                <Button className="mt-4" onClick={() => window.location.href = '/dashboard/library/new'}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Book
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

