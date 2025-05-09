import Image from 'next/image';
import { useMemo } from 'react';
import { CampaignDisplay, CampaignImage } from '@/types/campaign';
export function CampaignMainImage({ campaign }: { campaign: CampaignDisplay }) {
  const mainImage = useMemo(() => {
    if (!Array.isArray(campaign.images)) {
      return null;
    }
    return (
      campaign.images.find((img: CampaignImage) => img.isMainImage) ||
      campaign.images[0]
    );
  }, [campaign?.images]);
  const imageUrl = useMemo(() => mainImage?.imageUrl, [mainImage]);
  const alt = useMemo(() => campaign?.title, [campaign?.title]);
  return (
    <div className="lg:col-span-8">
      <div className="space-y-6">
        <div className="relative aspect-video overflow-hidden rounded-xl shadow-lg">
          {typeof imageUrl === 'string' && (
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-cover"
              priority
            />
          )}
        </div>
      </div>
    </div>
  );
}
