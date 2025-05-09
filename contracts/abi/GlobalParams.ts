export const GlobalParamsABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'protocolAdminAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'tokenAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'protocolFeePercent',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addPlatformData',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'platformDataKey',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'checkIfPlatformDataKeyValid',
    inputs: [
      {
        name: 'platformDataKey',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'isValid',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'checkIfplatformIsListed',
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
    name: 'delistPlatform',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'enlistPlatform',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'platformAdminAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'platformFeePercent',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getNumberOfListedPlatforms',
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
        name: 'account',
        type: 'address',
        internalType: 'address',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getPlatformDataOwner',
    inputs: [
      {
        name: 'platformDataKey',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [
      {
        name: 'platformBytes',
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
        name: 'platformFeePercent',
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
    name: 'owner',
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
    name: 'removePlatformData',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'platformDataKey',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
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
    name: 'updatePlatformAdminAddress',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'platformAdminAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateProtocolAdminAddress',
    inputs: [
      {
        name: 'protocolAdminAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateProtocolFeePercent',
    inputs: [
      {
        name: 'protocolFeePercent',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'updateTokenAddress',
    inputs: [
      {
        name: 'tokenAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
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
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlatformAdminAddressUpdated',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'newAdminAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlatformDataAdded',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'platformDataKey',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlatformDataRemoved',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'platformDataKey',
        type: 'bytes32',
        indexed: false,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlatformDelisted',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'PlatformEnlisted',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'platformAdminAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'platformFeePercent',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProtocolAdminAddressUpdated',
    inputs: [
      {
        name: 'newAdminAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'ProtocolFeePercentUpdated',
    inputs: [
      {
        name: 'newFeePercent',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TokenAddressUpdated',
    inputs: [
      {
        name: 'newTokenAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
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
    ],
    anonymous: false,
  },
  {
    type: 'error',
    name: 'GlobalParamsInvalidInput',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GlobalParamsPlatformAdminNotSet',
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
    name: 'GlobalParamsPlatformAlreadyListed',
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
    name: 'GlobalParamsPlatformDataAlreadySet',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GlobalParamsPlatformDataNotSet',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GlobalParamsPlatformDataSlotTaken',
    inputs: [],
  },
  {
    type: 'error',
    name: 'GlobalParamsPlatformFeePercentIsZero',
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
    name: 'GlobalParamsPlatformNotListed',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'platformAdminAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
  },
  {
    type: 'error',
    name: 'GlobalParamsUnauthorized',
    inputs: [],
  },
];
