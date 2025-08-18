import { Avatar, AvatarFallback } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Message } from '@/types';



interface MessageItemProps {
  message: Message;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={cn('flex items-start gap-4', isUser ? 'justify-end' : '')}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          {/* You might want a specific assistant avatar */}
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-[75%] rounded-lg p-3 text-sm',
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        )}
      >
        <p>{message.content}</p>
        {message.image_urls && message.image_urls.length > 0 && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {message.image_urls.map((url, index) => (
              <img
                key={index}
                src={url}
                alt={`Uploaded image ${index + 1}`}
                className="rounded-md object-cover"
                loading="lazy"
              />
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <Avatar className="h-8 w-8">
          {/* You might want to show user's avatar here */}
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

export default MessageItem; 