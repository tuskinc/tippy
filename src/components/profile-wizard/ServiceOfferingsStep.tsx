import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { serviceCategories } from '@/data/serviceCategories';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLast?: boolean;
}

export default function ServiceOfferingsStep({ data, onNext, onBack }: Props) {
  // State for selected categories and services
  const [selectedCategories, setSelectedCategories] = useState<string[]>(data.selectedCategories || []);
  const [services, setServices] = useState<any[]>(data.services || []);
  const [customService, setCustomService] = useState('');
  const [error, setError] = useState('');

  // Handle category selection
  const handleCategoryToggle = (slug: string) => {
    setSelectedCategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  // Add a service to the list
  const addService = (service: string, category: string) => {
    if (!service) return;
    setServices(prev => [...prev, { name: service, category, description: '', price: '', duration: '' }]);
  };

  // Add custom service
  const handleAddCustomService = () => {
    if (!customService) return;
    setServices(prev => [...prev, { name: customService, category: 'custom', description: '', price: '', duration: '' }]);
    setCustomService('');
  };

  // Update service details
  const updateService = (idx: number, field: string, value: string) => {
    setServices(prev => prev.map((s, i) => i === idx ? { ...s, [field]: value } : s));
  };

  // Remove a service
  const removeService = (idx: number) => {
    setServices(prev => prev.filter((_, i) => i !== idx));
  };

  // Handle next
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0 || services.length === 0) {
      setError('Please select at least one category and add at least one service.');
      return;
    }
    setError('');
    onNext({ selectedCategories, services });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Service Offerings">
      <h2 className="text-xl font-bold mb-4">Service Offerings</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Select Service Categories *</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {serviceCategories.map(cat => (
            <label key={cat.slug} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.slug)}
                onChange={() => handleCategoryToggle(cat.slug)}
                aria-checked={selectedCategories.includes(cat.slug)}
                aria-label={cat.name}
              />
              <span>{cat.name}</span>
            </label>
          ))}
        </div>
      </div>
      {/* Add services for selected categories */}
      {selectedCategories.map(catSlug => {
        const cat = serviceCategories.find(c => c.slug === catSlug);
        if (!cat) return null;
        return (
          <div key={catSlug} className="mb-4 border rounded p-3 bg-gray-50">
            <div className="font-semibold mb-2">{cat.name} Services</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {cat.services && cat.services.map((svc: string) => (
                <Button
                  key={svc}
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addService(svc, catSlug)}
                  disabled={services.some(s => s.name === svc && s.category === catSlug)}
                >
                  {svc}
                </Button>
              ))}
            </div>
          </div>
        );
      })}
      {/* Custom service input */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Add Custom Service</label>
        <div className="flex gap-2">
          <Input
            value={customService}
            onChange={e => setCustomService(e.target.value)}
            placeholder="Custom service name"
            aria-label="Custom service name"
          />
          <Button type="button" onClick={handleAddCustomService}>Add</Button>
        </div>
      </div>
      {/* List of added services with details */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Your Services</label>
        {services.length === 0 ? (
          <div className="text-gray-500">No services added yet.</div>
        ) : (
          <div className="space-y-4">
            {services.map((svc, idx) => (
              <div key={idx} className="border rounded p-3 bg-white">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold">{svc.name}</span>
                  <Button type="button" size="sm" variant="destructive" onClick={() => removeService(idx)}>Remove</Button>
                </div>
                <label className="block mb-1 text-sm">Description</label>
                <textarea
                  className="w-full border rounded px-2 py-1 mb-2"
                  value={svc.description}
                  onChange={e => updateService(idx, 'description', e.target.value)}
                  rows={2}
                  aria-label="Service description"
                />
                <div className="flex gap-4">
                  <div>
                    <label className="block mb-1 text-sm">Price</label>
                    <Input
                      type="number"
                      min="0"
                      value={svc.price}
                      onChange={e => updateService(idx, 'price', e.target.value)}
                      placeholder="e.g. 100"
                      aria-label="Service price"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 text-sm">Estimated Duration (min)</label>
                    <Input
                      type="number"
                      min="0"
                      value={svc.duration}
                      onChange={e => updateService(idx, 'duration', e.target.value)}
                      placeholder="e.g. 60"
                      aria-label="Estimated duration"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
} 