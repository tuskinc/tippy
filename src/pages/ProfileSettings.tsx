import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Footer from '@/components/Footer';
import { supabase } from '@/integrations/supabase/client';

const ProfileSettings: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle profile update
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      // Update user metadata
      const updates: any = { name, phone };
      const { error: metaError } = await supabase.auth.updateUser({ data: updates });
      if (metaError) throw metaError;

      // Update email if changed
      if (email !== user?.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email });
        if (emailError) throw emailError;
      }

      // Update password if provided
      if (password) {
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        const { error: passError } = await supabase.auth.updateUser({ password });
        if (passError) throw passError;
      }

      setMessage('Profile updated successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main content */}
      <main className="flex-1 container mx-auto py-8 px-4 max-w-lg">
        <h1 className="text-3xl font-bold mb-6">Tippy: Profile Settings</h1>
        <form onSubmit={handleSave} className="space-y-6">
          {message && <div className="p-3 bg-green-100 text-green-700 rounded">{message}</div>}
          {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={name} onChange={e => setName(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">New Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input id="confirmPassword" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default ProfileSettings; 