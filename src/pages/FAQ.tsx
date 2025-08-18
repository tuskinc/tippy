import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

/**
 * FAQ Page
 * This is a placeholder for your app's frequently asked questions.
 * Add your FAQs and answers here.
 */
const FAQ = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 mb-8">
          Common questions and answers will be listed here soon. Please check back later!
        </p>
        {/* TODO: Add FAQ items and expand with real questions/answers */}
      </main>
      <Footer />
    </div>
  );
};

export default FAQ; 