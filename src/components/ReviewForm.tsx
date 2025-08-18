import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Professional, Booking } from '@/integrations/supabase/types.d';
import { Star } from 'lucide-react';

interface ReviewFormProps {
  professional: Professional;
  booking: Booking;
  onSuccess?: () => void;
}

const ReviewForm = ({ professional, booking, onSuccess }: ReviewFormProps) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .insert({
          professional_id: professional.id,
          customer_id: user.id,
          booking_id: booking.id,
          rating,
          comment
        });

      if (error) throw error;

      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Leave a Review for {professional.name}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <div className="mb-2 font-medium">Rating</div>
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      rating >= star
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-transparent text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="mb-2 font-medium">Comments</div>
            <Textarea
              placeholder="Share your experience with this professional..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={5}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || rating === 0}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewForm;
