export const CampaignInfoABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'globalParams',
        type: 'address',
        internalType: 'contract IGlobalParams',
      },
      {
        name: 'treasuryFactory',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'token',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'creator',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'protocolFeePercent',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'identifierHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'selectedPlatformBytes',
        type: 'bytes32[]',
        internalType: 'bytes32[]',
      },
      {
        name: 'platformDataKey',
        type: 'bytes32[]',
        internalType: 'bytes32[]',
      },
      {
        name: 'platformDataValue',
        type: 'bytes32[]',
        internalType: 'bytes32[]',
      },
      {
        name: 'campaignData',
        type: 'tuple',
        internalType: 'struct ICampaignData.CampaignData',
        components: [
          {
            name: 'launchTime',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'deadline',
            type: 'uint256',
            internalType: 'uint256',
          },
          {
            name: 'goalAmount',
            type: 'uint256',
            internalType: 'uint256',
          },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: '_pauseCampaign',
    inputs: [
      {
        name: 'message',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: '_setPlatformInfo',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'platformTreasuryAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: '_unpauseCampaign',
    inputs: [
      {
        name: 'message',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkIfPlatformSelected',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getDeadline',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGoalAmount',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getIdentifierHash',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getLaunchTime',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPlatformAdminAddress',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPlatformData',
    inputs: [
      {
        name: 'platformDataKey',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPlatformFeePercent',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProtocolAdminAddress',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getProtocolFeePercent',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTokenAddress',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getTotalRaisedAmount',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [
      {
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'paused',
    inputs: [],
    outputs: [
      {
        name: '',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [
      {
        name: 'newOwner',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateDeadline',
    inputs: [
      {
        name: 'deadline',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateGoalAmount',
    inputs: [
      {
        name: 'goalAmount',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateLaunchTime',
    inputs: [
      {
        name: 'launchTime',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateSelectedPlatform',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'selection',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'CampaignInfoDeadlineUpdated',
    inputs: [
      {
        name: 'newDeadline',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CampaignInfoGoalAmountUpdated',
    inputs: [
      {
        name: 'newGoalAmount',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CampaignInfoLaunchTimeUpdated',
    inputs: [
      {
        name: 'newLaunchTime',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CampaignInfoOwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CampaignInfoPlatformInfoUpdated',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'platformTreasury',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CampaignInfoPlatformSelected',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'platformTreasury',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'CampaignInfoSelectedPlatformUpdated',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'selection',
        type: 'bool',
        indexed: false,
        internalType: 'bool',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Paused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'message',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'Unpaused',
    inputs: [
      {
        name: 'account',
        type: 'address',
        indexed: false,
        internalType: 'address',
      },
      {
        name: 'message',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'AdminAccessCheckerUnauthorized',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CampaignInfoInvalidInput',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CampaignInfoInvalidPlatformUpdate',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'selection',
        type: 'bool',
        internalType: 'bool',
      },
    ],
  },
  {
    type: 'error',
    name: 'CampaignInfoPlatformNotSelected',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
  },
  {
    type: 'error',
    name: 'CampaignInfoUnauthorized',
    inputs: [],
  },
  {
    type: 'error',
    name: 'CurrentTimeIsGreater',
    inputs: [
      {
        name: 'inputTime',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'currentTime',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'CurrentTimeIsLess',
    inputs: [
      {
        name: 'inputTime',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'currentTime',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
  {
    type: 'error',
    name: 'CurrentTimeIsNotWithinRange',
    inputs: [
      {
        name: 'initialTime',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'finalTime',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
  },
];
