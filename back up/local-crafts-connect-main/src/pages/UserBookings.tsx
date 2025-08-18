
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/AuthProvider';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Booking, Professional, Service } from '@/integrations/supabase/types.d';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ReviewForm from '@/components/ReviewForm';
import { CalendarClock, CheckCircle, Clock, MapPin, Star } from 'lucide-react';

type BookingWithDetails = Booking & {
  professional: Professional;
  service: Service;
  has_review: boolean;
};

const UserBookings = () => {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<BookingWithDetails | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          professional:professionals(*),
          service:services(*)
        `)
        .eq('customer_id', user?.id || '')
        .order('scheduled_at', { ascending: false });

      if (bookingsError) throw bookingsError;

      // Get all reviews for these bookings to check which ones already have reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('booking_id')
        .in('booking_id', bookingsData.map(b => b.id));

      if (reviewsError) throw reviewsError;

      // Create a set of booking IDs that already have reviews
      const reviewedBookingIds = new Set(reviewsData.map(r => r.booking_id));

      // Add a has_review field to each booking
      const bookingsWithReviewInfo = bookingsData.map(booking => ({
        ...booking,
        has_review: reviewedBookingIds.has(booking.id)
      }));

      setBookings(bookingsWithReviewInfo);
    } catch (error: any) {
      console.error('Error fetching bookings:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load bookings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (booking: BookingWithDetails) => {
    setSelectedBooking(booking);
    setShowReviewForm(true);
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
    fetchBookings();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navigation />
      
      <div className="container mx-auto py-8 px-4 flex-1">
        <h1 className="text-3xl font-bold mb-6">My Bookings</h1>

        {loading ? (
          <div className="text-center py-8">Loading your bookings...</div>
        ) : showReviewForm && selectedBooking ? (
          <div>
            <Button 
              variant="ghost" 
              onClick={() => setShowReviewForm(false)}
              className="mb-4"
            >
              ← Back to bookings
            </Button>
            <ReviewForm 
              professional={selectedBooking.professional} 
              booking={selectedBooking}
              onSuccess={handleReviewSuccess}
            />
          </div>
        ) : (
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You don't have any bookings yet.</p>
                  <Button className="mt-4" onClick={() => navigate('/services')}>
                    Browse Services
                  </Button>
                </div>
              ) : (
                bookings.map((booking) => (
                  <BookingCard 
                    key={booking.id} 
                    booking={booking} 
                    onReviewClick={handleReviewClick} 
                  />
                ))
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="space-y-4">
              {bookings.filter(b => b.status === 'completed').length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You don't have any completed bookings.</p>
                </div>
              ) : (
                bookings
                  .filter(b => b.status === 'completed')
                  .map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onReviewClick={handleReviewClick}
                    />
                  ))
              )}
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              {bookings.filter(b => ['pending', 'confirmed'].includes(b.status)).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">You don't have any upcoming bookings.</p>
                  <Button className="mt-4" onClick={() => navigate('/services')}>
                    Book a Service
                  </Button>
                </div>
              ) : (
                bookings
                  .filter(b => ['pending', 'confirmed'].includes(b.status))
                  .map((booking) => (
                    <BookingCard 
                      key={booking.id} 
                      booking={booking} 
                      onReviewClick={handleReviewClick}
                    />
                  ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

interface BookingCardProps {
  booking: BookingWithDetails;
  onReviewClick: (booking: BookingWithDetails) => void;
}

const BookingCard = ({ booking, onReviewClick }: BookingCardProps) => {
  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-purple-100 text-purple-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{booking.service.name}</CardTitle>
            <div className="text-muted-foreground mt-1">
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
                {booking.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground flex items-center justify-end">
              <CalendarClock className="h-4 w-4 mr-1" />
              {new Date(booking.scheduled_at).toLocaleDateString()}
            </div>
            <div className="text-sm text-muted-foreground flex items-center justify-end mt-1">
              <Clock className="h-4 w-4 mr-1" />
              {new Date(booking.scheduled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between">
          <div className="mb-4 sm:mb-0">
            <h4 className="font-medium mb-2">Service Provider</h4>
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mr-3">
                {booking.professional.profile_image_url ? (
                  <img src={booking.professional.profile_image_url} alt={booking.professional.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-lg font-bold text-gray-600">{booking.professional.name.charAt(0)}</span>
                )}
              </div>
              <div>
                <div className="font-medium">{booking.professional.name}</div>
                {booking.professional.average_rating > 0 && (
                  <div className="flex items-center text-sm text-yellow-500">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    {booking.professional.average_rating.toFixed(1)}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Details</h4>
            <div className="text-sm">
              <div className="mb-1">
                <span className="font-medium">Duration:</span> {booking.estimated_duration} mins
              </div>
              {booking.price && (
                <div className="mb-1">
                  <span className="font-medium">Price:</span> ${booking.price}
                </div>
              )}
              {booking.notes && (
                <div>
                  <span className="font-medium">Notes:</span> {booking.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          {booking.status === 'completed' && !booking.has_review && (
            <Button onClick={() => onReviewClick(booking)}>
              <Star className="h-4 w-4 mr-2" /> Leave Review
            </Button>
          )}
          {booking.status === 'completed' && booking.has_review && (
            <div className="text-green-600 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" /> Reviewed
            </div>
          )}
          {booking.status === 'confirmed' && (
            <Button variant="outline">
              Track Provider
            </Button>
          )}
        </div>
        
        {(booking.status === 'pending' || booking.status === 'confirmed') && (
          <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
            Cancel Booking
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default UserBookings;
