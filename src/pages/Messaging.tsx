import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Paperclip, Send } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface Message {
  id: number;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  file_url?: string;
  file_type?: string;
  profiles: {
    avatar_url: string;
    first_name: string;
    last_name: string;
  };
}

const MessagingPage = () => {
  const { providerId } = useParams<{ providerId: string }>();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [providerProfile, setProviderProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!providerId || !user) return;

    // Fetch provider profile
    const fetchProviderProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', providerId)
        .single();
      if (error) {
        toast({ title: "Error", description: "Could not fetch provider details.", variant: "destructive" });
      } else {
        setProviderProfile(data);
      }
    };

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select(`*, profiles:sender_id(*)`)
        .or(`(sender_id.eq.${user.id},receiver_id.eq.${providerId}),(sender_id.eq.${providerId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        toast({ title: "Error", description: "Could not fetch messages.", variant: "destructive" });
      } else {
        setMessages(data as any);
      }
      setLoading(false);
    };

    fetchProviderProfile();
    fetchMessages();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`messages:${user.id}:${providerId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        // Add profile data to the new message before adding to state
        const newMessage = payload.new as Message;
        if ((newMessage.sender_id === user.id && newMessage.receiver_id === providerId) || 
            (newMessage.sender_id === providerId && newMessage.receiver_id === user.id)) {
            // This is a simple way, ideally fetch the profile if not available
            const profileData = newMessage.sender_id === user.id ? { avatar_url: user.user_metadata.avatar_url, first_name: user.user_metadata.first_name, last_name: '' } : { avatar_url: providerProfile.avatar_url, first_name: providerProfile.first_name, last_name: providerProfile.last_name };
            (newMessage as any).profiles = profileData;
            setMessages((prev) => [...prev, newMessage]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [providerId, user, providerProfile]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user || !providerId) return;

    const { error } = await supabase
      .from('messages')
      .insert({ sender_id: user.id, receiver_id: providerId, content: newMessage });
    
    if (error) {
      toast({ title: "Error", description: "Could not send message.", variant: "destructive" });
    } else {
      setNewMessage('');
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user || !providerId) return;

    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('message_attachments')
      .upload(filePath, file);

    if (uploadError) {
      toast({ title: 'Upload Error', description: uploadError.message, variant: 'destructive' });
      return;
    }
    
    const { data: { publicUrl } } = supabase.storage.from('message_attachments').getPublicUrl(filePath);

    const { error: insertError } = await supabase.from('messages').insert({
      sender_id: user.id,
      receiver_id: providerId,
      file_url: publicUrl,
      file_type: file.type.startsWith('image/') ? 'image' : 'video',
      content: file.name
    });

     if (insertError) {
      toast({ title: 'Error', description: 'Could not send file.', variant: 'destructive' });
    }
  };

  if (loading) return <div>Loading chat...</div>;
  if (!providerProfile) return <div>Provider not found.</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      <div className="flex-grow container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={providerProfile.avatar_url} />
                <AvatarFallback>{providerProfile.first_name?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Chat with {providerProfile.first_name} {providerProfile.last_name}</CardTitle>
                <p className="text-sm text-muted-foreground">{providerProfile.business_name}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[60vh] overflow-y-auto p-4 border rounded-md mb-4 bg-gray-50/50">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex items-end gap-2 my-2 ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                   {msg.sender_id !== user?.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={msg.profiles?.avatar_url} />
                      <AvatarFallback>{msg.profiles?.first_name?.[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`rounded-lg px-3 py-2 max-w-sm ${msg.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                    {msg.file_url ? (
                      msg.file_type === 'image' ? (
                        <img src={msg.file_url} alt="attachment" className="rounded-md max-w-xs cursor-pointer" onClick={() => window.open(msg.file_url, '_blank')} loading="lazy" />
                      ) : (
                        <video src={msg.file_url} controls className="rounded-md max-w-xs" />
                      )
                    ) : (
                      <p>{msg.content}</p>
                    )}
                     <p className="text-xs opacity-70 mt-1">{new Date(msg.created_at).toLocaleTimeString()}</p>
                  </div>
                   {msg.sender_id === user?.id && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata.avatar_url} />
                      <AvatarFallback>{user.user_metadata.first_name?.[0]}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type a message..."
              />
              <Button variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()}>
                <Paperclip className="h-5 w-5" />
              </Button>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/png, image/jpeg, video/mp4, image/gif" />
              <Button onClick={handleSendMessage}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default MessagingPage; 