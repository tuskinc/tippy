import { useState, useEffect, useCallback } from 'react';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from './ui/use-toast';
import { useChat } from 'ai/react';
import { Message } from '@/types';

// Define types for conversation and message based on your DB schema
interface Conversation {
  id: string;
  title: string;
  user_id: string;
}

const ChatContainer = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [initialMessages, setInitialMessages] = useState<Message[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(false);

  const { messages, setMessages, append, isLoading } = useChat({
    api: '/.netlify/functions/chatbot',
    onFinish: async (message) => {
      // Save assistant response to DB
      if (selectedConversation) {
        await supabase.from('chatbot_messages').insert({
          conversation_id: selectedConversation.id,
          role: 'assistant',
          content: message.content,
        });
      }
    }
  });

  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConversations(true);
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error fetching conversations', description: error.message, variant: 'destructive' });
    } else {
      setConversations(data as Conversation[]);
      if (data.length > 0) {
        setSelectedConversation(data[0] as Conversation);
      }
    }
    setLoadingConversations(false);
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    const { data, error } = await supabase
      .from('chatbot_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      toast({ title: 'Error fetching messages', description: error.message, variant: 'destructive' });
      setMessages([]);
    } else {
      setInitialMessages(data as Message[]);
      setMessages(data as Message[]);
    }
  }, [setInitialMessages, setMessages]);

  useEffect(() => {
    if (user) {
      fetchConversations();
    }
  }, [user, fetchConversations]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, fetchMessages, setMessages]);

  const handleSendMessage = async (content: string, imageUrls?: string[]) => {
    if (!user) {
      toast({ title: 'You must be logged in to chat.', variant: 'destructive' });
      return;
    }
    
    let currentConversation = selectedConversation;
    let isNewConversation = false;

    // Create a new conversation if one doesn't exist
    if (!currentConversation) {
      const { data, error } = await supabase
        .from('chatbot_conversations')
        .insert({ user_id: user.id, title: content.substring(0, 50) })
        .select()
        .single();
      
      if (error) {
        toast({ title: 'Error starting new conversation', description: error.message, variant: 'destructive' });
        return;
      }
      currentConversation = data;
      isNewConversation = true;
    }

    const userMessage = {
      role: 'user' as const,
      content,
      ...(imageUrls && imageUrls.length > 0 && { data: { imageUrls } }),
    };

    if (!currentConversation) {
      toast({ title: 'Could not establish a conversation.', variant: 'destructive' });
      return;
    }

    // Save user message to DB
    const { data: savedMessage, error: messageError } = await supabase.from('chatbot_messages').insert({
      conversation_id: currentConversation.id,
      role: 'user',
      content,
      image_urls: imageUrls
    }).select().single();
    
    if (messageError) {
      toast({ title: 'Error sending message', description: messageError.message, variant: 'destructive' });
      return;
    }
    
    if (isNewConversation) {
      setConversations([currentConversation!, ...conversations]);
      setSelectedConversation(currentConversation);
      // This is a new chat, so we use `append` directly on a blank slate.
      await append(userMessage);
    } else {
      // For existing chats, we need to make sure the chat hook has the full history.
      // We rebuild the history from our DB state and then append the new message.
      setMessages([...initialMessages, savedMessage as Message]);
      await append(userMessage);
    }
  };

  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* Sidebar for conversations */}
      <div className="w-1/4 border-r overflow-y-auto">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Conversations</h2>
        </div>
        {loadingConversations && <div className="p-4">Loading...</div>}
        <ul>
          {conversations.map(convo => (
            <li
              key={convo.id}
              className={`p-4 cursor-pointer hover:bg-muted ${selectedConversation?.id === convo.id ? 'bg-muted' : ''}`}
              onClick={() => setSelectedConversation(convo)}
            >
              {convo.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1">
        {selectedConversation ? (
          <>
            <MessageList messages={messages} loading={isLoading} />
            <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Select a conversation or start a new one.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatContainer; 