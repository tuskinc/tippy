
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { Review } from '@/integrations/supabase/types.d';

interface ReviewWithCustomer extends Review {
  customer: {
    name: string;
    id: string;
  } | null;
}

interface ReviewsListProps {
  professionalId: string;
}

const ReviewsList = ({ professionalId }: ReviewsListProps) => {
  const [reviews, setReviews] = useState<ReviewWithCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true);
      // First, get all reviews for this professional
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      if (!reviewsData || reviewsData.length === 0) {
        setReviews([]);
        setLoading(false);
        return;
      }

      const reviewsWithCustomers: ReviewWithCustomer[] = await Promise.all(
        (reviewsData as Review[]).map(async (review: Review) => {
          const { data: customerData, error: customerError } = await supabase
            .from('customers')
            .select('id, name')
            .eq('id', review.customer_id)
            .single();

          return {
            ...review,
            customer: customerError ? null : customerData,
          } as ReviewWithCustomer;
        })
      );

      setReviews(reviewsWithCustomers);
    } catch (err: unknown) {
      console.error('Error fetching reviews:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [professionalId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="py-4">Loading reviews...</div>;
  }

  if (reviews.length === 0) {
    return <div className="py-4 text-muted-foreground">No reviews yet.</div>;
  }

  return (
    <div className="space-y-4">
      {reviews.map((review: ReviewWithCustomer) => (
        <Card key={review.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarFallback>{review.customer?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{review.customer?.name || 'Anonymous User'}</div>
                  <div className="text-sm text-muted-foreground">{formatDate(review.created_at)}</div>
                </div>
              </div>
              <div className="flex items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-transparent text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            {review.comment && <p className="mt-2">{review.comment}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ReviewsList;
