import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

const Settings = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Tippy Settings</h1>
        <p className="text-lg text-gray-600">Settings will be available here soon.</p>
      </main>
      <Footer />
    </div>
  );
};

export default Settings; 