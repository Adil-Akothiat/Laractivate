import React, { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useToastContext } from "@/app/hooks/index";
import { PricingGrid } from '@/features/base/billing/components/PricingGrid';

const BillingPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToastContext();
  
  // Use a ref to guarantee we only execute the toast fire sequence once per mount phase
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (hasTriggered.current) return;

    const isSuccess = searchParams.get('success') === 'true';
    const isCancelled = searchParams.get('cancelled') === 'true';

    if (isSuccess) {
      hasTriggered.current = true;
      toast.success('Fulfillment completed! Welcome to your Pro Account features.');
      
      // Clean up the URL address bar gracefully so a page refresh doesn't re-trigger it
      searchParams.delete('success');
      setSearchParams(searchParams, { replace: true });
    }

    if (isCancelled) {
      hasTriggered.current = true;
      toast.warning('Checkout sequence aborted. No charges occurred.');
      
      // Clean up the URL bar parameters
      searchParams.delete('cancelled');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams, toast]);

  return (
    <div className="container mx-auto py-6">
      <div className="mt-8">
        <PricingGrid />
      </div>
    </div>
  );
};

export default BillingPage;