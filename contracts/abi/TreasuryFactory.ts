export const TreasuryFactoryABI = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'globalParams',
        type: 'address',
        internalType: 'contract IGlobalParams',
      },
      {
        name: 'infoFactory',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'bytecodeHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'addBytecodeChunk',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'chunkIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'isLastChunk',
        type: 'bool',
        internalType: 'bool',
      },
      {
        name: 'bytecodeChunk',
        type: 'bytes',
        internalType: 'bytes',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'computeTreasuryAddress',
    inputs: [
      {
        name: 'identifierHash',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [
      {
        name: 'treasuryAddress',
        type: 'address',
        internalType: 'address',
      },
      {
        name: 'isDeployed',
        type: 'bool',
        internalType: 'bool',
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'delistBytecode',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'deploy',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
      {
        name: 'infoAddress',
        type: 'address',
        internalType: 'address',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'enlistBytecode',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'removeBytecode',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        internalType: 'uint256',
      },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'TreasuryFactoryBytecodeChunkAdded',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'bytecodeChunk',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'bytecode',
        type: 'bytes',
        indexed: false,
        internalType: 'bytes',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TreasuryFactoryBytecodeDelisted',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TreasuryFactoryBytecodeEnlisted',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TreasuryFactoryBytecodeRemoved',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'TreasuryFactoryTreasuryDeployed',
    inputs: [
      {
        name: 'platformBytes',
        type: 'bytes32',
        indexed: true,
        internalType: 'bytes32',
      },
      {
        name: 'bytecodeIndex',
        type: 'uint256',
        indexed: true,
        internalType: 'uint256',
      },
      {
        name: 'infoAddress',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'treasuryAddress',
        type: 'address',
        indexed: false,
        internalType: 'address',
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
    name: 'TreasuryFactoryBytecodeAlreadyApproved',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryBytecodeExists',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryBytecodeIncomplete',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryBytecodeIsNotAdded',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryBytecodeNotApproved',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryIncorrectChunkIndex',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryInvalidAddress',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryInvalidKey',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryTreasuryCreationFailed',
    inputs: [],
  },
  {
    type: 'error',
    name: 'TreasuryFactoryUnauthorized',
    inputs: [],
  },
];
