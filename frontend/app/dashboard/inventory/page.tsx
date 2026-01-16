'use client';

import { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, Search, Plus, ArrowRightLeft, AlertTriangle, Archive } from 'lucide-react';

export default function InventoryPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStock: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await api.get('/inventory/items');
      const itemsData = response.data.items || [];
      setItems(itemsData);

      const totalItems = itemsData.length;
      const lowStock = itemsData.filter((i: any) => i.quantity <= (i.minQuantity || 5)).length;
      const totalValue = itemsData.reduce((sum: number, i: any) => sum + ((i.quantity || 0) * (i.unitPrice || 0)), 0);

      setStats({ totalItems, lowStock, totalValue });
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout>
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-3xl font-bold">
              <span className="text-gradient">Inventory Management</span>
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Track school assets, stationery, and equipment
            </p>
          </div>
          <Button onClick={() => window.location.href = '/dashboard/inventory/new'}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Items</CardTitle>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Package className="h-4 w-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
              <p className="text-xs text-gray-500 mt-1">Unique SKUs</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Low Stock Alerts</CardTitle>
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lowStock}</div>
              <p className="text-xs text-gray-500 mt-1">Items needing reorder</p>
            </CardContent>
          </Card>

          <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '300ms' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Value</CardTitle>
              <div className="p-2 bg-green-50 rounded-lg">
                <Archive className="h-4 w-4 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">KES {stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-gray-500 mt-1">Estimated inventory value</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by item name or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle>Inventory Items</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left table-modern">
                  <thead className="bg-gray-50 text-gray-700 uppercase">
                    <tr>
                      <th className="px-6 py-3">Item Name</th>
                      <th className="px-6 py-3">Category</th>
                      <th className="px-6 py-3">Quantity</th>
                      <th className="px-6 py-3">Unit Price</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium">{item.name}</td>
                        <td className="px-6 py-4">{item.category}</td>
                        <td className="px-6 py-4">{item.quantity}</td>
                        <td className="px-6 py-4">KES {item.unitPrice}</td>
                        <td className="px-6 py-4">
                          <Badge variant={item.quantity > (item.minQuantity || 5) ? 'success' : 'destructive'}>
                            {item.quantity > (item.minQuantity || 5) ? 'In Stock' : 'Low Stock'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <Button size="sm" variant="outline">
                            <ArrowRightLeft className="h-3 w-3 mr-1" />
                            Move
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No items found</p>
                <Button className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

