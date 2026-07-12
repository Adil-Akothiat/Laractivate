import { ScrollContainer } from '@/components/ScrollContainer';
import PublicPricing from '@/features/base/billing/components/PublicPricing';

export default function PricingPage() {
  return (
    <ScrollContainer>
      <div className="mt-8">
        <PublicPricing />
      </div>
    </ScrollContainer>
  );
};