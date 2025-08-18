import React, { useState } from 'react';
// Import step components (to be created)
// import BusinessInfoStep from '@/components/profile-wizard/BusinessInfoStep';
// import ServiceOfferingsStep from '@/components/profile-wizard/ServiceOfferingsStep';
// import CredentialsStep from '@/components/profile-wizard/CredentialsStep';
// import PortfolioStep from '@/components/profile-wizard/PortfolioStep';
// import PricingStep from '@/components/profile-wizard/PricingStep';
// import AvailabilityStep from '@/components/profile-wizard/AvailabilityStep';
// import LocationStep from '@/components/profile-wizard/LocationStep';
// import ReviewPublishStep from '@/components/profile-wizard/ReviewPublishStep';

const steps = [
  'Business Info',
  'Service Offerings',
  'Credentials',
  'Portfolio',
  'Pricing',
  'Availability',
  'Location',
  'Review & Publish',
];

export default function ProviderProfileWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState({});

  // Placeholder for step components
  const StepComponent = () => (
    <div className="p-8 bg-white rounded shadow text-center">
      <h2 className="text-xl font-bold mb-4">{steps[currentStep]}</h2>
      <p>Step UI goes here.</p>
      <div className="flex justify-between mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
          disabled={currentStep === 0}
        >Back</button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={currentStep === steps.length - 1}
        >Next</button>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Tippy: Provider Profile Wizard</h1>
      {/* Location Reminder for Providers */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded text-blue-900 flex items-center" role="alert" aria-live="polite">
        <svg className="h-6 w-6 mr-3 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c.5304 0 1.0391-.2107 1.4142-.5858C13.7893 10.0391 14 9.5304 14 9s-.2107-1.0391-.5858-1.4142C13.0391 7.2107 12.5304 7 12 7s-1.0391.2107-1.4142.5858C10.2107 7.9609 10 8.4696 10 9s.2107 1.0391.5858 1.4142C10.9609 10.7893 11.4696 11 12 11zm0 0v2m0 4h.01" /></svg>
        <span className="font-semibold">Important:</span>
        <span className="ml-2">To help customers find you, please always keep your device location <strong>turned on</strong> while using the app. This ensures your services appear in local searches and on the map.</span>
      </div>
      <div className="flex items-center mb-8">
        {steps.map((step, idx) => (
          <div key={step} className="flex-1 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${idx === currentStep ? 'bg-blue-600' : 'bg-gray-300'}`}>{idx + 1}</div>
            <span className={`text-xs mt-2 ${idx === currentStep ? 'text-blue-600' : 'text-gray-500'}`}>{step}</span>
            {idx < steps.length - 1 && <div className="w-full h-1 bg-gray-200 mt-2 mb-2" />}
          </div>
        ))}
      </div>
      <StepComponent />
    </div>
  );
} 