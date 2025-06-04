'use client';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  useCheckUserFavourite,
  useUpdateFavourite,
} from '@/lib/hooks/useFavourites';

interface FavoriteButtonProps {
  campaignId: number;
  initialIsFavorite?: boolean;
  onToggle?: (isFavorite: boolean) => void;
}

export function FavoriteButton({
  campaignId,
  initialIsFavorite = false,
  onToggle,
}: FavoriteButtonProps) {
  const { toast } = useToast();
  const { authenticated } = useAuth();
  const [favourite, setFavourite] = useState<boolean>(initialIsFavorite);
  const { data: isFavourite, isLoading } = useCheckUserFavourite(campaignId);
  const { mutateAsync: updateFavourite } = useUpdateFavourite();
  useEffect(() => setFavourite(isFavourite ?? false), [isFavourite]);
  const toggleFavourite = useCallback(async () => {
    if (!authenticated) {
      toast({
        title: 'Please connect your wallet to save favorites',
        variant: 'destructive',
      });
      return;
    }
    try {
      await updateFavourite({ campaignId });
      setFavourite(!favourite);

      if (onToggle) {
        onToggle(!favourite);
      }

      toast({
        title: !favourite // reverse because state is not yet updated
          ? 'Campaign added to favorites'
          : 'Campaign removed from favorites',
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: 'Failed to update favorites',
        description: 'Please try again later',
      });
    }
  }, [authenticated, updateFavourite, campaignId, favourite, onToggle, toast]);

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn('rounded-full', isLoading && 'opacity-50')}
      onClick={toggleFavourite}
      disabled={isLoading}
    >
      <Heart
        className={`h-4 w-4 ${favourite ? 'fill-red-500 text-red-500' : ''}`}
      />
    </Button>
  );
}
