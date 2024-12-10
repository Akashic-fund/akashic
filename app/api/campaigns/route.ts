import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { CampaignInfoFactoryABI } from '@/contracts/abi/CampaignInfoFactory'

export async function GET() {
  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http()
    })

    const campaignInfoFactory = process.env.NEXT_PUBLIC_CAMPAIGN_INFO_FACTORY as `0x${string}`

    const logs = await client.getLogs({
      address: campaignInfoFactory,
      event: {
        type: 'event',
        name: 'CampaignInfoFactoryCampaignCreated',
        inputs: [
          { type: 'bytes32', name: 'identifierHash', indexed: true },
          { type: 'address', name: 'campaignInfoAddress', indexed: true },
          { type: 'address', name: 'creator', indexed: true }
        ]
      },
      fromBlock: 0n
    })

    const campaigns = logs.map(log => ({
      identifierHash: log.args.identifierHash,
      campaignInfoAddress: log.args.campaignInfoAddress,
      creator: log.args.creator
    }))

    return Response.json({ campaigns })
  } catch (error) {
    console.error('Error fetching campaigns:', error)
    return Response.json({ error: 'Failed to fetch campaigns' }, { status: 500 })
  }
} 