'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';
import { ArrowLeft, Package } from 'lucide-react';

export default function NewInventoryItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'STATIONERY',
    quantity: '',
    unitPrice: '',
    minimumStock: '',
    supplier: '',
    supplierContact: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/inventory/items', {
        name: formData.name,
        category: formData.category,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        minimumStock: parseInt(formData.minimumStock) || 0,
        supplier: formData.supplier,
        supplierContact: formData.supplierContact,
        location: formData.location,
        description: formData.description,
      });

      alert('Inventory item added successfully!');
      router.push('/dashboard/inventory');
    } catch (error) {
      console.error('Failed to add item:', error);
      alert('Failed to add item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const categories = [
    'STATIONERY',
    'FURNITURE',
    'ELECTRONICS',
    'SPORTS_EQUIPMENT',
    'LABORATORY',
    'LIBRARY',
    'CLEANING',
    'KITCHEN',
    'MEDICAL',
    'TOOLS',
    'TEXTBOOKS',
    'OTHER',
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6 animate-fadeIn">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-indigo-50 rounded-lg">
            <Package className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold">
            <span className="text-gradient">Add New Inventory Item</span>
          </h1>
        </div>
        <p className="text-gray-600">Add a new item to the school inventory system</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="card-modern border-0 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <CardHeader>
            <CardTitle>Item Information</CardTitle>
            <CardDescription>Enter the details for the new inventory item</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., A4 Paper (Ream)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Current Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="Items in stock"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (KES) *</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={handleChange}
                  placeholder="Price per unit"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumStock">Minimum Stock Level</Label>
                <Input
                  id="minimumStock"
                  name="minimumStock"
                  type="number"
                  value={formData.minimumStock}
                  onChange={handleChange}
                  placeholder="Reorder threshold"
                  min="0"
                />
                <p className="text-xs text-gray-500">
                  Alert when stock falls below this level
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g., Store Room A, Shelf 3"
                />
              </div>
            </div>

            {/* Supplier Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Supplier Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier Name</Label>
                  <Input
                    id="supplier"
                    name="supplier"
                    value={formData.supplier}
                    onChange={handleChange}
                    placeholder="Supplier company name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supplierContact">Supplier Contact</Label>
                  <Input
                    id="supplierContact"
                    name="supplierContact"
                    value={formData.supplierContact}
                    onChange={handleChange}
                    placeholder="Phone or email"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Additional notes about the item (brand, model, specifications, etc.)"
                className="flex min-h-[100px] w-full rounded-lg border-2 border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Calculated Total Value */}
            {formData.quantity && formData.unitPrice && (
              <div className="bg-indigo-50 border-2 border-indigo-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Total Value</p>
                <p className="text-2xl font-bold text-indigo-600">
                  KES {(parseFloat(formData.quantity) * parseFloat(formData.unitPrice)).toLocaleString('en-KE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Adding Item...' : 'Add Item'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

