import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

/**
 * Pricing Page
 * This is a placeholder for your app's pricing information.
 * Add your pricing plans and details here.
 */
const Pricing = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Pricing</h1>
        <p className="text-lg text-gray-600 mb-8">
          Our pricing plans will be available here soon. Please check back later!
        </p>
        {/* TODO: Add pricing tables, features, and call-to-action buttons here */}
      </main>
      <Footer />
    </div>
  );
};

export default Pricing; 