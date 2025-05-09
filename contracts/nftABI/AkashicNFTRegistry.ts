export const AkashicNFTRegistry = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'factoryAddress',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
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
    ],
    name: 'CampaignNFTRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'string',
        name: 'campaignId',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isActive',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalMinted',
        type: 'uint256',
      },
    ],
    name: 'CampaignNFTUpdated',
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
    inputs: [],
    name: 'factory',
    outputs: [
      {
        internalType: 'contract CampaignNFTFactory',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getActiveCampaigns',
    outputs: [
      {
        components: [
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
            internalType: 'address',
            name: 'nftContract',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'campaignOwner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalMinted',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
        ],
        internalType: 'struct AkashicNFTRegistry.CampaignNFTDetails[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getAllCampaignIds',
    outputs: [
      {
        internalType: 'string[]',
        name: '',
        type: 'string[]',
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
    ],
    name: 'getCampaignNFTDetails',
    outputs: [
      {
        components: [
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
            internalType: 'address',
            name: 'nftContract',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'campaignOwner',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'totalMinted',
            type: 'uint256',
          },
          {
            internalType: 'bool',
            name: 'isActive',
            type: 'bool',
          },
        ],
        internalType: 'struct AkashicNFTRegistry.CampaignNFTDetails',
        name: '',
        type: 'tuple',
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
        internalType: 'address',
        name: 'nftContract',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'campaignOwner',
        type: 'address',
      },
    ],
    name: 'registerCampaignNFT',
    outputs: [],
    stateMutability: 'nonpayable',
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
        name: 'newFactory',
        type: 'address',
      },
    ],
    name: 'setFactory',
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
  {
    inputs: [
      {
        internalType: 'string',
        name: 'campaignId',
        type: 'string',
      },
      {
        internalType: 'bool',
        name: 'isActive',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'totalMinted',
        type: 'uint256',
      },
    ],
    name: 'updateCampaignNFT',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
