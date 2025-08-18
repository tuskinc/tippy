import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  data: any;
  onNext: (data: any) => void;
  onBack: () => void;
  isLast?: boolean;
}

export default function CredentialsStep({ data, onNext, onBack }: Props) {
  const [credentials, setCredentials] = useState<any[]>(data.credentials || []);
  const [type, setType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [expiry, setExpiry] = useState('');
  const [error, setError] = useState('');

  const addCredential = () => {
    if (!type || !file) {
      setError('Please select a type and upload a file.');
      return;
    }
    setCredentials(prev => [...prev, { type, file, expiry, status: 'Pending' }]);
    setType('');
    setFile(null);
    setExpiry('');
    setError('');
  };

  const removeCredential = (idx: number) => {
    setCredentials(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.length === 0) {
      setError('Please add at least one credential.');
      return;
    }
    setError('');
    onNext({ credentials });
  };

  return (
    <form onSubmit={handleSubmit} aria-label="Credentials & Verification">
      <h2 className="text-xl font-bold mb-4">Credentials & Verification</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Credential Type *</label>
        <select
          value={type}
          onChange={e => setType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select type</option>
          <option value="Professional License">Professional License</option>
          <option value="Insurance">Insurance</option>
          <option value="Certification">Certification</option>
          <option value="Background Check">Background Check</option>
          <option value="Association Membership">Association Membership</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Upload Document *</label>
        <Input type="file" accept="application/pdf,image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      </div>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Expiration Date (if applicable)</label>
        <Input type="date" value={expiry} onChange={e => setExpiry(e.target.value)} />
      </div>
      <Button type="button" onClick={addCredential} className="mb-4">Add Credential</Button>
      <div className="mb-4">
        <label className="block mb-2 font-medium">Your Credentials</label>
        {credentials.length === 0 ? (
          <div className="text-gray-500">No credentials added yet.</div>
        ) : (
          <div className="space-y-4">
            {credentials.map((cred, idx) => (
              <div key={idx} className="border rounded p-3 bg-white flex justify-between items-center">
                <div>
                  <div className="font-semibold">{cred.type}</div>
                  <div className="text-xs text-gray-500">{cred.file?.name}</div>
                  {cred.expiry && <div className="text-xs text-gray-500">Expires: {cred.expiry}</div>}
                  <div className="text-xs text-blue-600">Status: {cred.status}</div>
                </div>
                <Button type="button" size="sm" variant="destructive" onClick={() => removeCredential(idx)}>Remove</Button>
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