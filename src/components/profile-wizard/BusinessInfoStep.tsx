import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLast?: boolean;
}

const businessTypes = [
  'Individual', 'Partnership', 'LLC', 'Corporation'
];

export default function BusinessInfoStep({ data, onNext, onBack }: Props) {
  const [form, setForm] = useState({
    businessName: data.businessName || '',
    businessType: data.businessType || '',
    yearsInBusiness: data.yearsInBusiness || '',
    address: data.address || '',
    phone: data.phone || '',
    email: data.email || '',
    website: data.website || '',
    description: data.description || '',
    logo: null as File | null,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm(f => ({ ...f, logo: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName || !form.businessType || !form.address || !form.phone || !form.email) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Business Information">
      <h2 className="text-xl font-bold mb-4">Business Information</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <label htmlFor="businessName" className="block mb-2">Business Name *</label>
      <Input id="businessName" name="businessName" value={form.businessName} onChange={handleChange} required />

      <label htmlFor="businessType" className="block mt-4 mb-2">Business Type *</label>
      <select
        id="businessType"
        name="businessType"
        value={form.businessType}
        onChange={handleChange}
        required
        className="w-full border rounded px-3 py-2"
      >
        <option value="">Select type</option>
        {businessTypes.map(type => <option key={type} value={type}>{type}</option>)}
      </select>

      <label htmlFor="yearsInBusiness" className="block mt-4 mb-2">Years in Business</label>
      <Input id="yearsInBusiness" name="yearsInBusiness" type="number" min="0" value={form.yearsInBusiness} onChange={handleChange} />

      <label htmlFor="address" className="block mt-4 mb-2">Business Address *</label>
      <Input id="address" name="address" value={form.address} onChange={handleChange} required />

      <label htmlFor="phone" className="block mt-4 mb-2">Phone *</label>
      <Input id="phone" name="phone" value={form.phone} onChange={handleChange} required />

      <label htmlFor="email" className="block mt-4 mb-2">Email *</label>
      <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

      <label htmlFor="website" className="block mt-4 mb-2">Website</label>
      <Input id="website" name="website" value={form.website} onChange={handleChange} />

      <label htmlFor="description" className="block mt-4 mb-2">Business Description</label>
      <textarea
        id="description"
        name="description"
        value={form.description}
        onChange={handleChange}
        className="w-full border rounded px-3 py-2"
        rows={3}
      />

      <label htmlFor="logo" className="block mt-4 mb-2">Company Logo (optional)</label>
      <Input id="logo" name="logo" type="file" accept="image/*" onChange={handleLogoChange} />

      <div className="flex justify-between mt-6">
        <Button type="button" onClick={onBack} variant="outline">Back</Button>
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
} 