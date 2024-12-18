'use client'

import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CampaignInfoFactoryABI } from '@/contracts/abi/CampaignInfoFactory'
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { keccak256, stringToHex } from 'viem'

export function CreateCampaign() {
  const { address } = useAccount()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    fundingGoal: '',
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16)
  })

  const { data: hash, isPending, writeContract } = useWriteContract()
  const [campaignId, setCampaignId] = useState<number | null>(null)

  console.log('Current transaction hash:', hash)

  const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
    hash,
  })

  useEffect(() => {
    const updateCampaign = async () => {
      if (hash && isSuccess && campaignId && receipt) {
        console.log('Processing hash:', hash)
        try {
          console.log('Receipt:', receipt)
          
          // Find the CampaignInfoFactoryCampaignCreated event
          const response = await fetch(`/api/campaigns/${campaignId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              status: 'active',
              transactionHash: hash,
            }),
          })

          if (!response.ok) {
            throw new Error('Failed to update campaign status')
          }
        } catch (error) {
          console.error('Error processing transaction:', error)
          setDbError('Failed to process transaction. Please try again.')
        }
      }
    }

    updateCampaign()
  }, [hash, isSuccess, campaignId, receipt])

  const campaignInfoFactory = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY;

  const [dbError, setDbError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setDbError(null)

    if (!writeContract || !address) {
      console.log('Missing writeContract or address')
      return
    }

    try {
      // First, save to database with pending status
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          fundingGoal: formData.fundingGoal,
          startTime: formData.startTime,
          endTime: formData.endTime,
          creatorAddress: address,
          status: 'pending',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save campaign')
      }

      const { campaignId: newCampaignId } = await response.json()
      setCampaignId(newCampaignId)

      const campaignData = {
        launchTime: BigInt(new Date(formData.startTime ?? '').getTime() / 1000),
        deadline: BigInt(new Date(formData.endTime ?? '').getTime() / 1000),
        goalAmount: parseEther(formData.fundingGoal || '0'),
      }

      // Then proceed with blockchain transaction
      console.log('About to call writeContract...')
      const identifierHash = keccak256(stringToHex("KickStarter"))
      await writeContract({
        address: campaignInfoFactory as `0x${string}`,
        abi: CampaignInfoFactoryABI,
        functionName: 'createCampaign',
        args: [
          address,
          identifierHash,
          [(process.env.NEXT_PUBLIC_PLATFORM_HASH) as `0x${string}`],
          [], // Platform data keys
          [], // Platform data values 
          campaignData
        ]
      })

    } catch (error) {
      console.error('Error:', error)
      setDbError('Failed to create campaign. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Funding Goal (ETH)</label>
        <Input
          type="number"
          step="0.01"
          value={formData.fundingGoal}
          onChange={(e) => setFormData(prev => ({ ...prev, fundingGoal: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Start Time</label>
        <Input
          type="datetime-local"
          value={formData.startTime}
          onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">End Time</label>
        <Input
          type="datetime-local"
          value={formData.endTime}
          onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
          required
        />
      </div>

      <Button
        type="submit"
        disabled={isPending || isConfirming || !writeContract}
        className="w-full"
      >
        {isPending || isConfirming ? 'Creating...' : 'Create Campaign'}
      </Button>

      {dbError && (
        <div className="text-red-600 text-center">
          {dbError}
        </div>
      )}

      {isSuccess && (
        <div className="text-green-600 text-center">
          Campaign created successfully!
        </div>
      )}
    </form>
  )
} 