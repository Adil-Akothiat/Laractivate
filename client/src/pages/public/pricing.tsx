import { ScrollContainer } from '@/components/ScrollContainer';
import PublicPricing from '@/features/workspace/billing/components/PublicPricing';

export default function PricingPage() {
    return (
        <ScrollContainer>
            <div className="mt-8">
                <PublicPricing />
            </div>
        </ScrollContainer>
    );
};