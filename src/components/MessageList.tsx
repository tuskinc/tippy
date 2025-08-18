import MessageItem from './MessageItem';
import { Message } from '@/types';



interface MessageListProps {
  messages: Message[];
  loading: boolean;
}

const MessageList = ({ messages, loading }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="space-y-6">
        {messages.map((msg) => (
          <MessageItem key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList; 