'use client'

import { useState, useEffect } from 'react'
import { useAccount } from '@/contexts'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface FavoriteButtonProps {
    campaignId: number
    initialIsFavorite?: boolean
    onToggle?: (isFavorite: boolean) => void
}

export function FavoriteButton({
    campaignId,
    initialIsFavorite = false,
    onToggle
}: FavoriteButtonProps) {
    const { toast } = useToast()
    const { address } = useAccount()
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (address && campaignId) {
            checkFavoriteStatus()
        }
    }, [address, campaignId])

    async function checkFavoriteStatus() {
        try {
            const response = await fetch(
                `/api/favorites?userAddress=${address}&campaignId=${campaignId}`
            )
            const data = await response.json()
            setIsFavorite(data.isFavorite)
        } catch (error) {
            console.error('Error checking favorite status:', error)
        }
    }

    async function toggleFavorite() {
        if (!address) {
            toast({
                title: 'Please connect your wallet to save favorites',
                variant: 'destructive'
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userAddress: address,
                    campaignId,
                }),
            })

            const data = await response.json()
            setIsFavorite(data.isFavorite)

            if (onToggle) {
                onToggle(data.isFavorite)
            }

            toast({
                title: data.isFavorite
                    ? 'Campaign added to favorites'
                    : 'Campaign removed from favorites'
            })
        } catch (error) {
            console.error('Error toggling favorite:', error)
            toast({
                title: 'Failed to update favorites',
                description: 'Please try again later'
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={toggleFavorite}
            disabled={isLoading}
        >
            <Heart
                className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
            />
        </Button>
    )
} 