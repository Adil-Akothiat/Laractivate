import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToastContext } from '@/app/hooks';

export function CheckoutAlert() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToastContext();

  useEffect(() => {
    const status = searchParams.get('status');

    if (status === 'success') {
      toast.success('🎉 Success!');

      // Clean query parameters from URL
      searchParams.delete('status');
      searchParams.delete('session_id');
      setSearchParams(searchParams, { replace: true });
    } else if (status === 'cancelled') {
      toast.error('Checkout was cancelled.');
      
      searchParams.delete('status');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  // Renders nothing visually; acts purely as an effect orchestrator
  return null;
}