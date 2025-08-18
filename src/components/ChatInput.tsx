import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Paperclip, Send } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string, imageUrls?: string[]) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const [content, setContent] = useState('');
  // In a real implementation, you'd handle file objects and upload them
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const handleSend = () => {
    if (content.trim() || imageUrls.length > 0) {
      onSendMessage(content, imageUrls);
      setContent('');
      setImageUrls([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageUpload = () => {
    // This would open a file picker
    // For demo, we'll just add a placeholder image
    const newImageUrl = `https://placehold.co/400x300?text=Image+${imageUrls.length + 1}`;
    setImageUrls(prev => [...prev, newImageUrl]);
    // In a real app, you would upload the file and get a URL from your storage
    // then call onSendMessage
    onSendMessage('', [newImageUrl]);

  };

  return (
    <div className="p-4 border-t">
      <div className="relative">
        <Textarea
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pr-20"
          rows={1}
          disabled={isLoading}
        />
        <div className="absolute top-1/2 right-3 -translate-y-1/2 flex gap-2">
          <Button type="button" size="icon" variant="ghost" onClick={handleImageUpload} disabled={isLoading}>
            <Paperclip className="h-5 w-5" />
          </Button>
          <Button type="submit" size="icon" onClick={handleSend} disabled={(!content.trim() && imageUrls.length === 0) || isLoading}>
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 