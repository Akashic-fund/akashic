export const CampaignNFTFactory = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'string',
        name: 'campaignId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'nftContract',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'campaignTreasury',
        type: 'address',
      },
    ],
    name: 'CampaignNFTCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    name: 'campaignNFTs',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'campaignId',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'campaignName',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'defaultTokenURI',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'minDonationAmount',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'campaignTreasury',
        type: 'address',
      },
    ],
    name: 'createCampaignNFT',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'campaignId',
        type: 'string',
      },
    ],
    name: 'getCampaignNFT',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
