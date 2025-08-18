import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ChatContainer from '@/components/ChatContainer';

const ChatbotPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <main className="flex-1 container py-8">
        <h1 className="text-3xl font-bold mb-6">Tippy AI Assistant</h1>
        <ChatContainer />
      </main>
      <Footer />
    </div>
  );
};

export default ChatbotPage; 