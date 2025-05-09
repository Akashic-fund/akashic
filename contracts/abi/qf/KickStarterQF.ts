export const KickStarterQFABI = {
  abi: [
    {
      type: 'constructor',
      inputs: [
        { name: '_allo', type: 'address', internalType: 'address' },
        { name: '_strategyName', type: 'string', internalType: 'string' },
        { name: '_directTransfer', type: 'bool', internalType: 'bool' },
      ],
      stateMutability: 'nonpayable',
    },
    { type: 'receive', stateMutability: 'payable' },
    {
      type: 'function',
      name: 'DIRECT_TRANSFER',
      inputs: [],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'REVIEW_EACH_STATUS',
      inputs: [],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'allocate',
      inputs: [
        {
          name: '_recipients',
          type: 'address[]',
          internalType: 'address[]',
        },
        {
          name: '_amounts',
          type: 'uint256[]',
          internalType: 'uint256[]',
        },
        { name: '_data', type: 'bytes', internalType: 'bytes' },
        { name: '_sender', type: 'address', internalType: 'address' },
      ],
      outputs: [],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'allocationEndTime',
      inputs: [],
      outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'allocationStartTime',
      inputs: [],
      outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'allowedTokens',
      inputs: [{ name: '', type: 'address', internalType: 'address' }],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'amountAllocated',
      inputs: [
        { name: '', type: 'address', internalType: 'address' },
        { name: '', type: 'address', internalType: 'address' },
      ],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'claimAllocation',
      inputs: [{ name: '_data', type: 'bytes', internalType: 'bytes' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'distribute',
      inputs: [
        {
          name: '_recipientIds',
          type: 'address[]',
          internalType: 'address[]',
        },
        { name: '_data', type: 'bytes', internalType: 'bytes' },
        { name: '_sender', type: 'address', internalType: 'address' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'getAllo',
      inputs: [],
      outputs: [{ name: '', type: 'address', internalType: 'contract IAllo' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getPoolAmount',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getPoolId',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getRecipient',
      inputs: [
        { name: '_recipientId', type: 'address', internalType: 'address' },
      ],
      outputs: [
        {
          name: '_recipient',
          type: 'tuple',
          internalType: 'struct IRecipientsExtension.Recipient',
          components: [
            {
              name: 'useRegistryAnchor',
              type: 'bool',
              internalType: 'bool',
            },
            {
              name: 'recipientAddress',
              type: 'address',
              internalType: 'address',
            },
            {
              name: 'statusIndex',
              type: 'uint64',
              internalType: 'uint64',
            },
            {
              name: 'metadata',
              type: 'tuple',
              internalType: 'struct Metadata',
              components: [
                {
                  name: 'protocol',
                  type: 'uint256',
                  internalType: 'uint256',
                },
                {
                  name: 'pointer',
                  type: 'string',
                  internalType: 'string',
                },
              ],
            },
          ],
        },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'getStrategyId',
      inputs: [],
      outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'increasePoolAmount',
      inputs: [{ name: '_amount', type: 'uint256', internalType: 'uint256' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'initialize',
      inputs: [
        { name: '__poolId', type: 'uint256', internalType: 'uint256' },
        { name: '_data', type: 'bytes', internalType: 'bytes' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'isUsingAllocationMetadata',
      inputs: [],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'metadataRequired',
      inputs: [],
      outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'payoutSummaries',
      inputs: [{ name: '', type: 'address', internalType: 'address' }],
      outputs: [
        {
          name: 'recipientAddress',
          type: 'address',
          internalType: 'address',
        },
        { name: 'amount', type: 'uint256', internalType: 'uint256' },
      ],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'recipientIndexToRecipientId',
      inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      outputs: [{ name: '', type: 'address', internalType: 'address' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'recipientsCounter',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'register',
      inputs: [
        {
          name: '_recipients',
          type: 'address[]',
          internalType: 'address[]',
        },
        { name: '_data', type: 'bytes', internalType: 'bytes' },
        { name: '_sender', type: 'address', internalType: 'address' },
      ],
      outputs: [
        {
          name: '_recipientIds',
          type: 'address[]',
          internalType: 'address[]',
        },
      ],
      stateMutability: 'payable',
    },
    {
      type: 'function',
      name: 'registrationEndTime',
      inputs: [],
      outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'registrationStartTime',
      inputs: [],
      outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'reviewRecipients',
      inputs: [
        {
          name: '_statuses',
          type: 'tuple[]',
          internalType: 'struct IRecipientsExtension.ApplicationStatus[]',
          components: [
            { name: 'index', type: 'uint256', internalType: 'uint256' },
            {
              name: 'statusRow',
              type: 'uint256',
              internalType: 'uint256',
            },
          ],
        },
        {
          name: '_refRecipientsCounter',
          type: 'uint256',
          internalType: 'uint256',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'setPayout',
      inputs: [{ name: '_data', type: 'bytes', internalType: 'bytes' }],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'statusesBitMap',
      inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'totalPayoutAmount',
      inputs: [],
      outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
      stateMutability: 'view',
    },
    {
      type: 'function',
      name: 'updateAllocationTimestamps',
      inputs: [
        {
          name: '_allocationStartTime',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_allocationEndTime',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'updatePoolTimestamps',
      inputs: [
        {
          name: '_registrationStartTime',
          type: 'uint64',
          internalType: 'uint64',
        },
        {
          name: '_registrationEndTime',
          type: 'uint64',
          internalType: 'uint64',
        },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'withdraw',
      inputs: [
        { name: '_token', type: 'address', internalType: 'address' },
        { name: '_amount', type: 'uint256', internalType: 'uint256' },
        { name: '_recipient', type: 'address', internalType: 'address' },
      ],
      outputs: [],
      stateMutability: 'nonpayable',
    },
    {
      type: 'function',
      name: 'withdrawalCooldown',
      inputs: [],
      outputs: [{ name: '', type: 'uint64', internalType: 'uint64' }],
      stateMutability: 'view',
    },
    {
      type: 'event',
      name: 'Allocated',
      inputs: [
        {
          name: '_recipient',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: '_sender',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: '_amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
        {
          name: '_data',
          type: 'bytes',
          indexed: false,
          internalType: 'bytes',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'AllocationTimestampsUpdated',
      inputs: [
        {
          name: 'allocationStartTime',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64',
        },
        {
          name: 'allocationEndTime',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64',
        },
        {
          name: 'sender',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Claimed',
      inputs: [
        {
          name: 'recipientId',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
        {
          name: 'token',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Distributed',
      inputs: [
        {
          name: '_recipient',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: '_data',
          type: 'bytes',
          indexed: false,
          internalType: 'bytes',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Initialized',
      inputs: [
        {
          name: 'poolId',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
        {
          name: 'data',
          type: 'bytes',
          indexed: false,
          internalType: 'bytes',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'PayoutSet',
      inputs: [
        {
          name: 'recipientId',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'RecipientStatusUpdated',
      inputs: [
        {
          name: 'rowIndex',
          type: 'uint256',
          indexed: true,
          internalType: 'uint256',
        },
        {
          name: 'fullRow',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
        {
          name: 'sender',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Registered',
      inputs: [
        {
          name: '_recipient',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: '_data',
          type: 'bytes',
          indexed: false,
          internalType: 'bytes',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'RegistrationTimestampsUpdated',
      inputs: [
        {
          name: 'registrationStartTime',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64',
        },
        {
          name: 'registrationEndTime',
          type: 'uint64',
          indexed: false,
          internalType: 'uint64',
        },
        {
          name: 'sender',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'UpdatedRegistration',
      inputs: [
        {
          name: 'recipientId',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: 'data',
          type: 'bytes',
          indexed: false,
          internalType: 'bytes',
        },
        {
          name: 'sender',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
        {
          name: 'status',
          type: 'uint8',
          indexed: false,
          internalType: 'uint8',
        },
      ],
      anonymous: false,
    },
    {
      type: 'event',
      name: 'Withdrew',
      inputs: [
        {
          name: '_token',
          type: 'address',
          indexed: true,
          internalType: 'address',
        },
        {
          name: '_amount',
          type: 'uint256',
          indexed: false,
          internalType: 'uint256',
        },
        {
          name: '_recipient',
          type: 'address',
          indexed: false,
          internalType: 'address',
        },
      ],
      anonymous: false,
    },
    { type: 'error', name: 'ALLOCATION_ACTIVE', inputs: [] },
    { type: 'error', name: 'ALLOCATION_NOT_ACTIVE', inputs: [] },
    { type: 'error', name: 'ALLOCATION_NOT_ENDED', inputs: [] },
    { type: 'error', name: 'ALREADY_INITIALIZED', inputs: [] },
    { type: 'error', name: 'ANCHOR_ERROR', inputs: [] },
    { type: 'error', name: 'ARRAY_MISMATCH', inputs: [] },
    {
      type: 'error',
      name: 'AllocationExtension_ALLOCATION_HAS_ALREADY_STARTED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'AllocationExtension_ALLOCATION_HAS_ENDED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'AllocationExtension_ALLOCATION_HAS_NOT_ENDED',
      inputs: [],
    },
    {
      type: 'error',
      name: 'AllocationExtension_ALLOCATION_NOT_ACTIVE',
      inputs: [],
    },
    {
      type: 'error',
      name: 'AllocationExtension_INVALID_ALLOCATION_TIMESTAMPS',
      inputs: [],
    },
    {
      type: 'error',
      name: 'BaseStrategy_AlreadyInitialized',
      inputs: [],
    },
    { type: 'error', name: 'BaseStrategy_InvalidPoolId', inputs: [] },
    { type: 'error', name: 'BaseStrategy_Unauthorized', inputs: [] },
    {
      type: 'error',
      name: 'BaseStrategy_WithdrawMoreThanPoolAmount',
      inputs: [],
    },
    { type: 'error', name: 'ETH_MISMATCH', inputs: [] },
    { type: 'error', name: 'INVALID', inputs: [] },
    { type: 'error', name: 'INVALID_ADDRESS', inputs: [] },
    { type: 'error', name: 'INVALID_FEE', inputs: [] },
    { type: 'error', name: 'INVALID_METADATA', inputs: [] },
    { type: 'error', name: 'INVALID_REGISTRATION', inputs: [] },
    { type: 'error', name: 'INVALID_SIGNATURE_LENGTH', inputs: [] },
    {
      type: 'error',
      name: 'KickstarterQF_NothingToDistribute',
      inputs: [
        { name: 'recipientId', type: 'address', internalType: 'address' },
      ],
    },
    {
      type: 'error',
      name: 'KickstarterQF_PayoutAlreadySet',
      inputs: [
        { name: 'recipientId', type: 'address', internalType: 'address' },
      ],
    },
    {
      type: 'error',
      name: 'KickstarterQF_PayoutsExceedPoolAmount',
      inputs: [],
    },
    { type: 'error', name: 'KickstarterQF_TokenNotAllowed', inputs: [] },
    { type: 'error', name: 'MISMATCH', inputs: [] },
    { type: 'error', name: 'NONCE_NOT_AVAILABLE', inputs: [] },
    { type: 'error', name: 'NON_ZERO_VALUE', inputs: [] },
    { type: 'error', name: 'NOT_ENOUGH_FUNDS', inputs: [] },
    { type: 'error', name: 'NOT_IMPLEMENTED', inputs: [] },
    { type: 'error', name: 'NOT_INITIALIZED', inputs: [] },
    { type: 'error', name: 'NOT_PENDING_OWNER', inputs: [] },
    { type: 'error', name: 'POOL_ACTIVE', inputs: [] },
    { type: 'error', name: 'POOL_INACTIVE', inputs: [] },
    { type: 'error', name: 'RECIPIENT_ALREADY_ACCEPTED', inputs: [] },
    {
      type: 'error',
      name: 'RECIPIENT_ERROR',
      inputs: [
        { name: 'recipientId', type: 'address', internalType: 'address' },
      ],
    },
    { type: 'error', name: 'RECIPIENT_NOT_ACCEPTED', inputs: [] },
    { type: 'error', name: 'REGISTRATION_ACTIVE', inputs: [] },
    { type: 'error', name: 'REGISTRATION_NOT_ACTIVE', inputs: [] },
    {
      type: 'error',
      name: 'RecipientsExtension_InvalidMetada',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RecipientsExtension_RecipientError',
      inputs: [
        { name: 'recipientId', type: 'address', internalType: 'address' },
      ],
    },
    {
      type: 'error',
      name: 'RecipientsExtension_RecipientNotAccepted',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RecipientsExtension_RegistrationHasNotEnded',
      inputs: [],
    },
    {
      type: 'error',
      name: 'RecipientsExtension_RegistrationNotActive',
      inputs: [],
    },
    { type: 'error', name: 'UNAUTHORIZED', inputs: [] },
    { type: 'error', name: 'ZERO_ADDRESS', inputs: [] },
  ],
  bytecode: {
    object:
      '0x610100604052348015610010575f5ffd5b50604051613ccd380380613ccd83398101604081905261002f916100aa565b6001600160a01b0383166080526040515f9084908490610053908290602001610188565b60408051601f19818403018152919052805160209091012060a0525050151560c052151560e052506101bd9050565b634e487b7160e01b5f52604160045260245ffd5b805180151581146100a5575f5ffd5b919050565b5f5f5f606084860312156100bc575f5ffd5b83516001600160a01b03811681146100d2575f5ffd5b60208501519093506001600160401b038111156100ed575f5ffd5b8401601f810186136100fd575f5ffd5b80516001600160401b0381111561011657610116610082565b604051601f8201601f19908116603f011681016001600160401b038111828210171561014457610144610082565b60405281815282820160200188101561015b575f5ffd5b8160208401602083015e5f6020838301015280945050505061017f60408501610096565b90509250925092565b602081525f82518060208401528060208501604085015e5f604082850101526040601f19601f83011684010191505092915050565b60805160a05160c05160e051613aa56102285f395f81816103d601528181610c2f0152818161115a015261122401525f81816104830152610b6a01525f61033c01525f818161023d015281816106e30152818161095001528181610dcc01526126300152613aa55ff3fe6080604052600436106101de575f3560e01c806399c64931116100fd578063e744092e11610092578063f5b0dfb711610062578063f5b0dfb71461064f578063f6f258911461066e578063f7f7bbf814610699578063facfe313146106b8575f5ffd5b8063e744092e146105ce578063e7efcfc2146105fc578063edd146cc14610611578063f31db3d114610630575f5ffd5b8063d2e17f59116100cd578063d2e17f591461054a578063d565f5fb14610569578063d6c89c6014610589578063dff7d2c7146105a8575f5ffd5b806399c64931146104ba5780639af5c09d146104ee578063ac72a6ba14610512578063cb0e85a614610531575f5ffd5b80634ab4ba421161017357806369328dec1161014357806369328dec1461043457806375777aaa146104535780637a933ab61461047257806395355b3b146104a5575f5ffd5b80634ab4ba421461039e5780635fdfa0e0146103b25780636035b952146103c557806362812a3914610408575f5ffd5b8063385d7aec116101ae578063385d7aec146102be57806338fff2d01461031b57806342fda9c71461032e5780634533d67814610360575f5ffd5b806303386205146101f15780630a6f0ee91461021057806315cc481e1461022f578063281bfc391461027a575f5ffd5b366101ed576101eb6106d8565b005b5f5ffd5b3480156101fc575f5ffd5b506101eb61020b366004612aeb565b610723565b34801561021b575f5ffd5b506101eb61022a366004612bd0565b6108d9565b34801561023a575f5ffd5b507f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b0390911681526020015b60405180910390f35b348015610285575f5ffd5b506102b0610294366004612c46565b600c60209081525f928352604080842090915290825290205481565b604051908152602001610271565b3480156102c9575f5ffd5b506102fc6102d8366004612c7d565b600b6020525f9081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b039093168352602083019190915201610271565b348015610326575f5ffd5b505f546102b0565b348015610339575f5ffd5b507f00000000000000000000000000000000000000000000000000000000000000006102b0565b34801561036b575f5ffd5b5060075461038690600160401b90046001600160401b031681565b6040516001600160401b039091168152602001610271565b3480156103a9575f5ffd5b506001546102b0565b6101eb6103c0366004612c98565b6108f1565b3480156103d0575f5ffd5b506103f87f000000000000000000000000000000000000000000000000000000000000000081565b6040519015158152602001610271565b348015610413575f5ffd5b50610427610422366004612c7d565b61090b565b6040516102719190612db9565b34801561043f575f5ffd5b506101eb61044e366004612e19565b610922565b34801561045e575f5ffd5b506101eb61046d366004612e61565b610a7e565b34801561047d575f5ffd5b506103f87f000000000000000000000000000000000000000000000000000000000000000081565b3480156104b0575f5ffd5b506102b060035481565b3480156104c5575f5ffd5b5061025d6104d4366004612e8d565b60056020525f90815260409020546001600160a01b031681565b3480156104f9575f5ffd5b506002546103869061010090046001600160401b031681565b34801561051d575f5ffd5b506101eb61052c366004612e61565b610a92565b34801561053c575f5ffd5b506002546103f89060ff1681565b348015610555575f5ffd5b50600754610386906001600160401b031681565b348015610574575f5ffd5b506007546103f890600160801b900460ff1681565b348015610594575f5ffd5b50600954610386906001600160401b031681565b3480156105b3575f5ffd5b5060025461038690600160481b90046001600160401b031681565b3480156105d9575f5ffd5b506103f86105e8366004612c7d565b60086020525f908152604090205460ff1681565b348015610607575f5ffd5b506102b0600a5481565b34801561061c575f5ffd5b506101eb61062b366004612ea4565b610aa6565b34801561063b575f5ffd5b506101eb61064a366004612ee7565b610af6565b34801561065a575f5ffd5b506101eb610669366004612e8d565b610bf3565b348015610679575f5ffd5b506102b0610688366004612e8d565b60046020525f908152604090205481565b3480156106a4575f5ffd5b506101eb6106b3366004612aeb565b610c25565b6106cb6106c6366004612bd0565b610d84565b6040516102719190612f5a565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461072157604051634dc59d4360e01b815260040160405180910390fd5b565b3361072d81610da3565b610735610e52565b5f5f8380602001905181019061074b9190613014565b915091505f5f5b8351811015610896575f84828151811061076e5761076e6130d0565b6020026020010151905061078181610e84565b61079e576040516328a9502360e11b815260040160405180910390fd5b6001600160a01b0381165f908152600b602052604090206001810154156107e857604051633fc206d160e11b81526001600160a01b03831660048201526024015b60405180910390fd5b5f8584815181106107fb576107fb6130d0565b60200260200101519050808561081191906130f8565b600183018290556001600160a01b038085165f81815260066020526040908190205486546001600160a01b0319166101009091049093169290921785559051919650907f03538f7b2dd2a11ad559447b61338d4a002f3719c20ce5c499fa348076b19565906108839084815260200190565b60405180910390a2505050600101610752565b5080600a5f8282546108a891906130f8565b9091555050600154600a5411156108d257604051639c25fe8760e01b815260040160405180910390fd5b5050505050565b6108e16106d8565b6108ec838383610ea8565b505050565b6108f96106d8565b6109058484848461105b565b50505050565b61091361294f565b61091c826114ca565b92915050565b3361092c81610da3565b6109378484846115d8565b5f5460405163068bcd8d60e01b815260048101919091527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063068bcd8d906024015f60405180830381865afa15801561099c573d5f5f3e3d5ffd5b505050506040513d5f823e601f3d908101601f191682016040526109c391908101906131a9565b604001516001600160a01b0316846001600160a01b031603610a1f57600154836109f66001600160a01b03871630611623565b610a009190613259565b1015610a1f5760405163a196582960e01b815260040160405180910390fd5b610a336001600160a01b03851683856116c2565b604080518481526001600160a01b0384811660208301528616917fff79f55e9fae054ff094d9e06f631119716d818f9f8ea9b5b2adf5679f6c12e0910160405180910390a250505050565b33610a8881610da3565b6108ec838361170e565b33610a9c81610da3565b6108ec83836117b1565b610aaf8261185a565b610ab982826118a6565b7f91efa3d50feccde0d0d202f8ae5c41ca0b2be614cebcb2bd2f4b019396e6568a8282604051610aea92919061326c565b60405180910390a15050565b610aff3361190a565b6003548114610b2157604051637fcce2a960e01b815260040160405180910390fd5b5f5b82811015610905575f848483818110610b3e57610b3e6130d0565b9050604002015f013590505f858584818110610b5c57610b5c6130d0565b9050604002016020013590507f000000000000000000000000000000000000000000000000000000000000000015610b9b57610b98828261191b565b90505b5f828152600460209081526040918290208390558151838152339181019190915283917f941884a9a55191a7401466aaf8a0d2b7c8b082055a5a2b345b83c73940172ac4910160405180910390a25050600101610b23565b610bfb6106d8565b610c0481611a16565b8060015f828254610c1591906130f8565b90915550610c2290508181565b50565b610c2d610e52565b7f000000000000000000000000000000000000000000000000000000000000000015610c6c576040516343f6e4ab60e01b815260040160405180910390fd5b5f81806020019051810190610c819190613284565b80519091505f5b81811015610905575f838281518110610ca357610ca36130d0565b60209081029190910181015180516001600160a01b039081165f908152600c80855260408083208587018051861685529087528184205486518616855260068852828520548751871686529388528285208251871686529097529083209290925590519294506101009004811691610d1d911682846116c2565b825f01516001600160a01b03167f7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e838560200151604051610d719291909182526001600160a01b0316602082015260400190565b60405180910390a2505050600101610c88565b6060610d8e6106d8565b610d99848484611a49565b90505b9392505050565b5f546040516329e40d4b60e01b815260048101919091526001600160a01b0382811660248301527f000000000000000000000000000000000000000000000000000000000000000016906329e40d4b90604401602060405180830381865afa158015610e11573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e35919061335e565b610c2257604051634dc59d4360e01b815260040160405180910390fd5b600754600160401b90046001600160401b0316421161072157604051637b3aa4c760e01b815260040160405180910390fd5b5f6002610e9083611dbb565b6006811115610ea157610ea1613377565b1492915050565b610eb0610e52565b5f5b8351811015610905575f848281518110610ece57610ece6130d0565b6020908102919091018101516001600160a01b038082165f818152600b808652604080832081518083019092528054958616808352600182018054848b01819052968652939098526001600160a01b031990951690945581905592945090929091829003610f5a57604051636d3e267760e11b81526001600160a01b03851660048201526024016107df565b6001600160a01b038116610fc85760405162461bcd60e51b815260206004820152602f60248201527f4b69636b7374617274657251463a20526563697069656e74207061796f75742060448201526e1859191c995cdcc81b9bdd081cd95d608a1b60648201526084016107df565b8160015f828254610fd99190613259565b9091555050604080516001600160a01b0383811660208301529181018490528782166060820152908516907fa72470a03bbc439585e6200fa2dee59c80671137f9f953dc75acfd08b7c37ad59060800160408051601f19818403018152908290526110439161338b565b60405180910390a2505060019092019150610eb29050565b611063611dd9565b5f5f83806020019051810190611079919061341b565b915091505f5f5b87518110156114a0576110ab88828151811061109e5761109e6130d0565b6020026020010151610e84565b6110c8576040516328a9502360e11b815260040160405180910390fd5b60085f8583815181106110dd576110dd6130d0565b6020908102919091018101516001600160a01b031682528101919091526040015f205460ff1615801561113a57505f805260086020527f5eff886ea0ce6ca488a3d6e336d6c0f75f46d19b42c06ce5ee98e42c96d256c75460ff16155b15611158576040516310182db560e11b815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006112215786818151811061118f5761118f6130d0565b6020026020010151600c5f8a84815181106111ac576111ac6130d0565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020015f205f8684815181106111e6576111e66130d0565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020015f205f82825461121b91906130f8565b90915550505b5f7f000000000000000000000000000000000000000000000000000000000000000061124d57306112a0565b60065f8a8481518110611262576112626130d0565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020015f205f0160019054906101000a90046001600160a01b03165b905073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee6001600160a01b03168583815181106112d2576112d26130d0565b60200260200101516001600160a01b031603611314578782815181106112fa576112fa6130d0565b60200260200101518361130d91906130f8565b9250611381565b61138186828a858151811061132b5761132b6130d0565b6020026020010151878681518110611345576113456130d0565b602002602001015189878151811061135f5761135f6130d0565b60200260200101516001600160a01b0316611e3890949392919063ffffffff16565b6113d386828a8581518110611398576113986130d0565b60200260200101518886815181106113b2576113b26130d0565b60200260200101516001600160a01b031661212c909392919063ffffffff16565b856001600160a01b03168983815181106113ef576113ef6130d0565b60200260200101516001600160a01b03167f7cf390a26cc6009692dd8cb8a7e6f1c70b4f19d8f8802358fd606bad67efebd48a8581518110611433576114336130d0565b602002602001015188868151811061144d5761144d6130d0565b602002602001015160405160200161147491906001600160a01b0391909116815260200190565b60408051601f198184030181529082905261148f929161326c565b60405180910390a350600101611080565b508034146114c157604051631badfb6f60e31b815260040160405180910390fd5b50505050505050565b6114d261294f565b6001600160a01b038281165f908152600660209081526040918290208251608081018452815460ff811615158252610100810490951681840152600160a81b9094046001600160401b03168484015282518084019093526001810180548452600282018054929460608701949093908401919061154e90613474565b80601f016020809104026020016040519081016040528092919081815260200182805461157a90613474565b80156115c55780601f1061159c576101008083540402835291602001916115c5565b820191905f5260205f20905b8154815290600101906020018083116115a857829003601f168201915b5050509190925250505090525092915050565b6009546007546115fb916001600160401b0390811691600160401b9004166134ac565b6001600160401b031642116108ec57604051637fcce2a960e01b815260040160405180910390fd5b5f73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b0384160161165a57506001600160a01b0381163161091c565b6040516370a0823160e01b81526001600160a01b0383811660048301528416906370a0823190602401602060405180830381865afa15801561169e573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610d9c91906134cb565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b038416016116fa576108ec6001600160a01b0383168261218e565b6108ec6001600160a01b03841683836121ab565b611718828261220e565b6002805470ffffffffffffffffffffffffffffffff0019166101006001600160401b03858116820270ffffffffffffffff000000000000000000191692909217600160481b8584168102919091179384905560408051928504841683529304909116602082015233918101919091527ff8303af1d06b82233c0a25f4bd0da1a9e457fea4d0b455bd6beb9860a67445e990606001610aea565b806001600160401b0316826001600160401b031611156117e45760405163737ff00560e11b815260040160405180910390fd5b600780546001600160401b038481166fffffffffffffffffffffffffffffffff199092168217600160401b9185169182021790925560408051918252602082019290925233918101919091527ffb1cbc66ebe2174a0f3d546d035b9f4b900ea51c97b5200180571af31bb4213190606001610aea565b6118626106d8565b5f54156118825760405163d9212fe160e01b815260040160405180910390fd5b805f036118a257604051630576c36560e11b815260040160405180910390fd5b5f55565b5f5f5f5f5f5f868060200190518101906118c091906134ed565b6009805467ffffffffffffffff19166001600160401b038516179055949a509298509096509450925090506118f486612241565b61190082868684612270565b5050505050505050565b61191261232f565b610c2281610da3565b5f82815260046020526040812054815b6040811015611a0d57600281901b5f600f86831c16600681111561195157611951613377565b90505f600f85841c16600681111561196b5761196b613377565b905080600681111561197f5761197f613377565b82600681111561199157611991613377565b146119ff575f6119a58560068b901b6130f8565b6119b09060016130f8565b9050828060068111156119c5576119c5613377565b8160068111156119d7576119d7613377565b146119fc57600f851b198916858260068111156119f6576119f6613377565b901b1798505b50505b50505080600101905061192b565b50919392505050565b600754600160401b90046001600160401b0316421115610c22576040516353b0201960e01b815260040160405180910390fd5b6060611a5361232f565b5f83806020019051810190611a6891906135b6565b905084516001600160401b03811115611a8357611a836129a1565b604051908082528060200260200182016040528015611aac578160200160208202803683370190505b5091505f5b8551811015611db2575f868281518110611acd57611acd6130d0565b602002602001015190505f838381518110611aea57611aea6130d0565b602002602001015190505f5f5f5f611b02858b612354565b93509350935093506001600160a01b038616611b3c576040516329508e6f60e01b81526001600160a01b03851660048201526024016107df565b60025460ff168015611b5a57506020820151511580611b5a57508151155b15611b7857604051635a4388dd60e11b815260040160405180910390fd5b6001600160a01b038085165f908152600660209081526040909120805492891661010002610100600160a81b0319909316929092178255835160018301908155908401518491906002840190611bce908261362b565b5050815460ff191685151517808355600160a81b90046001600160401b03165f039050611cd85760038054825467ffffffffffffffff60a81b1916600160a81b6001600160401b0390921691909102178255545f90815260056020526040902080546001600160a01b0319166001600160a01b038716179055611c568560015b60ff166123e0565b5f86600354604051602001611c6c9291906136e5565b6040516020818303038152906040529050856001600160a01b03167fb5ca2dfb0bd25603299b76fefa9fbe3abdc9f951bdfb7ffd208f93ab7f8e203c82604051611cb6919061338b565b60405180910390a260038054905f611ccd83613706565b919050555050611d74565b5f611ce286612410565b905060ff811660021480611cf9575060ff81166005145b15611d0e57611d09866001611c4e565b611d25565b60021960ff821601611d2557611d25866004611c4e565b856001600160a01b03167fcec1da3f7f0b8a344dd1025d06e2ddd48b14880395997ad97cbdb439acc761d4888e611d5b8a612410565b604051611d6a9392919061371e565b60405180910390a2505b848a8981518110611d8757611d876130d0565b6001600160a01b0390921660209283029190910190910152505060019095019450611ab19350505050565b50509392505050565b5f611dc582612410565b60ff16600681111561091c5761091c613377565b6007546001600160401b0316421015611e0557604051631563981560e11b815260040160405180910390fd5b600754600160401b90046001600160401b031642111561072157604051631563981560e11b815260040160405180910390fd5b8051156108d257604051636eb1769f60e11b81526001600160a01b038581166004830152848116602483015283919087169063dd62ed3e90604401602060405180830381865afa158015611e8e573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611eb291906134cb565b10156108d2575f5f82806020019051810190611ece9190613753565b90925090506003826003811115611ee757611ee7613377565b03611f965780516040805160a0810182526001600160a01b038a81166060808401918252608084018a9052908352602080870151818501528487015184860152845180860186528b841681529081018a905290860151935163187945bd60e11b815291909416936330f28b7a93611f6493928c91906004016137fd565b5f604051808303815f87803b158015611f7b575f5ffd5b505af1158015611f8d573d5f5f3e3d5ffd5b505050506114c1565b6001826003811115611faa57611faa613377565b03612058575f5f5f611fbf846060015161245e565b604080880151905163d505accf60e01b81526001600160a01b038e811660048301528d81166024830152604482018d9052606482019290925260ff8316608482015260a4810185905260c4810184905293965091945092508b169063d505accf9060e4015f604051808303815f87803b15801561203a575f5ffd5b505af115801561204c573d5f5f3e3d5ffd5b505050505050506114c1565b600282600381111561206c5761206c613377565b036114c1575f5f5f612081846060015161245e565b602087015160408089015190516323f2ebc360e21b81526001600160a01b038f811660048301528e81166024830152604482019390935260648101919091526001608482015260ff831660a482015260c4810185905260e4810184905293965091945092508b1690638fcbaf0c90610104015f604051808303815f87803b15801561210a575f5ffd5b505af115801561211c573d5f5f3e3d5ffd5b5050505050505050505050505050565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b03851601612179576001600160a01b0382163014612174576121746001600160a01b0383168261218e565b610905565b6109056001600160a01b0385168484846124dc565b5f5f5f5f84865af16121a75763b12d13eb5f526004601cfd5b5050565b6040516001600160a01b0383166024820152604481018290526108ec90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612514565b806001600160401b0316826001600160401b031611156121a757604051637fcce2a960e01b815260040160405180910390fd5b80516002805460ff191691151591909117905560208101516040820151612268919061170e565b506001600355565b83515f036122b1575f805260086020527f5eff886ea0ce6ca488a3d6e336d6c0f75f46d19b42c06ce5ee98e42c96d256c7805460ff1916600117905561230e565b5f5b845181101561230c57600160085f8784815181106122d3576122d36130d0565b6020908102919091018101516001600160a01b031682528101919091526040015f20805460ff19169115159190911790556001016122b3565b505b6007805460ff60801b1916600160801b8315150217905561090583836117b1565b6123376125e7565b6107215760405163e305e1ad60e01b815260040160405180910390fd5b5f5f61237260405180604001604052805f8152602001606081525090565b60605f868060200190518101906123899190613876565b909450925090506001600160a01b038116156123d2576123a9818761262c565b6123c65760405163075fd2b160e01b815260040160405180910390fd5b600193508094506123d6565b8594505b5092959194509250565b5f5f5f6123ec856127a8565b5f9283526004602052604090922095811b600f90911b199091161790935550505050565b6001600160a01b0381165f90815260066020526040812054600160a81b90046001600160401b0316810361244557505f919050565b5f5f612450846127a8565b600f911c1695945050505050565b5f5f5f8351604103612483575050506020810151604082015160608301515f1a6124d5565b83516040036124bc57602084015160408501519093506001600160ff1b03811692506124b460ff82901c601b6138eb565b9150506124d5565b604051636e855a4160e01b815260040160405180910390fd5b9193909250565b6040516001600160a01b03808516602483015283166044820152606481018290526109059085906323b872dd60e01b906084016121d7565b5f612568826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166128309092919063ffffffff16565b905080515f1480612588575080806020019051810190612588919061335e565b6108ec5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016107df565b6002545f90426101009091046001600160401b03161180159061261c5750600254600160481b90046001600160401b03164211155b156126275750600190565b505f90565b5f5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635ab1bd536040518163ffffffff1660e01b8152600401602060405180830381865afa15801561268a573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906126ae9190613904565b60405163dd93da4360e01b81526001600160a01b0386811660048301529192505f9183169063dd93da43906024015f60405180830381865afa1580156126f6573d5f5f3e3d5ffd5b505050506040513d5f823e601f3d908101601f1916820160405261271d919081019061391f565b8051604051635e8a791560e01b81529192506001600160a01b03841691635e8a7915916127609188906004019182526001600160a01b0316602082015260400190565b602060405180830381865afa15801561277b573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061279f919061335e565b95945050505050565b6001600160a01b0381165f908152600660205260408120548190819081906127e290600190600160a81b90046001600160401b03166139e9565b6001600160401b031690505f6127f9604083613a1c565b90505f612807604084613a2f565b612812906004613a42565b5f838152600460205260409020549298909750919550909350505050565b6060610d9984845f85855f5f866001600160a01b031685876040516128559190613a59565b5f6040518083038185875af1925050503d805f811461288f576040519150601f19603f3d011682016040523d82523d5f602084013e612894565b606091505b50915091506128a5878383876128b2565b925050505b949350505050565b606083156129205782515f03612919576001600160a01b0385163b6129195760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016107df565b50816128aa565b6128aa83838151156129355781518083602001fd5b8060405162461bcd60e51b81526004016107df919061338b565b60405180608001604052805f151581526020015f6001600160a01b031681526020015f6001600160401b0316815260200161299c60405180604001604052805f8152602001606081525090565b905290565b634e487b7160e01b5f52604160045260245ffd5b604080519081016001600160401b03811182821017156129d7576129d76129a1565b60405290565b60405160c081016001600160401b03811182821017156129d7576129d76129a1565b604051606081016001600160401b03811182821017156129d7576129d76129a1565b604051608081016001600160401b03811182821017156129d7576129d76129a1565b604051601f8201601f191681016001600160401b0381118282101715612a6b57612a6b6129a1565b604052919050565b5f6001600160401b03821115612a8b57612a8b6129a1565b50601f01601f191660200190565b5f82601f830112612aa8575f5ffd5b8135612abb612ab682612a73565b612a43565b818152846020838601011115612acf575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215612afb575f5ffd5b81356001600160401b03811115612b10575f5ffd5b6128aa84828501612a99565b5f6001600160401b03821115612b3457612b346129a1565b5060051b60200190565b6001600160a01b0381168114610c22575f5ffd5b8035612b5d81612b3e565b919050565b5f82601f830112612b71575f5ffd5b8135612b7f612ab682612b1c565b8082825260208201915060208360051b860101925085831115612ba0575f5ffd5b602085015b83811015612bc6578035612bb881612b3e565b835260209283019201612ba5565b5095945050505050565b5f5f5f60608486031215612be2575f5ffd5b83356001600160401b03811115612bf7575f5ffd5b612c0386828701612b62565b93505060208401356001600160401b03811115612c1e575f5ffd5b612c2a86828701612a99565b9250506040840135612c3b81612b3e565b809150509250925092565b5f5f60408385031215612c57575f5ffd5b8235612c6281612b3e565b91506020830135612c7281612b3e565b809150509250929050565b5f60208284031215612c8d575f5ffd5b8135610d9c81612b3e565b5f5f5f5f60808587031215612cab575f5ffd5b84356001600160401b03811115612cc0575f5ffd5b612ccc87828801612b62565b94505060208501356001600160401b03811115612ce7575f5ffd5b8501601f81018713612cf7575f5ffd5b8035612d05612ab682612b1c565b8082825260208201915060208360051b850101925089831115612d26575f5ffd5b6020840193505b82841015612d48578335825260209384019390910190612d2d565b955050505060408501356001600160401b03811115612d65575f5ffd5b612d7187828801612a99565b925050612d8060608601612b52565b905092959194509250565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b6020815281511515602082015260018060a01b0360208301511660408201526001600160401b0360408301511660608201525f6060830151608080840152805160a084015260208101519050604060c08401526128aa60e0840182612d8b565b5f5f5f60608486031215612e2b575f5ffd5b8335612e3681612b3e565b9250602084013591506040840135612c3b81612b3e565b6001600160401b0381168114610c22575f5ffd5b5f5f60408385031215612e72575f5ffd5b8235612e7d81612e4d565b91506020830135612c7281612e4d565b5f60208284031215612e9d575f5ffd5b5035919050565b5f5f60408385031215612eb5575f5ffd5b8235915060208301356001600160401b03811115612ed1575f5ffd5b612edd85828601612a99565b9150509250929050565b5f5f5f60408486031215612ef9575f5ffd5b83356001600160401b03811115612f0e575f5ffd5b8401601f81018613612f1e575f5ffd5b80356001600160401b03811115612f33575f5ffd5b8660208260061b8401011115612f47575f5ffd5b6020918201979096509401359392505050565b602080825282518282018190525f918401906040840190835b81811015612f9a5783516001600160a01b0316835260209384019390920191600101612f73565b509095945050505050565b8051612b5d81612b3e565b5f82601f830112612fbf575f5ffd5b8151612fcd612ab682612b1c565b8082825260208201915060208360051b860101925085831115612fee575f5ffd5b602085015b83811015612bc657805161300681612b3e565b835260209283019201612ff3565b5f5f60408385031215613025575f5ffd5b82516001600160401b0381111561303a575f5ffd5b61304685828601612fb0565b92505060208301516001600160401b03811115613061575f5ffd5b8301601f81018513613071575f5ffd5b805161307f612ab682612b1c565b8082825260208201915060208360051b8501019250878311156130a0575f5ffd5b6020840193505b828410156130c25783518252602093840193909101906130a7565b809450505050509250929050565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b8082018082111561091c5761091c6130e4565b5f82601f83011261311a575f5ffd5b8151602083015f61312d612ab684612a73565b9050828152858383011115613140575f5ffd5b8282602083015e5f92810160200192909252509392505050565b5f6040828403121561316a575f5ffd5b6131726129b5565b8251815260208301519091506001600160401b03811115613191575f5ffd5b61319d8482850161310b565b60208301525092915050565b5f602082840312156131b9575f5ffd5b81516001600160401b038111156131ce575f5ffd5b820160c081850312156131df575f5ffd5b6131e76129dd565b8151815260208201516131f981612b3e565b6020820152604082015161320c81612b3e565b604082015260608201516001600160401b03811115613229575f5ffd5b6132358682850161315a565b6060830152506080828101519082015260a091820151918101919091529392505050565b8181038181111561091c5761091c6130e4565b828152604060208201525f610d996040830184612d8b565b5f60208284031215613294575f5ffd5b81516001600160401b038111156132a9575f5ffd5b8201601f810184136132b9575f5ffd5b80516132c7612ab682612b1c565b8082825260208201915060208360061b8501019250868311156132e8575f5ffd5b6020840193505b828410156133455760408488031215613306575f5ffd5b61330e6129b5565b845161331981612b3e565b8152602085015161332981612b3e565b80602083015250808352506020820191506040840193506132ef565b9695505050505050565b80518015158114612b5d575f5ffd5b5f6020828403121561336e575f5ffd5b610d9c8261334f565b634e487b7160e01b5f52602160045260245ffd5b602081525f610d9c6020830184612d8b565b5f82601f8301126133ac575f5ffd5b81516133ba612ab682612b1c565b8082825260208201915060208360051b8601019250858311156133db575f5ffd5b602085015b83811015612bc65780516001600160401b038111156133fd575f5ffd5b61340c886020838a010161310b565b845250602092830192016133e0565b5f5f6040838503121561342c575f5ffd5b82516001600160401b03811115613441575f5ffd5b61344d85828601612fb0565b92505060208301516001600160401b03811115613468575f5ffd5b612edd8582860161339d565b600181811c9082168061348857607f821691505b6020821081036134a657634e487b7160e01b5f52602260045260245ffd5b50919050565b6001600160401b03818116838216019081111561091c5761091c6130e4565b5f602082840312156134db575f5ffd5b5051919050565b8051612b5d81612e4d565b5f5f5f5f5f5f868803610100811215613504575f5ffd5b6060811215613511575f5ffd5b5061351a6129ff565b6135238861334f565b8152602088015161353381612e4d565b6020820152604088015161354681612e4d565b60408201529550613559606088016134e2565b9450613567608088016134e2565b935061357560a088016134e2565b925060c08701516001600160401b0381111561358f575f5ffd5b61359b89828a01612fb0565b9250506135aa60e0880161334f565b90509295509295509295565b5f602082840312156135c6575f5ffd5b81516001600160401b038111156135db575f5ffd5b6128aa8482850161339d565b601f8211156108ec57805f5260205f20601f840160051c8101602085101561360c5750805b601f840160051c820191505b818110156108d2575f8155600101613618565b81516001600160401b03811115613644576136446129a1565b613658816136528454613474565b846135e7565b6020601f82116001811461368a575f83156136735750848201515b5f19600385901b1c1916600184901b1784556108d2565b5f84815260208120601f198516915b828110156136b95787850151825560209485019460019092019101613699565b50848210156136d657868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b604081525f6136f76040830185612d8b565b90508260208301529392505050565b5f60018201613717576137176130e4565b5060010190565b606081525f6137306060830186612d8b565b6001600160a01b039490941660208301525060ff91909116604090910152919050565b5f5f60408385031215613764575f5ffd5b825160048110613772575f5ffd5b60208401519092506001600160401b0381111561378d575f5ffd5b83016080818603121561379e575f5ffd5b6137a6612a21565b81516137b181612b3e565b8152602082810151908201526040808301519082015260608201516001600160401b038111156137df575f5ffd5b6137eb8782850161310b565b60608301525080925050509250929050565b61381b81865180516001600160a01b03168252602090810151910152565b602085015160408201526040850151606082015261384f608082018580516001600160a01b03168252602090810151910152565b6001600160a01b03831660c082015261010060e082018190525f9061334590830184612d8b565b5f5f5f60608486031215613888575f5ffd5b835161389381612b3e565b60208501519093506001600160401b038111156138ae575f5ffd5b6138ba8682870161315a565b92505060408401516001600160401b038111156138d5575f5ffd5b6138e18682870161310b565b9150509250925092565b60ff818116838216019081111561091c5761091c6130e4565b5f60208284031215613914575f5ffd5b8151610d9c81612b3e565b5f6020828403121561392f575f5ffd5b81516001600160401b03811115613944575f5ffd5b820160c08185031215613955575f5ffd5b61395d6129dd565b815181526020808301519082015260408201516001600160401b03811115613983575f5ffd5b61398f8682850161310b565b60408301525060608201516001600160401b038111156139ad575f5ffd5b6139b98682850161315a565b6060830152506139cb60808301612fa5565b60808201526139dc60a08301612fa5565b60a0820152949350505050565b6001600160401b03828116828216039081111561091c5761091c6130e4565b634e487b7160e01b5f52601260045260245ffd5b5f82613a2a57613a2a613a08565b500490565b5f82613a3d57613a3d613a08565b500690565b808202811582820484141761091c5761091c6130e4565b5f82518060208501845e5f92019182525091905056fea2646970667358221220ff4837a326cefd0b465acdb3982b480c470651930aa213800f093c2086048bb964736f6c634300081c0033',
    sourceMap:
      '553:13113:101:-:0;;;4004:210;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;-1:-1:-1;;;;;1307:20:9;;;;1362:25;;4110:5:101;;4138;;4145:13;;1362:25:9;;4145:13:101;;1362:25:9;;;:::i;:::-;;;;-1:-1:-1;;1362:25:9;;;;;;;;;1352:36;;1362:25;1352:36;;;;1337:51;;-1:-1:-1;;2541:38:14;;;;4174:33:101::2;;;::::0;-1:-1:-1;553:13113:101;;-1:-1:-1;553:13113:101;14:127:106;75:10;70:3;66:20;63:1;56:31;106:4;103:1;96:15;130:4;127:1;120:15;146:164;222:13;;271;;264:21;254:32;;244:60;;300:1;297;290:12;244:60;146:164;;;:::o;315:1181::-;410:6;418;426;479:2;467:9;458:7;454:23;450:32;447:52;;;495:1;492;485:12;447:52;521:16;;-1:-1:-1;;;;;566:31:106;;556:42;;546:70;;612:1;609;602:12;546:70;684:2;669:18;;663:25;635:5;;-1:-1:-1;;;;;;700:30:106;;697:50;;;743:1;740;733:12;697:50;766:22;;819:4;811:13;;807:27;-1:-1:-1;797:55:106;;848:1;845;838:12;797:55;875:9;;-1:-1:-1;;;;;896:30:106;;893:56;;;929:18;;:::i;:::-;978:2;972:9;1070:2;1032:17;;-1:-1:-1;;1028:31:106;;;1061:2;1024:40;1020:54;1008:67;;-1:-1:-1;;;;;1090:34:106;;1126:22;;;1087:62;1084:88;;;1152:18;;:::i;:::-;1188:2;1181:22;1212;;;1253:15;;;1270:2;1249:24;1246:37;-1:-1:-1;1243:57:106;;;1296:1;1293;1286:12;1243:57;1345:6;1340:2;1336;1332:11;1327:2;1319:6;1315:15;1309:43;1398:1;1393:2;1384:6;1376;1372:19;1368:28;1361:39;1419:6;1409:16;;;;;1444:46;1486:2;1475:9;1471:18;1444:46;:::i;:::-;1434:56;;315:1181;;;;;:::o;1501:418::-;1650:2;1639:9;1632:21;1613:4;1682:6;1676:13;1725:6;1720:2;1709:9;1705:18;1698:34;1784:6;1779:2;1771:6;1767:15;1762:2;1751:9;1747:18;1741:50;1840:1;1835:2;1826:6;1815:9;1811:22;1807:31;1800:42;1910:2;1903;1899:7;1894:2;1886:6;1882:15;1878:29;1867:9;1863:45;1859:54;1851:62;;;1501:418;;;;:::o;:::-;553:13113:101;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;',
    linkReferences: {},
  },
  deployedBytecode: {
    object:
      '0x6080604052600436106101de575f3560e01c806399c64931116100fd578063e744092e11610092578063f5b0dfb711610062578063f5b0dfb71461064f578063f6f258911461066e578063f7f7bbf814610699578063facfe313146106b8575f5ffd5b8063e744092e146105ce578063e7efcfc2146105fc578063edd146cc14610611578063f31db3d114610630575f5ffd5b8063d2e17f59116100cd578063d2e17f591461054a578063d565f5fb14610569578063d6c89c6014610589578063dff7d2c7146105a8575f5ffd5b806399c64931146104ba5780639af5c09d146104ee578063ac72a6ba14610512578063cb0e85a614610531575f5ffd5b80634ab4ba421161017357806369328dec1161014357806369328dec1461043457806375777aaa146104535780637a933ab61461047257806395355b3b146104a5575f5ffd5b80634ab4ba421461039e5780635fdfa0e0146103b25780636035b952146103c557806362812a3914610408575f5ffd5b8063385d7aec116101ae578063385d7aec146102be57806338fff2d01461031b57806342fda9c71461032e5780634533d67814610360575f5ffd5b806303386205146101f15780630a6f0ee91461021057806315cc481e1461022f578063281bfc391461027a575f5ffd5b366101ed576101eb6106d8565b005b5f5ffd5b3480156101fc575f5ffd5b506101eb61020b366004612aeb565b610723565b34801561021b575f5ffd5b506101eb61022a366004612bd0565b6108d9565b34801561023a575f5ffd5b507f00000000000000000000000000000000000000000000000000000000000000005b6040516001600160a01b0390911681526020015b60405180910390f35b348015610285575f5ffd5b506102b0610294366004612c46565b600c60209081525f928352604080842090915290825290205481565b604051908152602001610271565b3480156102c9575f5ffd5b506102fc6102d8366004612c7d565b600b6020525f9081526040902080546001909101546001600160a01b039091169082565b604080516001600160a01b039093168352602083019190915201610271565b348015610326575f5ffd5b505f546102b0565b348015610339575f5ffd5b507f00000000000000000000000000000000000000000000000000000000000000006102b0565b34801561036b575f5ffd5b5060075461038690600160401b90046001600160401b031681565b6040516001600160401b039091168152602001610271565b3480156103a9575f5ffd5b506001546102b0565b6101eb6103c0366004612c98565b6108f1565b3480156103d0575f5ffd5b506103f87f000000000000000000000000000000000000000000000000000000000000000081565b6040519015158152602001610271565b348015610413575f5ffd5b50610427610422366004612c7d565b61090b565b6040516102719190612db9565b34801561043f575f5ffd5b506101eb61044e366004612e19565b610922565b34801561045e575f5ffd5b506101eb61046d366004612e61565b610a7e565b34801561047d575f5ffd5b506103f87f000000000000000000000000000000000000000000000000000000000000000081565b3480156104b0575f5ffd5b506102b060035481565b3480156104c5575f5ffd5b5061025d6104d4366004612e8d565b60056020525f90815260409020546001600160a01b031681565b3480156104f9575f5ffd5b506002546103869061010090046001600160401b031681565b34801561051d575f5ffd5b506101eb61052c366004612e61565b610a92565b34801561053c575f5ffd5b506002546103f89060ff1681565b348015610555575f5ffd5b50600754610386906001600160401b031681565b348015610574575f5ffd5b506007546103f890600160801b900460ff1681565b348015610594575f5ffd5b50600954610386906001600160401b031681565b3480156105b3575f5ffd5b5060025461038690600160481b90046001600160401b031681565b3480156105d9575f5ffd5b506103f86105e8366004612c7d565b60086020525f908152604090205460ff1681565b348015610607575f5ffd5b506102b0600a5481565b34801561061c575f5ffd5b506101eb61062b366004612ea4565b610aa6565b34801561063b575f5ffd5b506101eb61064a366004612ee7565b610af6565b34801561065a575f5ffd5b506101eb610669366004612e8d565b610bf3565b348015610679575f5ffd5b506102b0610688366004612e8d565b60046020525f908152604090205481565b3480156106a4575f5ffd5b506101eb6106b3366004612aeb565b610c25565b6106cb6106c6366004612bd0565b610d84565b6040516102719190612f5a565b336001600160a01b037f0000000000000000000000000000000000000000000000000000000000000000161461072157604051634dc59d4360e01b815260040160405180910390fd5b565b3361072d81610da3565b610735610e52565b5f5f8380602001905181019061074b9190613014565b915091505f5f5b8351811015610896575f84828151811061076e5761076e6130d0565b6020026020010151905061078181610e84565b61079e576040516328a9502360e11b815260040160405180910390fd5b6001600160a01b0381165f908152600b602052604090206001810154156107e857604051633fc206d160e11b81526001600160a01b03831660048201526024015b60405180910390fd5b5f8584815181106107fb576107fb6130d0565b60200260200101519050808561081191906130f8565b600183018290556001600160a01b038085165f81815260066020526040908190205486546001600160a01b0319166101009091049093169290921785559051919650907f03538f7b2dd2a11ad559447b61338d4a002f3719c20ce5c499fa348076b19565906108839084815260200190565b60405180910390a2505050600101610752565b5080600a5f8282546108a891906130f8565b9091555050600154600a5411156108d257604051639c25fe8760e01b815260040160405180910390fd5b5050505050565b6108e16106d8565b6108ec838383610ea8565b505050565b6108f96106d8565b6109058484848461105b565b50505050565b61091361294f565b61091c826114ca565b92915050565b3361092c81610da3565b6109378484846115d8565b5f5460405163068bcd8d60e01b815260048101919091527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063068bcd8d906024015f60405180830381865afa15801561099c573d5f5f3e3d5ffd5b505050506040513d5f823e601f3d908101601f191682016040526109c391908101906131a9565b604001516001600160a01b0316846001600160a01b031603610a1f57600154836109f66001600160a01b03871630611623565b610a009190613259565b1015610a1f5760405163a196582960e01b815260040160405180910390fd5b610a336001600160a01b03851683856116c2565b604080518481526001600160a01b0384811660208301528616917fff79f55e9fae054ff094d9e06f631119716d818f9f8ea9b5b2adf5679f6c12e0910160405180910390a250505050565b33610a8881610da3565b6108ec838361170e565b33610a9c81610da3565b6108ec83836117b1565b610aaf8261185a565b610ab982826118a6565b7f91efa3d50feccde0d0d202f8ae5c41ca0b2be614cebcb2bd2f4b019396e6568a8282604051610aea92919061326c565b60405180910390a15050565b610aff3361190a565b6003548114610b2157604051637fcce2a960e01b815260040160405180910390fd5b5f5b82811015610905575f848483818110610b3e57610b3e6130d0565b9050604002015f013590505f858584818110610b5c57610b5c6130d0565b9050604002016020013590507f000000000000000000000000000000000000000000000000000000000000000015610b9b57610b98828261191b565b90505b5f828152600460209081526040918290208390558151838152339181019190915283917f941884a9a55191a7401466aaf8a0d2b7c8b082055a5a2b345b83c73940172ac4910160405180910390a25050600101610b23565b610bfb6106d8565b610c0481611a16565b8060015f828254610c1591906130f8565b90915550610c2290508181565b50565b610c2d610e52565b7f000000000000000000000000000000000000000000000000000000000000000015610c6c576040516343f6e4ab60e01b815260040160405180910390fd5b5f81806020019051810190610c819190613284565b80519091505f5b81811015610905575f838281518110610ca357610ca36130d0565b60209081029190910181015180516001600160a01b039081165f908152600c80855260408083208587018051861685529087528184205486518616855260068852828520548751871686529388528285208251871686529097529083209290925590519294506101009004811691610d1d911682846116c2565b825f01516001600160a01b03167f7e6632ca16a0ac6cf28448500b1a17d96c8b8163ad4c4a9b44ef5386cc02779e838560200151604051610d719291909182526001600160a01b0316602082015260400190565b60405180910390a2505050600101610c88565b6060610d8e6106d8565b610d99848484611a49565b90505b9392505050565b5f546040516329e40d4b60e01b815260048101919091526001600160a01b0382811660248301527f000000000000000000000000000000000000000000000000000000000000000016906329e40d4b90604401602060405180830381865afa158015610e11573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610e35919061335e565b610c2257604051634dc59d4360e01b815260040160405180910390fd5b600754600160401b90046001600160401b0316421161072157604051637b3aa4c760e01b815260040160405180910390fd5b5f6002610e9083611dbb565b6006811115610ea157610ea1613377565b1492915050565b610eb0610e52565b5f5b8351811015610905575f848281518110610ece57610ece6130d0565b6020908102919091018101516001600160a01b038082165f818152600b808652604080832081518083019092528054958616808352600182018054848b01819052968652939098526001600160a01b031990951690945581905592945090929091829003610f5a57604051636d3e267760e11b81526001600160a01b03851660048201526024016107df565b6001600160a01b038116610fc85760405162461bcd60e51b815260206004820152602f60248201527f4b69636b7374617274657251463a20526563697069656e74207061796f75742060448201526e1859191c995cdcc81b9bdd081cd95d608a1b60648201526084016107df565b8160015f828254610fd99190613259565b9091555050604080516001600160a01b0383811660208301529181018490528782166060820152908516907fa72470a03bbc439585e6200fa2dee59c80671137f9f953dc75acfd08b7c37ad59060800160408051601f19818403018152908290526110439161338b565b60405180910390a2505060019092019150610eb29050565b611063611dd9565b5f5f83806020019051810190611079919061341b565b915091505f5f5b87518110156114a0576110ab88828151811061109e5761109e6130d0565b6020026020010151610e84565b6110c8576040516328a9502360e11b815260040160405180910390fd5b60085f8583815181106110dd576110dd6130d0565b6020908102919091018101516001600160a01b031682528101919091526040015f205460ff1615801561113a57505f805260086020527f5eff886ea0ce6ca488a3d6e336d6c0f75f46d19b42c06ce5ee98e42c96d256c75460ff16155b15611158576040516310182db560e11b815260040160405180910390fd5b7f00000000000000000000000000000000000000000000000000000000000000006112215786818151811061118f5761118f6130d0565b6020026020010151600c5f8a84815181106111ac576111ac6130d0565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020015f205f8684815181106111e6576111e66130d0565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020015f205f82825461121b91906130f8565b90915550505b5f7f000000000000000000000000000000000000000000000000000000000000000061124d57306112a0565b60065f8a8481518110611262576112626130d0565b60200260200101516001600160a01b03166001600160a01b031681526020019081526020015f205f0160019054906101000a90046001600160a01b03165b905073eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee6001600160a01b03168583815181106112d2576112d26130d0565b60200260200101516001600160a01b031603611314578782815181106112fa576112fa6130d0565b60200260200101518361130d91906130f8565b9250611381565b61138186828a858151811061132b5761132b6130d0565b6020026020010151878681518110611345576113456130d0565b602002602001015189878151811061135f5761135f6130d0565b60200260200101516001600160a01b0316611e3890949392919063ffffffff16565b6113d386828a8581518110611398576113986130d0565b60200260200101518886815181106113b2576113b26130d0565b60200260200101516001600160a01b031661212c909392919063ffffffff16565b856001600160a01b03168983815181106113ef576113ef6130d0565b60200260200101516001600160a01b03167f7cf390a26cc6009692dd8cb8a7e6f1c70b4f19d8f8802358fd606bad67efebd48a8581518110611433576114336130d0565b602002602001015188868151811061144d5761144d6130d0565b602002602001015160405160200161147491906001600160a01b0391909116815260200190565b60408051601f198184030181529082905261148f929161326c565b60405180910390a350600101611080565b508034146114c157604051631badfb6f60e31b815260040160405180910390fd5b50505050505050565b6114d261294f565b6001600160a01b038281165f908152600660209081526040918290208251608081018452815460ff811615158252610100810490951681840152600160a81b9094046001600160401b03168484015282518084019093526001810180548452600282018054929460608701949093908401919061154e90613474565b80601f016020809104026020016040519081016040528092919081815260200182805461157a90613474565b80156115c55780601f1061159c576101008083540402835291602001916115c5565b820191905f5260205f20905b8154815290600101906020018083116115a857829003601f168201915b5050509190925250505090525092915050565b6009546007546115fb916001600160401b0390811691600160401b9004166134ac565b6001600160401b031642116108ec57604051637fcce2a960e01b815260040160405180910390fd5b5f73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b0384160161165a57506001600160a01b0381163161091c565b6040516370a0823160e01b81526001600160a01b0383811660048301528416906370a0823190602401602060405180830381865afa15801561169e573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190610d9c91906134cb565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b038416016116fa576108ec6001600160a01b0383168261218e565b6108ec6001600160a01b03841683836121ab565b611718828261220e565b6002805470ffffffffffffffffffffffffffffffff0019166101006001600160401b03858116820270ffffffffffffffff000000000000000000191692909217600160481b8584168102919091179384905560408051928504841683529304909116602082015233918101919091527ff8303af1d06b82233c0a25f4bd0da1a9e457fea4d0b455bd6beb9860a67445e990606001610aea565b806001600160401b0316826001600160401b031611156117e45760405163737ff00560e11b815260040160405180910390fd5b600780546001600160401b038481166fffffffffffffffffffffffffffffffff199092168217600160401b9185169182021790925560408051918252602082019290925233918101919091527ffb1cbc66ebe2174a0f3d546d035b9f4b900ea51c97b5200180571af31bb4213190606001610aea565b6118626106d8565b5f54156118825760405163d9212fe160e01b815260040160405180910390fd5b805f036118a257604051630576c36560e11b815260040160405180910390fd5b5f55565b5f5f5f5f5f5f868060200190518101906118c091906134ed565b6009805467ffffffffffffffff19166001600160401b038516179055949a509298509096509450925090506118f486612241565b61190082868684612270565b5050505050505050565b61191261232f565b610c2281610da3565b5f82815260046020526040812054815b6040811015611a0d57600281901b5f600f86831c16600681111561195157611951613377565b90505f600f85841c16600681111561196b5761196b613377565b905080600681111561197f5761197f613377565b82600681111561199157611991613377565b146119ff575f6119a58560068b901b6130f8565b6119b09060016130f8565b9050828060068111156119c5576119c5613377565b8160068111156119d7576119d7613377565b146119fc57600f851b198916858260068111156119f6576119f6613377565b901b1798505b50505b50505080600101905061192b565b50919392505050565b600754600160401b90046001600160401b0316421115610c22576040516353b0201960e01b815260040160405180910390fd5b6060611a5361232f565b5f83806020019051810190611a6891906135b6565b905084516001600160401b03811115611a8357611a836129a1565b604051908082528060200260200182016040528015611aac578160200160208202803683370190505b5091505f5b8551811015611db2575f868281518110611acd57611acd6130d0565b602002602001015190505f838381518110611aea57611aea6130d0565b602002602001015190505f5f5f5f611b02858b612354565b93509350935093506001600160a01b038616611b3c576040516329508e6f60e01b81526001600160a01b03851660048201526024016107df565b60025460ff168015611b5a57506020820151511580611b5a57508151155b15611b7857604051635a4388dd60e11b815260040160405180910390fd5b6001600160a01b038085165f908152600660209081526040909120805492891661010002610100600160a81b0319909316929092178255835160018301908155908401518491906002840190611bce908261362b565b5050815460ff191685151517808355600160a81b90046001600160401b03165f039050611cd85760038054825467ffffffffffffffff60a81b1916600160a81b6001600160401b0390921691909102178255545f90815260056020526040902080546001600160a01b0319166001600160a01b038716179055611c568560015b60ff166123e0565b5f86600354604051602001611c6c9291906136e5565b6040516020818303038152906040529050856001600160a01b03167fb5ca2dfb0bd25603299b76fefa9fbe3abdc9f951bdfb7ffd208f93ab7f8e203c82604051611cb6919061338b565b60405180910390a260038054905f611ccd83613706565b919050555050611d74565b5f611ce286612410565b905060ff811660021480611cf9575060ff81166005145b15611d0e57611d09866001611c4e565b611d25565b60021960ff821601611d2557611d25866004611c4e565b856001600160a01b03167fcec1da3f7f0b8a344dd1025d06e2ddd48b14880395997ad97cbdb439acc761d4888e611d5b8a612410565b604051611d6a9392919061371e565b60405180910390a2505b848a8981518110611d8757611d876130d0565b6001600160a01b0390921660209283029190910190910152505060019095019450611ab19350505050565b50509392505050565b5f611dc582612410565b60ff16600681111561091c5761091c613377565b6007546001600160401b0316421015611e0557604051631563981560e11b815260040160405180910390fd5b600754600160401b90046001600160401b031642111561072157604051631563981560e11b815260040160405180910390fd5b8051156108d257604051636eb1769f60e11b81526001600160a01b038581166004830152848116602483015283919087169063dd62ed3e90604401602060405180830381865afa158015611e8e573d5f5f3e3d5ffd5b505050506040513d601f19601f82011682018060405250810190611eb291906134cb565b10156108d2575f5f82806020019051810190611ece9190613753565b90925090506003826003811115611ee757611ee7613377565b03611f965780516040805160a0810182526001600160a01b038a81166060808401918252608084018a9052908352602080870151818501528487015184860152845180860186528b841681529081018a905290860151935163187945bd60e11b815291909416936330f28b7a93611f6493928c91906004016137fd565b5f604051808303815f87803b158015611f7b575f5ffd5b505af1158015611f8d573d5f5f3e3d5ffd5b505050506114c1565b6001826003811115611faa57611faa613377565b03612058575f5f5f611fbf846060015161245e565b604080880151905163d505accf60e01b81526001600160a01b038e811660048301528d81166024830152604482018d9052606482019290925260ff8316608482015260a4810185905260c4810184905293965091945092508b169063d505accf9060e4015f604051808303815f87803b15801561203a575f5ffd5b505af115801561204c573d5f5f3e3d5ffd5b505050505050506114c1565b600282600381111561206c5761206c613377565b036114c1575f5f5f612081846060015161245e565b602087015160408089015190516323f2ebc360e21b81526001600160a01b038f811660048301528e81166024830152604482019390935260648101919091526001608482015260ff831660a482015260c4810185905260e4810184905293965091945092508b1690638fcbaf0c90610104015f604051808303815f87803b15801561210a575f5ffd5b505af115801561211c573d5f5f3e3d5ffd5b5050505050505050505050505050565b73eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeed196001600160a01b03851601612179576001600160a01b0382163014612174576121746001600160a01b0383168261218e565b610905565b6109056001600160a01b0385168484846124dc565b5f5f5f5f84865af16121a75763b12d13eb5f526004601cfd5b5050565b6040516001600160a01b0383166024820152604481018290526108ec90849063a9059cbb60e01b906064015b60408051601f198184030181529190526020810180516001600160e01b03166001600160e01b031990931692909217909152612514565b806001600160401b0316826001600160401b031611156121a757604051637fcce2a960e01b815260040160405180910390fd5b80516002805460ff191691151591909117905560208101516040820151612268919061170e565b506001600355565b83515f036122b1575f805260086020527f5eff886ea0ce6ca488a3d6e336d6c0f75f46d19b42c06ce5ee98e42c96d256c7805460ff1916600117905561230e565b5f5b845181101561230c57600160085f8784815181106122d3576122d36130d0565b6020908102919091018101516001600160a01b031682528101919091526040015f20805460ff19169115159190911790556001016122b3565b505b6007805460ff60801b1916600160801b8315150217905561090583836117b1565b6123376125e7565b6107215760405163e305e1ad60e01b815260040160405180910390fd5b5f5f61237260405180604001604052805f8152602001606081525090565b60605f868060200190518101906123899190613876565b909450925090506001600160a01b038116156123d2576123a9818761262c565b6123c65760405163075fd2b160e01b815260040160405180910390fd5b600193508094506123d6565b8594505b5092959194509250565b5f5f5f6123ec856127a8565b5f9283526004602052604090922095811b600f90911b199091161790935550505050565b6001600160a01b0381165f90815260066020526040812054600160a81b90046001600160401b0316810361244557505f919050565b5f5f612450846127a8565b600f911c1695945050505050565b5f5f5f8351604103612483575050506020810151604082015160608301515f1a6124d5565b83516040036124bc57602084015160408501519093506001600160ff1b03811692506124b460ff82901c601b6138eb565b9150506124d5565b604051636e855a4160e01b815260040160405180910390fd5b9193909250565b6040516001600160a01b03808516602483015283166044820152606481018290526109059085906323b872dd60e01b906084016121d7565b5f612568826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166128309092919063ffffffff16565b905080515f1480612588575080806020019051810190612588919061335e565b6108ec5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e6044820152691bdd081cdd58d8d9595960b21b60648201526084016107df565b6002545f90426101009091046001600160401b03161180159061261c5750600254600160481b90046001600160401b03164211155b156126275750600190565b505f90565b5f5f7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316635ab1bd536040518163ffffffff1660e01b8152600401602060405180830381865afa15801561268a573d5f5f3e3d5ffd5b505050506040513d601f19601f820116820180604052508101906126ae9190613904565b60405163dd93da4360e01b81526001600160a01b0386811660048301529192505f9183169063dd93da43906024015f60405180830381865afa1580156126f6573d5f5f3e3d5ffd5b505050506040513d5f823e601f3d908101601f1916820160405261271d919081019061391f565b8051604051635e8a791560e01b81529192506001600160a01b03841691635e8a7915916127609188906004019182526001600160a01b0316602082015260400190565b602060405180830381865afa15801561277b573d5f5f3e3d5ffd5b505050506040513d601f19601f8201168201806040525081019061279f919061335e565b95945050505050565b6001600160a01b0381165f908152600660205260408120548190819081906127e290600190600160a81b90046001600160401b03166139e9565b6001600160401b031690505f6127f9604083613a1c565b90505f612807604084613a2f565b612812906004613a42565b5f838152600460205260409020549298909750919550909350505050565b6060610d9984845f85855f5f866001600160a01b031685876040516128559190613a59565b5f6040518083038185875af1925050503d805f811461288f576040519150601f19603f3d011682016040523d82523d5f602084013e612894565b606091505b50915091506128a5878383876128b2565b925050505b949350505050565b606083156129205782515f03612919576001600160a01b0385163b6129195760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e747261637400000060448201526064016107df565b50816128aa565b6128aa83838151156129355781518083602001fd5b8060405162461bcd60e51b81526004016107df919061338b565b60405180608001604052805f151581526020015f6001600160a01b031681526020015f6001600160401b0316815260200161299c60405180604001604052805f8152602001606081525090565b905290565b634e487b7160e01b5f52604160045260245ffd5b604080519081016001600160401b03811182821017156129d7576129d76129a1565b60405290565b60405160c081016001600160401b03811182821017156129d7576129d76129a1565b604051606081016001600160401b03811182821017156129d7576129d76129a1565b604051608081016001600160401b03811182821017156129d7576129d76129a1565b604051601f8201601f191681016001600160401b0381118282101715612a6b57612a6b6129a1565b604052919050565b5f6001600160401b03821115612a8b57612a8b6129a1565b50601f01601f191660200190565b5f82601f830112612aa8575f5ffd5b8135612abb612ab682612a73565b612a43565b818152846020838601011115612acf575f5ffd5b816020850160208301375f918101602001919091529392505050565b5f60208284031215612afb575f5ffd5b81356001600160401b03811115612b10575f5ffd5b6128aa84828501612a99565b5f6001600160401b03821115612b3457612b346129a1565b5060051b60200190565b6001600160a01b0381168114610c22575f5ffd5b8035612b5d81612b3e565b919050565b5f82601f830112612b71575f5ffd5b8135612b7f612ab682612b1c565b8082825260208201915060208360051b860101925085831115612ba0575f5ffd5b602085015b83811015612bc6578035612bb881612b3e565b835260209283019201612ba5565b5095945050505050565b5f5f5f60608486031215612be2575f5ffd5b83356001600160401b03811115612bf7575f5ffd5b612c0386828701612b62565b93505060208401356001600160401b03811115612c1e575f5ffd5b612c2a86828701612a99565b9250506040840135612c3b81612b3e565b809150509250925092565b5f5f60408385031215612c57575f5ffd5b8235612c6281612b3e565b91506020830135612c7281612b3e565b809150509250929050565b5f60208284031215612c8d575f5ffd5b8135610d9c81612b3e565b5f5f5f5f60808587031215612cab575f5ffd5b84356001600160401b03811115612cc0575f5ffd5b612ccc87828801612b62565b94505060208501356001600160401b03811115612ce7575f5ffd5b8501601f81018713612cf7575f5ffd5b8035612d05612ab682612b1c565b8082825260208201915060208360051b850101925089831115612d26575f5ffd5b6020840193505b82841015612d48578335825260209384019390910190612d2d565b955050505060408501356001600160401b03811115612d65575f5ffd5b612d7187828801612a99565b925050612d8060608601612b52565b905092959194509250565b5f81518084528060208401602086015e5f602082860101526020601f19601f83011685010191505092915050565b6020815281511515602082015260018060a01b0360208301511660408201526001600160401b0360408301511660608201525f6060830151608080840152805160a084015260208101519050604060c08401526128aa60e0840182612d8b565b5f5f5f60608486031215612e2b575f5ffd5b8335612e3681612b3e565b9250602084013591506040840135612c3b81612b3e565b6001600160401b0381168114610c22575f5ffd5b5f5f60408385031215612e72575f5ffd5b8235612e7d81612e4d565b91506020830135612c7281612e4d565b5f60208284031215612e9d575f5ffd5b5035919050565b5f5f60408385031215612eb5575f5ffd5b8235915060208301356001600160401b03811115612ed1575f5ffd5b612edd85828601612a99565b9150509250929050565b5f5f5f60408486031215612ef9575f5ffd5b83356001600160401b03811115612f0e575f5ffd5b8401601f81018613612f1e575f5ffd5b80356001600160401b03811115612f33575f5ffd5b8660208260061b8401011115612f47575f5ffd5b6020918201979096509401359392505050565b602080825282518282018190525f918401906040840190835b81811015612f9a5783516001600160a01b0316835260209384019390920191600101612f73565b509095945050505050565b8051612b5d81612b3e565b5f82601f830112612fbf575f5ffd5b8151612fcd612ab682612b1c565b8082825260208201915060208360051b860101925085831115612fee575f5ffd5b602085015b83811015612bc657805161300681612b3e565b835260209283019201612ff3565b5f5f60408385031215613025575f5ffd5b82516001600160401b0381111561303a575f5ffd5b61304685828601612fb0565b92505060208301516001600160401b03811115613061575f5ffd5b8301601f81018513613071575f5ffd5b805161307f612ab682612b1c565b8082825260208201915060208360051b8501019250878311156130a0575f5ffd5b6020840193505b828410156130c25783518252602093840193909101906130a7565b809450505050509250929050565b634e487b7160e01b5f52603260045260245ffd5b634e487b7160e01b5f52601160045260245ffd5b8082018082111561091c5761091c6130e4565b5f82601f83011261311a575f5ffd5b8151602083015f61312d612ab684612a73565b9050828152858383011115613140575f5ffd5b8282602083015e5f92810160200192909252509392505050565b5f6040828403121561316a575f5ffd5b6131726129b5565b8251815260208301519091506001600160401b03811115613191575f5ffd5b61319d8482850161310b565b60208301525092915050565b5f602082840312156131b9575f5ffd5b81516001600160401b038111156131ce575f5ffd5b820160c081850312156131df575f5ffd5b6131e76129dd565b8151815260208201516131f981612b3e565b6020820152604082015161320c81612b3e565b604082015260608201516001600160401b03811115613229575f5ffd5b6132358682850161315a565b6060830152506080828101519082015260a091820151918101919091529392505050565b8181038181111561091c5761091c6130e4565b828152604060208201525f610d996040830184612d8b565b5f60208284031215613294575f5ffd5b81516001600160401b038111156132a9575f5ffd5b8201601f810184136132b9575f5ffd5b80516132c7612ab682612b1c565b8082825260208201915060208360061b8501019250868311156132e8575f5ffd5b6020840193505b828410156133455760408488031215613306575f5ffd5b61330e6129b5565b845161331981612b3e565b8152602085015161332981612b3e565b80602083015250808352506020820191506040840193506132ef565b9695505050505050565b80518015158114612b5d575f5ffd5b5f6020828403121561336e575f5ffd5b610d9c8261334f565b634e487b7160e01b5f52602160045260245ffd5b602081525f610d9c6020830184612d8b565b5f82601f8301126133ac575f5ffd5b81516133ba612ab682612b1c565b8082825260208201915060208360051b8601019250858311156133db575f5ffd5b602085015b83811015612bc65780516001600160401b038111156133fd575f5ffd5b61340c886020838a010161310b565b845250602092830192016133e0565b5f5f6040838503121561342c575f5ffd5b82516001600160401b03811115613441575f5ffd5b61344d85828601612fb0565b92505060208301516001600160401b03811115613468575f5ffd5b612edd8582860161339d565b600181811c9082168061348857607f821691505b6020821081036134a657634e487b7160e01b5f52602260045260245ffd5b50919050565b6001600160401b03818116838216019081111561091c5761091c6130e4565b5f602082840312156134db575f5ffd5b5051919050565b8051612b5d81612e4d565b5f5f5f5f5f5f868803610100811215613504575f5ffd5b6060811215613511575f5ffd5b5061351a6129ff565b6135238861334f565b8152602088015161353381612e4d565b6020820152604088015161354681612e4d565b60408201529550613559606088016134e2565b9450613567608088016134e2565b935061357560a088016134e2565b925060c08701516001600160401b0381111561358f575f5ffd5b61359b89828a01612fb0565b9250506135aa60e0880161334f565b90509295509295509295565b5f602082840312156135c6575f5ffd5b81516001600160401b038111156135db575f5ffd5b6128aa8482850161339d565b601f8211156108ec57805f5260205f20601f840160051c8101602085101561360c5750805b601f840160051c820191505b818110156108d2575f8155600101613618565b81516001600160401b03811115613644576136446129a1565b613658816136528454613474565b846135e7565b6020601f82116001811461368a575f83156136735750848201515b5f19600385901b1c1916600184901b1784556108d2565b5f84815260208120601f198516915b828110156136b95787850151825560209485019460019092019101613699565b50848210156136d657868401515f19600387901b60f8161c191681555b50505050600190811b01905550565b604081525f6136f76040830185612d8b565b90508260208301529392505050565b5f60018201613717576137176130e4565b5060010190565b606081525f6137306060830186612d8b565b6001600160a01b039490941660208301525060ff91909116604090910152919050565b5f5f60408385031215613764575f5ffd5b825160048110613772575f5ffd5b60208401519092506001600160401b0381111561378d575f5ffd5b83016080818603121561379e575f5ffd5b6137a6612a21565b81516137b181612b3e565b8152602082810151908201526040808301519082015260608201516001600160401b038111156137df575f5ffd5b6137eb8782850161310b565b60608301525080925050509250929050565b61381b81865180516001600160a01b03168252602090810151910152565b602085015160408201526040850151606082015261384f608082018580516001600160a01b03168252602090810151910152565b6001600160a01b03831660c082015261010060e082018190525f9061334590830184612d8b565b5f5f5f60608486031215613888575f5ffd5b835161389381612b3e565b60208501519093506001600160401b038111156138ae575f5ffd5b6138ba8682870161315a565b92505060408401516001600160401b038111156138d5575f5ffd5b6138e18682870161310b565b9150509250925092565b60ff818116838216019081111561091c5761091c6130e4565b5f60208284031215613914575f5ffd5b8151610d9c81612b3e565b5f6020828403121561392f575f5ffd5b81516001600160401b03811115613944575f5ffd5b820160c08185031215613955575f5ffd5b61395d6129dd565b815181526020808301519082015260408201516001600160401b03811115613983575f5ffd5b61398f8682850161310b565b60408301525060608201516001600160401b038111156139ad575f5ffd5b6139b98682850161315a565b6060830152506139cb60808301612fa5565b60808201526139dc60a08301612fa5565b60a0820152949350505050565b6001600160401b03828116828216039081111561091c5761091c6130e4565b634e487b7160e01b5f52601260045260245ffd5b5f82613a2a57613a2a613a08565b500490565b5f82613a3d57613a3d613a08565b500690565b808202811582820484141761091c5761091c6130e4565b5f82518060208501845e5f92019182525091905056fea2646970667358221220ff4837a326cefd0b465acdb3982b480c470651930aa213800f093c2086048bb964736f6c634300081c0033',
    sourceMap:
      '553:13113:101:-:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2203:16:9;:14;:16::i;:::-;553:13113:101;;;;;7088:1061;;;;;;;;;;-1:-1:-1;7088:1061:101;;;;;:::i;:::-;;:::i;7561:281:9:-;;;;;;;;;;-1:-1:-1;7561:281:9;;;;;:::i;:::-;;:::i;2756:87::-;;;;;;;;;;-1:-1:-1;2831:5:9;2756:87;;;-1:-1:-1;;;;;4561:32:106;;;4543:51;;4531:2;4516:18;2756:87:9;;;;;;;;3522:70:101;;;;;;;;;;-1:-1:-1;3522:70:101;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;5144:25:106;;;5132:2;5117:18;3522:70:101;4998:177:106;3413:56:101;;;;;;;;;;-1:-1:-1;3413:56:101;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;-1:-1:-1;;;;;3413:56:101;;;;;;;;;;-1:-1:-1;;;;;5624:32:106;;;5606:51;;5688:2;5673:18;;5666:34;;;;5579:18;3413:56:101;5432:274:106;3141:93:9;;;;;;;;;;-1:-1:-1;3194:7:9;3220;3141:93;;2947:102;;;;;;;;;;-1:-1:-1;3030:12:9;2947:102;;598:31:11;;;;;;;;;;-1:-1:-1;598:31:11;;;;-1:-1:-1;;;598:31:11;;-1:-1:-1;;;;;598:31:11;;;;;;-1:-1:-1;;;;;6055:31:106;;;6037:50;;6025:2;6010:18;598:31:11;5893:200:106;3339:109:9;;;;;;;;;;-1:-1:-1;3430:11:9;;3339:109;;6830:338;;;;;;:::i;:::-;;:::i;3036:37:101:-;;;;;;;;;;;;;;;;;;7739:14:106;;7732:22;7714:41;;7702:2;7687:18;3036:37:101;7574:187:106;3598:147:14;;;;;;;;;;-1:-1:-1;3598:147:14;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;4793:680:9:-;;;;;;;;;;-1:-1:-1;4793:680:9;;;;;:::i;:::-;;:::i;6483:231:14:-;;;;;;;;;;-1:-1:-1;6483:231:14;;;;;:::i;:::-;;:::i;673:40::-;;;;;;;;;;;;;;;1074:32;;;;;;;;;;;;;;;;2049:62;;;;;;;;;;-1:-1:-1;2049:62:14;;;;;:::i;:::-;;;;;;;;;;;;-1:-1:-1;;;;;2049:62:14;;;886:35;;;;;;;;;;-1:-1:-1;886:35:14;;;;;;;-1:-1:-1;;;;;886:35:14;;;5515:251:11;;;;;;;;;;-1:-1:-1;5515:251:11;;;;;:::i;:::-;;:::i;790:28:14:-;;;;;;;;;;-1:-1:-1;790:28:14;;;;;;;;514:33:11;;;;;;;;;;-1:-1:-1;514:33:11;;;;-1:-1:-1;;;;;514:33:11;;;725:37;;;;;;;;;;-1:-1:-1;725:37:11;;;;-1:-1:-1;;;725:37:11;;;;;;3193:32:101;;;;;;;;;;-1:-1:-1;3193:32:101;;;;-1:-1:-1;;;;;3193:32:101;;;986:33:14;;;;;;;;;;-1:-1:-1;986:33:14;;;;-1:-1:-1;;;986:33:14;;-1:-1:-1;;;;;986:33:14;;;804:45:11;;;;;;;;;;-1:-1:-1;804:45:11;;;;;:::i;:::-;;;;;;;;;;;;;;;;3329:32:101;;;;;;;;;;;;;;;;1669:220:9;;;;;;;;;;-1:-1:-1;1669:220:9;;;;;:::i;:::-;;:::i;5442:791:14:-;;;;;;;;;;-1:-1:-1;5442:791:14;;;;;:::i;:::-;;:::i;4334:198:9:-;;;;;;;;;;-1:-1:-1;4334:198:9;;;;;:::i;:::-;;:::i;1922:49:14:-;;;;;;;;;;-1:-1:-1;1922:49:14;;;;;:::i;:::-;;;;;;;;;;;;;;6165:744:101;;;;;;;;;;-1:-1:-1;6165:744:101;;;;;:::i;:::-;;:::i;5988:384:9:-;;;;;;:::i;:::-;;:::i;:::-;;;;;;;:::i;8116:133::-;8178:10;-1:-1:-1;;;;;8200:5:9;8178:28;;8174:68;;8215:27;;-1:-1:-1;;;8215:27:9;;;;;;;;;;;8174:68;8116:133::o;7088:1061:101:-;7160:10;2497:30:9;2519:7;2497:21;:30::i;:::-;2365:27:11::1;:25;:27::i;:::-;7203:30:101::2;7235:25;7275:5;7264:41;;;;;;;;;;;;:::i;:::-;7202:103;;;;7316:20;7351:9;7346:660;7366:13;:20;7362:1;:24;7346:660;;;7407:20;7430:13;7444:1;7430:16;;;;;;;;:::i;:::-;;;;;;;7407:39;;7465:34;7486:12;7465:20;:34::i;:::-;7460:90;;7508:42;;-1:-1:-1::0;;;7508:42:101::2;;;;;;;;;;;7460:90;-1:-1:-1::0;;;;;7603:29:101;::::2;7565:35;7603:29:::0;;;:15:::2;:29;::::0;;;;7650:20:::2;::::0;::::2;::::0;:25;7646:82:::2;;7684:44;::::0;-1:-1:-1;;;7684:44:101;;-1:-1:-1;;;;;4561:32:106;;7684:44:101::2;::::0;::::2;4543:51:106::0;4516:18;;7684:44:101::2;;;;;;;;7646:82;7743:15;7761:8;7770:1;7761:11;;;;;;;;:::i;:::-;;;;;;;7743:29;;7802:7;7786:23;;;;;:::i;:::-;7824:20;::::0;::::2;:30:::0;;;-1:-1:-1;;;;;7901:25:101;;::::2;;::::0;;;:11:::2;:25;::::0;;;;;;:42;7868:75;;-1:-1:-1;;;;;;7868:75:101::2;7901:42;::::0;;::::2;::::0;;::::2;7868:75:::0;;;::::2;::::0;;7963:32;;7786:23;;-1:-1:-1;7901:25:101;7963:32:::2;::::0;::::2;::::0;7847:7;5144:25:106;;5132:2;5117:18;;4998:177;7963:32:101::2;;;;;;;;-1:-1:-1::0;;;7388:3:101::2;;7346:660;;;;8037:12;8016:17;;:33;;;;;;;:::i;:::-;::::0;;;-1:-1:-1;;8083:11:101::2;::::0;8063:17:::2;::::0;:31:::2;8059:83;;;8103:39;;-1:-1:-1::0;;;8103:39:101::2;;;;;;;;;;;8059:83;7192:957;;;7088:1061:::0;;:::o;7561:281:9:-;2203:16;:14;:16::i;:::-;7736:42:::1;7748:13;7763:5;7770:7;7736:11;:42::i;:::-;7561:281:::0;;;:::o;6830:338::-;2203:16;:14;:16::i;:::-;7060:48:::1;7070:11;7083:8;7093:5;7100:7;7060:9;:48::i;:::-;6830:338:::0;;;;:::o;3598:147:14:-;3665:27;;:::i;:::-;3711;3725:12;3711:13;:27::i;:::-;3704:34;3598:147;-1:-1:-1;;3598:147:14:o;4793:680:9:-;4922:10;2497:30;2519:7;2497:21;:30::i;:::-;4948:44:::1;4964:6;4972:7;4981:10;4948:15;:44::i;:::-;5126:7;::::0;5112:22:::1;::::0;-1:-1:-1;;;5112:22:9;;::::1;::::0;::::1;5144:25:106::0;;;;5112:5:9::1;-1:-1:-1::0;;;;;5112:13:9::1;::::0;::::1;::::0;5117:18:106;;5112:22:9::1;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::0;;::::1;-1:-1:-1::0;;5112:22:9::1;::::0;::::1;;::::0;::::1;::::0;;;::::1;::::0;::::1;:::i;:::-;:28;;;-1:-1:-1::0;;;;;5102:38:9::1;:6;-1:-1:-1::0;;;;;5102:38:9::1;::::0;5098:211:::1;;5205:11;::::0;5195:7;5160:32:::1;-1:-1:-1::0;;;;;5160:17:9;::::1;5186:4;5160:17;:32::i;:::-;:42;;;;:::i;:::-;:56;5156:143;;;5243:41;;-1:-1:-1::0;;;5243:41:9::1;;;;;;;;;;;5156:143;5318:42;-1:-1:-1::0;;;;;5318:21:9;::::1;5340:10:::0;5352:7;5318:21:::1;:42::i;:::-;5429:37;::::0;;17091:25:106;;;-1:-1:-1;;;;;17152:32:106;;;17147:2;17132:18;;17125:60;5429:37:9;::::1;::::0;::::1;::::0;17064:18:106;5429:37:9::1;;;;;;;4793:680:::0;;;;:::o;6483:231:14:-;6614:10;2497:30:9;2519:7;2497:21;:30::i;:::-;6640:67:14::1;6662:22;6686:20;6640:21;:67::i;5515:251:11:-:0;5664:10;2497:30:9;2519:7;2497:21;:30::i;:::-;5690:69:11::1;5718:20;5740:18;5690:27;:69::i;1669:220:9:-:0;1763:29;1783:8;1763:19;:29::i;:::-;1802:36;1822:8;1832:5;1802:19;:36::i;:::-;1854:28;1866:8;1876:5;1854:28;;;;;;;:::i;:::-;;;;;;;;1669:220;;:::o;5442:791:14:-;5564:37;5590:10;5564:25;:37::i;:::-;5640:17;;5615:21;:42;5611:64;;5666:9;;-1:-1:-1;;;5666:9:14;;;;;;;;;;;5611:64;5746:9;5741:486;5757:20;;;5741:486;;;5798:17;5818:9;;5828:1;5818:12;;;;;;;:::i;:::-;;;;;;:18;;;5798:38;;5850:16;5869:9;;5879:1;5869:12;;;;;;;:::i;:::-;;;;;;:22;;;5850:41;;5910:18;5906:106;;;5959:38;5977:9;5988:8;5959:17;:38::i;:::-;5948:49;;5906:106;6026:25;;;;:14;:25;;;;;;;;;:36;;;6161:55;;17091:25:106;;;6205:10:14;17132:18:106;;;17125:60;;;;6026:25:14;;6161:55;;17064:18:106;6161:55:14;;;;;;;-1:-1:-1;;5779:3:14;;5741:486;;4334:198:9;2203:16;:14;:16::i;:::-;4416:34:::1;4442:7;4416:25;:34::i;:::-;4475:7;4460:11;;:22;;;;;;;:::i;:::-;::::0;;;-1:-1:-1;4492:33:9::1;::::0;-1:-1:-1;4517:7:9;4492:33;:::i:1;:::-;4334:198:::0;:::o;6165:744:101:-;2365:27:11;:25;:27::i;:::-;6261:15:101::1;6257:45;;;6285:17;;-1:-1:-1::0;;;6285:17:101::1;;;;;;;;;;;6257:45;6314:22;6351:5;6340:28;;;;;;;;;;;;:::i;:::-;6403:14:::0;;6313:55;;-1:-1:-1;6379:21:101::1;6427:476;6447:13;6443:1;:17;6427:476;;;6481:19;6503:7;6511:1;6503:10;;;;;;;;:::i;:::-;;::::0;;::::1;::::0;;;;;;;6561:18;;-1:-1:-1;;;;;6545:35:101;;::::1;6527:15;6545:35:::0;;;:15:::1;:35:::0;;;;;;;6581:12;;::::1;::::0;;6545:49;::::1;::::0;;;;;;;;;6648:18;;6636:31;::::1;::::0;;:11:::1;:31:::0;;;;;:48;6715:18;;6699:35;::::1;::::0;;;;;;;;6735:12;;6699:49;::::1;::::0;;;;;;;;:53;;;;6767:12;;6503:10;;-1:-1:-1;6636:48:101::1;::::0;::::1;::::0;::::1;::::0;6767:55:::1;::::0;:27:::1;6636:48:::0;6545:49;6767:27:::1;:55::i;:::-;6850:6;:18;;;-1:-1:-1::0;;;;;6842:50:101::1;;6870:7;6879:6;:12;;;6842:50;;;;;;17091:25:106::0;;;-1:-1:-1;;;;;17152:32:106;17147:2;17132:18;;17125:60;17079:2;17064:18;;16917:274;6842:50:101::1;;;;;;;;-1:-1:-1::0;;;6462:3:101::1;;6427:476;;5988:384:9::0;6140:30;2203:16;:14;:16::i;:::-;6265:38:::1;6275:11;6288:5;6295:7;6265:9;:38::i;:::-;6249:54;;6313:52;5988:384:::0;;;;;:::o;8446:165::-;8551:7;;8531:37;;-1:-1:-1;;;8531:37:9;;;;;17091:25:106;;;;-1:-1:-1;;;;;17152:32:106;;;17132:18;;;17125:60;8531:5:9;:19;;;;17064:18:106;;8531:37:9;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;8526:78;;8577:27;;-1:-1:-1;;;8577:27:9;;;;;;;;;;;4956:166:11;5043:17;;-1:-1:-1;;;5043:17:11;;-1:-1:-1;;;;;5043:17:11;5024:15;:36;5020:95;;5069:46;;-1:-1:-1;;;5069:46:11;;;;;;;;;;;13235:165:101;13318:4;13378:15;13341:33;13361:12;13341:19;:33::i;:::-;:52;;;;;;;;:::i;:::-;;;13235:165;-1:-1:-1;;13235:165:101:o;10399:1955::-;2365:27:11;:25;:27::i;:::-;10758:9:101::1;10753:1595;10773:13;:20;10769:1;:24;10753:1595;;;10814:20;10837:13;10851:1;10837:16;;;;;;;;:::i;:::-;;::::0;;::::1;::::0;;;;;;;-1:-1:-1;;;;;10966:29:101;;::::1;10936:27;10966:29:::0;;;:15:::1;:29:::0;;;;;;;10936:59;;;;::::1;::::0;;;;;;;::::1;::::0;;;;;::::1;::::0;;;;::::1;::::0;;;11304:29;;;;;;;-1:-1:-1;;;;;;11297:36:101;;::::1;::::0;;;;;;10837:16;;-1:-1:-1;10936:59:101;;;;11352:12;;;11348:72:::1;;11373:47;::::0;-1:-1:-1;;;11373:47:101;;-1:-1:-1;;;;;4561:32:106;;11373:47:101::1;::::0;::::1;4543:51:106::0;4516:18;;11373:47:101::1;4383:217:106::0;11348:72:101::1;-1:-1:-1::0;;;;;11527:31:101;::::1;11523:94;;11560:57;::::0;-1:-1:-1;;;11560:57:101;;19467:2:106;11560:57:101::1;::::0;::::1;19449:21:106::0;19506:2;19486:18;;;19479:30;19545:34;19525:18;;;19518:62;-1:-1:-1;;;19596:18:106;;;19589:45;19651:19;;11560:57:101::1;19265:411:106::0;11523:94:101::1;11795:7;11780:11;;:22;;;;;;;:::i;:::-;::::0;;;-1:-1:-1;;12103:47:101::1;::::0;;-1:-1:-1;;;;;19901:32:106;;;12103:47:101::1;::::0;::::1;19883:51:106::0;19950:18;;;19943:34;;;20013:32;;;19993:18;;;19986:60;12077:74:101;;::::1;::::0;::::1;::::0;19856:18:106;;12103:47:101::1;::::0;;-1:-1:-1;;12103:47:101;;::::1;::::0;;;;;;;12077:74:::1;::::0;::::1;:::i;:::-;;;;;;;;-1:-1:-1::0;;10795:3:101::1;::::0;;::::1;::::0;-1:-1:-1;10753:1595:101::1;::::0;-1:-1:-1;10753:1595:101::1;8845:1356:::0;2565:28:11;:26;:28::i;:::-;9053:24:101::1;9079:23;9117:5;9106:39;;;;;;;;;;;;:::i;:::-;9052:93;;;;9155:26;9197:9;9192:934;9212:12;:19;9208:1;:23;9192:934;;;9257:37;9278:12;9291:1;9278:15;;;;;;;;:::i;:::-;;;;;;;9257:20;:37::i;:::-;9252:93;;9303:42;;-1:-1:-1::0;;;9303:42:101::1;;;;;;;;;;;9252:93;9365:13;:25;9379:7;9387:1;9379:10;;;;;;;;:::i;:::-;;::::0;;::::1;::::0;;;;;;;-1:-1:-1;;;;;9365:25:101::1;::::0;;;::::1;::::0;;;;;;-1:-1:-1;9365:25:101;;::::1;;9364:26;:56:::0;::::1;;;-1:-1:-1::0;9395:25:101::1;::::0;;:13:::1;:25;::::0;;;::::1;;9394:26;9364:56;9360:133;;;9447:31;;-1:-1:-1::0;;;9447:31:101::1;;;;;;;;;;;9360:133;9512:15;9507:81;;9577:8;9586:1;9577:11;;;;;;;;:::i;:::-;;;;;;;9529:15;:32;9545:12;9558:1;9545:15;;;;;;;;:::i;:::-;;;;;;;-1:-1:-1::0;;;;;9529:32:101::1;-1:-1:-1::0;;;;;9529:32:101::1;;;;;;;;;;;;:44;9562:7;9570:1;9562:10;;;;;;;;:::i;:::-;;;;;;;-1:-1:-1::0;;;;;9529:44:101::1;-1:-1:-1::0;;;;;9529:44:101::1;;;;;;;;;;;;;:59;;;;;;;:::i;:::-;::::0;;;-1:-1:-1;;9507:81:101::1;9603:25;9631:15;:79;;9705:4;9631:79;;;9649:11;:28;9661:12;9674:1;9661:15;;;;;;;;:::i;:::-;;;;;;;-1:-1:-1::0;;;;;9649:28:101::1;-1:-1:-1::0;;;;;9649:28:101::1;;;;;;;;;;;;:45;;;;;;;;;;-1:-1:-1::0;;;;;9649:45:101::1;9631:79;9603:107;;4861:42:8;-1:-1:-1::0;;;;;9729:29:101::1;:7;9737:1;9729:10;;;;;;;;:::i;:::-;;;;;;;-1:-1:-1::0;;;;;9729:29:101::1;::::0;9725:214:::1;;9800:8;9809:1;9800:11;;;;;;;;:::i;:::-;;;;;;;9778:33;;;;;:::i;:::-;;;9725:214;;;9850:74;9871:7;9880:17;9899:8;9908:1;9899:11;;;;;;;;:::i;:::-;;;;;;;9912:8;9921:1;9912:11;;;;;;;;:::i;:::-;;;;;;;9850:7;9858:1;9850:10;;;;;;;;:::i;:::-;;;;;;;-1:-1:-1::0;;;;;9850:20:101::1;;;:74;;;;;;;:::i;:::-;9953:70;9983:7;9992:17;10011:8;10020:1;10011:11;;;;;;;;:::i;:::-;;;;;;;9953:7;9961:1;9953:10;;;;;;;;:::i;:::-;;;;;;;-1:-1:-1::0;;;;;9953:29:101::1;;;:70;;;;;;:::i;:::-;10070:7;-1:-1:-1::0;;;;;10043:72:101::1;10053:12;10066:1;10053:15;;;;;;;;:::i;:::-;;;;;;;-1:-1:-1::0;;;;;10043:72:101::1;;10079:8;10088:1;10079:11;;;;;;;;:::i;:::-;;;;;;;10103:7;10111:1;10103:10;;;;;;;;:::i;:::-;;;;;;;10092:22;;;;;;;-1:-1:-1::0;;;;;4561:32:106;;;;4543:51;;4531:2;4516:18;;4383:217;10092:22:101::1;;::::0;;-1:-1:-1;;10092:22:101;;::::1;::::0;;;;;;;10043:72:::1;::::0;;::::1;:::i;:::-;;;;;;;;-1:-1:-1::0;9233:3:101::1;;9192:934;;;;10153:18;10140:9;:31;10136:58;;10180:14;;-1:-1:-1::0;;;10180:14:101::1;;;;;;;;;;;10136:58;9042:1159;;;8845:1356:::0;;;;:::o;14202:143:14:-;14278:16;;:::i;:::-;-1:-1:-1;;;;;14313:25:14;;;;;;;:11;:25;;;;;;;;;14306:32;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;14306:32:14;;;-1:-1:-1;;;;;14306:32:14;;;;;;;;;;;;;;;;;;;;;;;;;14313:25;;14306:32;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;;14306:32:14;;;;-1:-1:-1;;;14306:32:14;;-1:-1:-1;14306:32:14;14202:143;-1:-1:-1;;14202:143:14:o;12575:200:101:-;12732:18;;12712:17;;:38;;-1:-1:-1;;;;;12732:18:101;;;;-1:-1:-1;;;12712:17:101;;;:38;:::i;:::-;-1:-1:-1;;;;;12693:57:101;:15;:57;12689:79;;12759:9;;-1:-1:-1;;;12759:9:101;;;;;;;;;;;7260:253:8;7337:7;-1:-1:-1;;;;;;;7360:16:8;;;7356:151;;-1:-1:-1;;;;;;7399:25:8;;;7392:32;;7356:151;7462:34;;-1:-1:-1;;;7462:34:8;;-1:-1:-1;;;;;4561:32:106;;;7462:34:8;;;4543:51:106;7462:24:8;;;;;4516:18:106;;7462:34:8;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;6507:242::-;-1:-1:-1;;;;;;;6600:16:8;;;6596:147;;6632:28;-1:-1:-1;;;;;6632:19:8;;6652:7;6632:19;:28::i;6596:147::-;6691:41;-1:-1:-1;;;;;6691:27:8;;6719:3;6724:7;6691:27;:41::i;7031:617:14:-;7248:67;7270:22;7294:20;7248:21;:67::i;:::-;7364:21;:46;;-1:-1:-1;;7420:42:14;7364:46;-1:-1:-1;;;;;7364:46:14;;;;;-1:-1:-1;;7420:42:14;;;;;-1:-1:-1;;;7420:42:14;;;;;;;;;;;;;7556:85;;;7586:21;;;;;22754:50:106;;7609:19:14;;;;;22835:2:106;22820:18;;22813:59;7630:10:14;22888:18:106;;;22881:60;;;;7556:85:14;;22742:2:106;22727:18;7556:85:14;22556:391:106;3861:430:11;4008:18;-1:-1:-1;;;;;3985:41:11;:20;-1:-1:-1;;;;;3985:41:11;;3981:105;;;4035:51;;-1:-1:-1;;;4035:51:11;;;;;;;;;;;3981:105;4097:19;:42;;-1:-1:-1;;;;;4097:42:11;;;-1:-1:-1;;4149:38:11;;;;;-1:-1:-1;;;4149:38:11;;;;;;;;;;4203:81;;;22754:50:106;;;22835:2;22820:18;;22813:59;;;;4273:10:11;22888:18:106;;;22881:60;;;;4203:81:11;;22742:2:106;22727:18;4203:81:11;22556:391:106;3750:386:9;2203:16;:14;:16::i;:::-;3910:7:::1;::::0;:12;3906:58:::1;;3931:33;;-1:-1:-1::0;;;3931:33:9::1;;;;;;;;;;;3906:58;4051:8;4063:1;4051:13:::0;4047:54:::1;;4073:28;;-1:-1:-1::0;;;4073:28:9::1;;;;;;;;;;;4047:54;4111:7;:18:::0;3750:386::o;4789:899:101:-;4963:64;5041:27;5082:25;5121:26;5161:31;5206;5261:5;5250:85;;;;;;;;;;;;:::i;:::-;5385:18;:40;;-1:-1:-1;;5385:40:101;-1:-1:-1;;;;;5385:40:101;;;;;4949:386;;-1:-1:-1;4949:386:101;;-1:-1:-1;4949:386:101;;-1:-1:-1;5385:40:101;-1:-1:-1;4949:386:101;-1:-1:-1;4949:386:101;-1:-1:-1;5498:61:101;4949:386;5498:26;:61::i;:::-;5569:112;5596:14;5612:20;5634:18;5654:26;5569;:112::i;:::-;4873:815;;;;;;4789:899;;:::o;17892:156:14:-;17971:30;:28;:30::i;:::-;18011;18033:7;18011:21;:30::i;16532:1206::-;16622:7;16718:25;;;:14;:25;;;;;;16622:7;16753:954;16781:2;16775:3;:8;16753:954;;;16887:1;16880:8;;;16860:17;16972:3;16947:21;;;16946:29;16933:44;;;;;;;;:::i;:::-;16913:64;-1:-1:-1;16991:21:14;17057:3;17029:24;;;17028:32;17015:47;;;;;;;;:::i;:::-;16991:71;;17160:14;17146:28;;;;;;;;:::i;:::-;:10;:28;;;;;;;;:::i;:::-;;17142:555;;17194:23;17220:22;17239:3;17234:1;17221:14;;;17220:22;:::i;:::-;:26;;17245:1;17220:26;:::i;:::-;17194:52;-1:-1:-1;17340:10:14;;17406:29;;;;;;;;:::i;:::-;:15;:29;;;;;;;;:::i;:::-;;17402:281;;17561:3;:16;;17559:19;17548:30;;17568:9;17634:15;17626:24;;;;;;;;:::i;:::-;:37;;17611:53;;-1:-1:-1;17402:281:14;17176:521;;17142:555;16792:915;;;16785:5;;;;;16753:954;;;-1:-1:-1;17723:8:14;;16532:1206;-1:-1:-1;;;16532:1206:14:o;12901:185:101:-;13011:17;;-1:-1:-1;;;13011:17:101;;-1:-1:-1;;;;;13011:17:101;12993:15;:35;12989:90;;;13037:42;;-1:-1:-1;;;13037:42:101;;;;;;;;;;;9625:3025:14;9810:30;2800;:28;:30::i;:::-;9936:21:::1;9971:5;9960:28;;;;;;;;;;;;:::i;:::-;9936:52;;10029:12;:19;-1:-1:-1::0;;;;;10015:34:14::1;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;::::0;-1:-1:-1;10015:34:14::1;;9999:50;;10065:9;10060:2584;10080:12;:19;10076:1;:23;10060:2584;;;10120:25;10148:12;10161:1;10148:15;;;;;;;;:::i;:::-;;;;;;;10120:43;;10177:27;10207:6;10214:1;10207:9;;;;;;;;:::i;:::-;;;;;;;10177:39;;10259:20;10281:27;10310:25;10337:23;10380:53;10409:14;10425:7;10380:28;:53::i;:::-;10258:175;;;;;;;;-1:-1:-1::0;;;;;10647:31:14;::::1;10643:125;;10705:48;::::0;-1:-1:-1;;;10705:48:14;;-1:-1:-1;;;;;4561:32:106;;10705:48:14::1;::::0;::::1;4543:51:106::0;4516:18;;10705:48:14::1;4383:217:106::0;10643:125:14::1;10874:16;::::0;::::1;;:85:::0;::::1;;;-1:-1:-1::0;10901:17:14::1;::::0;::::1;::::0;10895:31;:36;;:63:::1;;-1:-1:-1::0;10935:18:14;;:23;10895:63:::1;10870:166;;;10986:35;;-1:-1:-1::0;;;10986:35:14::1;;;;;;;;;;;10870:166;-1:-1:-1::0;;;;;11114:25:14;;::::1;11083:28;11114:25:::0;;;:11:::1;:25;::::0;;;;;;;11196:47;;;;::::1;;;-1:-1:-1::0;;;;;;11196:47:14;;::::1;::::0;;;::::1;::::0;;11257:31;;11196:27:::1;11257:19:::0;::::1;:31:::0;;;;;::::1;::::0;11279:9;;11257:19;:31;;;;::::1;::::0;;::::1;:::i;:::-;-1:-1:-1::0;;11302:53:14;;-1:-1:-1;;11302:53:14::1;::::0;::::1;;;::::0;;;-1:-1:-1;;;11374:22:14;::::1;-1:-1:-1::0;;;;;11374:22:14::1;-1:-1:-1::0;11374:27:14;;-1:-1:-1;11370:1218:14::1;;11510:17;::::0;;11478:50;;-1:-1:-1;;;;11478:50:14::1;-1:-1:-1::0;;;;;;;;11478:50:14;;::::1;::::0;;;::::1;;::::0;;11574:17;-1:-1:-1;11546:46:14;;;:27:::1;:46;::::0;;;;:61;;-1:-1:-1;;;;;;11546:61:14::1;-1:-1:-1::0;;;;;11546:61:14;::::1;;::::0;;11625:56:::1;11546:61:::0;-1:-1:-1;11659:21:14::1;11625:56;;:19;:56::i;:::-;11700:26;11740:14;11756:17;;11729:45;;;;;;;;;:::i;:::-;;;;;;;;;;;;;11700:74;;11808:12;-1:-1:-1::0;;;;;11797:39:14::1;;11822:13;11797:39;;;;;;:::i;:::-;;;;;;;;11855:17;:19:::0;;;:17:::1;:19;::::0;::::1;:::i;:::-;;;;;;11403:486;11370:1218;;;11913:20;11936:37;11960:12;11936:23;:37::i;:::-;11913:60:::0;-1:-1:-1;11995:40:14::1;::::0;::::1;12019:15;11995:40;::::0;:84:::1;;-1:-1:-1::0;12039:40:14::1;::::0;::::1;12063:15;12039:40;11995:84;11991:463;;;12166:56;12186:12:::0;12206:14:::1;12200:21;::::0;12166:56:::1;11991:463;;;-1:-1:-1::0;;12251:40:14::1;::::0;::::1;::::0;12247:207:::1;;12378:57;12398:12:::0;12418:15:::1;12412:22;::::0;12378:57:::1;12496:12;-1:-1:-1::0;;;;;12476:97:14::1;;12510:14;12526:7;12535:37;12559:12;12535:23;:37::i;:::-;12476:97;;;;;;;;:::i;:::-;;;;;;;;11895:693;11370:1218;12621:12;12602:13;12616:1;12602:16;;;;;;;;:::i;:::-;-1:-1:-1::0;;;;;12602:31:14;;::::1;:16;::::0;;::::1;::::0;;;;;;;:31;-1:-1:-1;;10101:3:14::1;::::0;;::::1;::::0;-1:-1:-1;10060:2584:14::1;::::0;-1:-1:-1;;;;10060:2584:14::1;;;9846:2804;9625:3025:::0;;;;;:::o;4064:159::-;4146:6;4178:37;4202:12;4178:23;:37::i;:::-;4171:45;;;;;;;;;;:::i;4613:266:11:-;4700:19;;-1:-1:-1;;;;;4700:19:11;4682:15;:37;4678:93;;;4728:43;;-1:-1:-1;;;4728:43:11;;;;;;;;;;;4678:93;4803:17;;-1:-1:-1;;;4803:17:11;;-1:-1:-1;;;;;4803:17:11;4785:15;:35;4781:91;;;4829:43;;-1:-1:-1;;;4829:43:11;;;;;;;;;;;7960:1413:8;8145:18;;8141:36;8170:7;8141:36;8190;;-1:-1:-1;;;8190:36:8;;-1:-1:-1;;;;;27838:32:106;;;8190:36:8;;;27820:51:106;27907:32;;;27887:18;;;27880:60;8230:7:8;;8190:24;;;;;;27793:18:106;;8190:36:8;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;:47;8186:60;8239:7;8186:60;8257:25;8284:24;8323:11;8312:51;;;;;;;;;;;;:::i;:::-;8256:107;;-1:-1:-1;8256:107:8;-1:-1:-1;8393:20:8;8377:12;:36;;;;;;;;:::i;:::-;;8373:994;;8429:14;;8480:247;;;8551:69;;;;;-1:-1:-1;;;;;8551:69:8;;;8480:247;;;;8551:69;;;;;;;;;8480:247;;;8551:69;8649:12;;;;8480:247;;;;8693:15;;;;8480:247;;;;8745:80;;;;;;;;;;;;;;;;;;8866:16;;;;8429:467;;-1:-1:-1;;;8429:467:8;;:33;;;;;;;:467;;8480:247;8843:5;;8866:16;8429:467;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;8373:994;;;8933:19;8917:12;:35;;;;;;;;:::i;:::-;;8913:454;;8969:9;8980;8991:7;9002:33;9018:6;:16;;;9002:15;:33::i;:::-;9098:15;;;;;9049:74;;-1:-1:-1;;;9049:74:8;;-1:-1:-1;;;;;30400:32:106;;;9049:74:8;;;30382:51:106;30469:32;;;30449:18;;;30442:60;30518:18;;;30511:34;;;30561:18;;;30554:34;;;;30637:4;30625:17;;30604:19;;;30597:46;30659:19;;;30652:35;;;30703:19;;;30696:35;;;8968:67:8;;-1:-1:-1;8968:67:8;;-1:-1:-1;8968:67:8;-1:-1:-1;9049:27:8;;;;;30354:19:106;;9049:74:8;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;8954:180;;;8913:454;;;9160:22;9144:12;:38;;;;;;;;:::i;:::-;;9140:227;;9199:9;9210;9221:7;9232:33;9248:6;:16;;;9232:15;:33::i;:::-;9311:12;;;;9325:15;;;;;9279:77;;-1:-1:-1;;;9279:77:8;;-1:-1:-1;;;;;31093:32:106;;;9279:77:8;;;31075:51:106;31162:32;;;31142:18;;;31135:60;31211:18;;;31204:34;;;;31254:18;;;31247:34;;;;9342:4:8;31297:19:106;;;31290:51;31390:4;31378:17;;31357:19;;;31350:46;31412:19;;;31405:35;;;31456:19;;;31449:35;;;9198:67:8;;-1:-1:-1;9198:67:8;;-1:-1:-1;9198:67:8;-1:-1:-1;9279:19:8;;;;;31047::106;;9279:77:8;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;9184:183;;;8087:1286;;7960:1413;;;;;:::o;5940:365::-;-1:-1:-1;;;;;;;6052:16:8;;;6048:251;;-1:-1:-1;;;;;6155:20:8;;6170:4;6155:20;6151:54;;6177:28;-1:-1:-1;;;;;6177:19:8;;6197:7;6177:19;:28::i;:::-;6048:251;;;6236:52;-1:-1:-1;;;;;6236:31:8;;6268:5;6275:3;6280:7;6236:31;:52::i;2455:490:57:-;2711:4;2705;2699;2693;2685:6;2681:2;2674:5;2669:47;2659:270;;2822:10;2816:4;2809:24;2910:4;2904;2897:18;2659:270;2455:490;;:::o;941:175:37:-;1050:58;;-1:-1:-1;;;;;5624:32:106;;1050:58:37;;;5606:51:106;5673:18;;;5666:34;;;1023:86:37;;1043:5;;-1:-1:-1;;;1073:23:37;5579:18:106;;1050:58:37;;;;-1:-1:-1;;1050:58:37;;;;;;;;;;;;;;-1:-1:-1;;;;;1050:58:37;-1:-1:-1;;;;;;1050:58:37;;;;;;;;;;1023:19;:86::i;8433:221:14:-;8585:20;-1:-1:-1;;;;;8560:45:14;:22;-1:-1:-1;;;;;8560:45:14;;8556:92;;;8628:9;;-1:-1:-1;;;8628:9:14;;;;;;;;;;;3094:347;3262:32;;3243:16;:51;;-1:-1:-1;;3243:51:14;;;;;;;;;;3327:37;;;;3366:35;;;;3305:97;;3327:37;3305:21;:97::i;:::-;-1:-1:-1;3433:1:14;3413:17;:21;3094:347::o;1436:639:11:-;1663:14;:21;1688:1;1663:26;1659:265;;1731:25;;;:13;:25;;;:32;;-1:-1:-1;;1731:32:11;1759:4;1731:32;;;1659:265;;;1799:9;1794:120;1814:14;:21;1810:1;:25;1794:120;;;1895:4;1860:13;:32;1874:14;1889:1;1874:17;;;;;;;;:::i;:::-;;;;;;;;;;;;-1:-1:-1;;;;;1860:32:11;;;;;;;;;;;-1:-1:-1;1860:32:11;:39;;-1:-1:-1;;1860:39:11;;;;;;;;;;-1:-1:-1;1837:3:11;1794:120;;;;1659:265;1934:25;:54;;-1:-1:-1;;;;1934:54:11;-1:-1:-1;;;1934:54:11;;;;;;;1999:69;2027:20;2049:18;1999:27;:69::i;7827:175:14:-;7904:15;:13;:15::i;:::-;7899:97;;7942:43;;-1:-1:-1;;;7942:43:14;;;;;;;;;;;13083:988;13221:20;13243:27;13272:25;-1:-1:-1;;;;;;;;;;;;;;;;;;;13272:25:14;13299:23;13338:36;13451:5;13440:45;;;;;;;;;;;;:::i;:::-;13384:101;;-1:-1:-1;13384:101:14;-1:-1:-1;13384:101:14;-1:-1:-1;;;;;;13660:42:14;;;13656:409;;13723:55;13740:28;13770:7;13723:16;:55::i;:::-;13718:116;;13805:14;;-1:-1:-1;;;13805:14:14;;;;;;;;;;;13718:116;13873:4;13848:29;;13906:28;13891:43;;13656:409;;;14047:7;14032:22;;13656:409;13328:743;13083:988;;;;;;;:::o;14488:463::-;14643:17;14662;14681:19;14704:33;14724:12;14704:19;:33::i;:::-;14782:15;14884:25;;;:14;:25;;;;;;14923:20;;;14816:2;:15;;;14814:18;14800:32;;;14912;14884:60;;;-1:-1:-1;;;;14488:463:14:o;15094:444::-;-1:-1:-1;;;;;15209:25:14;;15180:13;15209:25;;;:11;:25;;;;;:37;-1:-1:-1;;;15209:37:14;;-1:-1:-1;;;;;15209:37:14;:42;;15205:56;;-1:-1:-1;15260:1:14;;15094:444;-1:-1:-1;15094:444:14:o;15205:56::-;15322:17;15341:19;15364:33;15384:12;15364:19;:33::i;:::-;15528:2;15500:24;;15499:31;;15094:444;-1:-1:-1;;;;;15094:444:14:o;9598:790:8:-;9670:9;9681;9692:7;9715:10;:17;9736:2;9715:23;9711:671;;-1:-1:-1;;;9808:4:8;9792:21;;9786:28;9858:4;9842:21;;9836:28;9916:4;9900:21;;9894:28;9891:1;9886:37;9711:671;;;9957:10;:17;9978:2;9957:23;9953:429;;10098:4;10082:21;;10076:28;10149:4;10133:21;;10127:28;10076;;-1:-1:-1;;;;;;10186:73:8;;;-1:-1:-1;10277:30:8;10297:3;10291:9;;;10305:2;10277:30;:::i;:::-;10273:34;;9982:336;9953:429;;;10345:26;;-1:-1:-1;;;10345:26:8;;;;;;;;;;;9953:429;9598:790;;;;;:::o;1355:203:37:-;1482:68;;-1:-1:-1;;;;;32590:32:106;;;1482:68:37;;;32572:51:106;32659:32;;32639:18;;;32632:60;32708:18;;;32701:34;;;1455:96:37;;1475:5;;-1:-1:-1;;;1505:27:37;32545:18:106;;1482:68:37;32370:371:106;5196:642:37;5615:23;5641:69;5669:4;5641:69;;;;;;;;;;;;;;;;;5649:5;-1:-1:-1;;;;;5641:27:37;;;:69;;;;;:::i;:::-;5615:95;;5728:10;:17;5749:1;5728:22;:56;;;;5765:10;5754:30;;;;;;;;;;;;:::i;:::-;5720:111;;;;-1:-1:-1;;;5720:111:37;;32948:2:106;5720:111:37;;;32930:21:106;32987:2;32967:18;;;32960:30;33026:34;33006:18;;;32999:62;-1:-1:-1;;;33077:18:106;;;33070:40;33127:19;;5720:111:37;32746:406:106;8961:224:14;9037:21;;9017:4;;9062:15;9037:21;;;;-1:-1:-1;;;;;9037:21:14;:40;;;;:82;;-1:-1:-1;9100:19:14;;-1:-1:-1;;;9100:19:14;;-1:-1:-1;;;;;9100:19:14;9081:15;:38;;9037:82;9033:124;;;-1:-1:-1;9142:4:14;;8961:224::o;9033:124::-;-1:-1:-1;9173:5:14;;8961:224::o;4447:311::-;4538:4;4554:19;4576:5;-1:-1:-1;;;;;4576:17:14;;:19;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;4641:37;;-1:-1:-1;;;4641:37:14;;-1:-1:-1;;;;;4561:32:106;;;4641:37:14;;;4543:51:106;4554:41:14;;-1:-1:-1;4605:33:14;;4641:28;;;;;4516:18:106;;4641:37:14;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;-1:-1:-1;;4641:37:14;;;;;;;;;;;;:::i;:::-;4730:11;;4695:56;;-1:-1:-1;;;4695:56:14;;4605:73;;-1:-1:-1;;;;;;4695:34:14;;;;;:56;;4743:7;;4695:56;;17091:25:106;;;-1:-1:-1;;;;;17152:32:106;17147:2;17132:18;;17125:60;17079:2;17064:18;;16917:274;4695:56:14;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;4688:63;4447:311;-1:-1:-1;;;;;4447:311:14:o;15750:378::-;-1:-1:-1;;;;;15895:25:14;;15832:7;15895:25;;;:11;:25;;;;;:37;15832:7;;;;;;15895:41;;15935:1;;-1:-1:-1;;;15895:37:14;;-1:-1:-1;;;;;15895:37:14;:41;:::i;:::-;-1:-1:-1;;;;;15869:67:14;;-1:-1:-1;15947:17:14;15967:20;15985:2;15869:67;15967:20;:::i;:::-;15947:40;-1:-1:-1;16008:17:14;16029:20;16047:2;16029:15;:20;:::i;:::-;16028:26;;16053:1;16028:26;:::i;:::-;16095:25;;;;:14;:25;;;;;;;;16008:46;;-1:-1:-1;16095:25:14;;-1:-1:-1;15750:378:14;;-1:-1:-1;;;;15750:378:14:o;4108:223:44:-;4241:12;4272:52;4294:6;4302:4;4308:1;4311:12;4241;5446;5460:23;5487:6;-1:-1:-1;;;;;5487:11:44;5506:5;5513:4;5487:31;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;5445:73;;;;5535:69;5562:6;5570:7;5579:10;5591:12;5535:26;:69::i;:::-;5528:76;;;;5165:446;;;;;;;:::o;7671:628::-;7851:12;7879:7;7875:418;;;7906:10;:17;7927:1;7906:22;7902:286;;-1:-1:-1;;;;;1702:19:44;;;8113:60;;;;-1:-1:-1;;;8113:60:44;;36550:2:106;8113:60:44;;;36532:21:106;36589:2;36569:18;;;36562:30;36628:31;36608:18;;;36601:59;36677:18;;8113:60:44;36348:353:106;8113:60:44;-1:-1:-1;8208:10:44;8201:17;;7875:418;8249:33;8257:10;8269:12;8980:17;;:21;8976:379;;9208:10;9202:17;9264:15;9251:10;9247:2;9243:19;9236:44;8976:379;9331:12;9324:20;;-1:-1:-1;;;9324:20:44;;;;;;;;:::i;-1:-1:-1:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;14:127:106:-;75:10;70:3;66:20;63:1;56:31;106:4;103:1;96:15;130:4;127:1;120:15;146:257;218:4;212:11;;;250:17;;-1:-1:-1;;;;;282:34:106;;318:22;;;279:62;276:88;;;344:18;;:::i;:::-;380:4;373:24;146:257;:::o;408:253::-;480:2;474:9;522:4;510:17;;-1:-1:-1;;;;;542:34:106;;578:22;;;539:62;536:88;;;604:18;;:::i;666:253::-;738:2;732:9;780:4;768:17;;-1:-1:-1;;;;;800:34:106;;836:22;;;797:62;794:88;;;862:18;;:::i;924:253::-;996:2;990:9;1038:4;1026:17;;-1:-1:-1;;;;;1058:34:106;;1094:22;;;1055:62;1052:88;;;1120:18;;:::i;1182:275::-;1253:2;1247:9;1318:2;1299:13;;-1:-1:-1;;1295:27:106;1283:40;;-1:-1:-1;;;;;1338:34:106;;1374:22;;;1335:62;1332:88;;;1400:18;;:::i;:::-;1436:2;1429:22;1182:275;;-1:-1:-1;1182:275:106:o;1462:186::-;1510:4;-1:-1:-1;;;;;1535:6:106;1532:30;1529:56;;;1565:18;;:::i;:::-;-1:-1:-1;1631:2:106;1610:15;-1:-1:-1;;1606:29:106;1637:4;1602:40;;1462:186::o;1653:486::-;1695:5;1748:3;1741:4;1733:6;1729:17;1725:27;1715:55;;1766:1;1763;1756:12;1715:55;1806:6;1793:20;1837:52;1853:35;1881:6;1853:35;:::i;:::-;1837:52;:::i;:::-;1914:6;1905:7;1898:23;1968:3;1961:4;1952:6;1944;1940:19;1936:30;1933:39;1930:59;;;1985:1;1982;1975:12;1930:59;2050:6;2043:4;2035:6;2031:17;2024:4;2015:7;2011:18;1998:59;2106:1;2077:20;;;2099:4;2073:31;2066:42;;;;2081:7;1653:486;-1:-1:-1;;;1653:486:106:o;2144:320::-;2212:6;2265:2;2253:9;2244:7;2240:23;2236:32;2233:52;;;2281:1;2278;2271:12;2233:52;2321:9;2308:23;-1:-1:-1;;;;;2346:6:106;2343:30;2340:50;;;2386:1;2383;2376:12;2340:50;2409:49;2450:7;2441:6;2430:9;2426:22;2409:49;:::i;2469:183::-;2529:4;-1:-1:-1;;;;;2554:6:106;2551:30;2548:56;;;2584:18;;:::i;:::-;-1:-1:-1;2629:1:106;2625:14;2641:4;2621:25;;2469:183::o;2657:131::-;-1:-1:-1;;;;;2732:31:106;;2722:42;;2712:70;;2778:1;2775;2768:12;2793:134;2861:20;;2890:31;2861:20;2890:31;:::i;:::-;2793:134;;;:::o;2932:744::-;2986:5;3039:3;3032:4;3024:6;3020:17;3016:27;3006:55;;3057:1;3054;3047:12;3006:55;3097:6;3084:20;3124:64;3140:47;3180:6;3140:47;:::i;3124:64::-;3212:3;3236:6;3231:3;3224:19;3268:4;3263:3;3259:14;3252:21;;3329:4;3319:6;3316:1;3312:14;3304:6;3300:27;3296:38;3282:52;;3357:3;3349:6;3346:15;3343:35;;;3374:1;3371;3364:12;3343:35;3410:4;3402:6;3398:17;3424:221;3440:6;3435:3;3432:15;3424:221;;;3522:3;3509:17;3539:31;3564:5;3539:31;:::i;:::-;3583:18;;3630:4;3621:14;;;;3457;3424:221;;;-1:-1:-1;3663:7:106;2932:744;-1:-1:-1;;;;;2932:744:106:o;3681:697::-;3792:6;3800;3808;3861:2;3849:9;3840:7;3836:23;3832:32;3829:52;;;3877:1;3874;3867:12;3829:52;3917:9;3904:23;-1:-1:-1;;;;;3942:6:106;3939:30;3936:50;;;3982:1;3979;3972:12;3936:50;4005:61;4058:7;4049:6;4038:9;4034:22;4005:61;:::i;:::-;3995:71;;;4119:2;4108:9;4104:18;4091:32;-1:-1:-1;;;;;4138:8:106;4135:32;4132:52;;;4180:1;4177;4170:12;4132:52;4203:51;4246:7;4235:8;4224:9;4220:24;4203:51;:::i;:::-;4193:61;;;4304:2;4293:9;4289:18;4276:32;4317:31;4342:5;4317:31;:::i;:::-;4367:5;4357:15;;;3681:697;;;;;:::o;4605:388::-;4673:6;4681;4734:2;4722:9;4713:7;4709:23;4705:32;4702:52;;;4750:1;4747;4740:12;4702:52;4789:9;4776:23;4808:31;4833:5;4808:31;:::i;:::-;4858:5;-1:-1:-1;4915:2:106;4900:18;;4887:32;4928:33;4887:32;4928:33;:::i;:::-;4980:7;4970:17;;;4605:388;;;;;:::o;5180:247::-;5239:6;5292:2;5280:9;5271:7;5267:23;5263:32;5260:52;;;5308:1;5305;5298:12;5260:52;5347:9;5334:23;5366:31;5391:5;5366:31;:::i;6098:1471::-;6243:6;6251;6259;6267;6320:3;6308:9;6299:7;6295:23;6291:33;6288:53;;;6337:1;6334;6327:12;6288:53;6377:9;6364:23;-1:-1:-1;;;;;6402:6:106;6399:30;6396:50;;;6442:1;6439;6432:12;6396:50;6465:61;6518:7;6509:6;6498:9;6494:22;6465:61;:::i;:::-;6455:71;;;6579:2;6568:9;6564:18;6551:32;-1:-1:-1;;;;;6598:8:106;6595:32;6592:52;;;6640:1;6637;6630:12;6592:52;6663:24;;6718:4;6710:13;;6706:27;-1:-1:-1;6696:55:106;;6747:1;6744;6737:12;6696:55;6787:2;6774:16;6810:64;6826:47;6866:6;6826:47;:::i;6810:64::-;6896:3;6920:6;6915:3;6908:19;6952:2;6947:3;6943:12;6936:19;;7007:2;6997:6;6994:1;6990:14;6986:2;6982:23;6978:32;6964:46;;7033:7;7025:6;7022:19;7019:39;;;7054:1;7051;7044:12;7019:39;7086:2;7082;7078:11;7067:22;;7098:196;7114:6;7109:3;7106:15;7098:196;;;7204:17;;7234:18;;7281:2;7131:12;;;;7272;;;;7098:196;;;7313:5;-1:-1:-1;;;;7371:2:106;7356:18;;7343:32;-1:-1:-1;;;;;7387:32:106;;7384:52;;;7432:1;7429;7422:12;7384:52;7455:51;7498:7;7487:8;7476:9;7472:24;7455:51;:::i;:::-;7445:61;;;7525:38;7559:2;7548:9;7544:18;7525:38;:::i;:::-;7515:48;;6098:1471;;;;;;;:::o;7766:289::-;7808:3;7846:5;7840:12;7873:6;7868:3;7861:19;7929:6;7922:4;7915:5;7911:16;7904:4;7899:3;7895:14;7889:47;7981:1;7974:4;7965:6;7960:3;7956:16;7952:27;7945:38;8044:4;8037:2;8033:7;8028:2;8020:6;8016:15;8012:29;8007:3;8003:39;7999:50;7992:57;;;7766:289;;;;:::o;8060:748::-;8243:2;8232:9;8225:21;8302:6;8296:13;8289:21;8282:29;8277:2;8266:9;8262:18;8255:57;8393:1;8389;8384:3;8380:11;8376:19;8370:2;8362:6;8358:15;8352:22;8348:48;8343:2;8332:9;8328:18;8321:76;-1:-1:-1;;;;;8455:2:106;8447:6;8443:15;8437:22;8433:47;8428:2;8417:9;8413:18;8406:75;8206:4;8528:2;8520:6;8516:15;8510:22;8570:4;8563;8552:9;8548:20;8541:34;8618:12;8612:19;8606:3;8595:9;8591:19;8584:48;8687:2;8673:12;8669:21;8663:28;8641:50;;8728:2;8722:3;8711:9;8707:19;8700:31;8748:54;8797:3;8786:9;8782:19;8766:14;8748:54;:::i;8813:508::-;8890:6;8898;8906;8959:2;8947:9;8938:7;8934:23;8930:32;8927:52;;;8975:1;8972;8965:12;8927:52;9014:9;9001:23;9033:31;9058:5;9033:31;:::i;:::-;9083:5;-1:-1:-1;9161:2:106;9146:18;;9133:32;;-1:-1:-1;9243:2:106;9228:18;;9215:32;9256:33;9215:32;9256:33;:::i;9326:129::-;-1:-1:-1;;;;;9404:5:106;9400:30;9393:5;9390:41;9380:69;;9445:1;9442;9435:12;9460:384;9526:6;9534;9587:2;9575:9;9566:7;9562:23;9558:32;9555:52;;;9603:1;9600;9593:12;9555:52;9642:9;9629:23;9661:30;9685:5;9661:30;:::i;:::-;9710:5;-1:-1:-1;9767:2:106;9752:18;;9739:32;9780;9739;9780;:::i;9849:226::-;9908:6;9961:2;9949:9;9940:7;9936:23;9932:32;9929:52;;;9977:1;9974;9967:12;9929:52;-1:-1:-1;10022:23:106;;9849:226;-1:-1:-1;9849:226:106:o;10288:434::-;10365:6;10373;10426:2;10414:9;10405:7;10401:23;10397:32;10394:52;;;10442:1;10439;10432:12;10394:52;10487:23;;;-1:-1:-1;10585:2:106;10570:18;;10557:32;-1:-1:-1;;;;;10601:30:106;;10598:50;;;10644:1;10641;10634:12;10598:50;10667:49;10708:7;10699:6;10688:9;10684:22;10667:49;:::i;:::-;10657:59;;;10288:434;;;;;:::o;10727:767::-;10859:6;10867;10875;10928:2;10916:9;10907:7;10903:23;10899:32;10896:52;;;10944:1;10941;10934:12;10896:52;10984:9;10971:23;-1:-1:-1;;;;;11009:6:106;11006:30;11003:50;;;11049:1;11046;11039:12;11003:50;11072:22;;11125:4;11117:13;;11113:27;-1:-1:-1;11103:55:106;;11154:1;11151;11144:12;11103:55;11194:2;11181:16;-1:-1:-1;;;;;11212:6:106;11209:30;11206:50;;;11252:1;11249;11242:12;11206:50;11307:7;11300:4;11290:6;11287:1;11283:14;11279:2;11275:23;11271:34;11268:47;11265:67;;;11328:1;11325;11318:12;11265:67;11359:4;11351:13;;;;11383:6;;-1:-1:-1;11443:20:106;;11430:34;;10727:767;-1:-1:-1;;;10727:767:106:o;11499:637::-;11689:2;11701:21;;;11771:13;;11674:18;;;11793:22;;;11641:4;;11872:15;;;11846:2;11831:18;;;11641:4;11915:195;11929:6;11926:1;11923:13;11915:195;;;11994:13;;-1:-1:-1;;;;;11990:39:106;11978:52;;12059:2;12085:15;;;;12050:12;;;;12026:1;11944:9;11915:195;;;-1:-1:-1;12127:3:106;;11499:637;-1:-1:-1;;;;;11499:637:106:o;12141:138::-;12220:13;;12242:31;12220:13;12242:31;:::i;12284:741::-;12349:5;12402:3;12395:4;12387:6;12383:17;12379:27;12369:55;;12420:1;12417;12410:12;12369:55;12453:6;12447:13;12480:64;12496:47;12536:6;12496:47;:::i;12480:64::-;12568:3;12592:6;12587:3;12580:19;12624:4;12619:3;12615:14;12608:21;;12685:4;12675:6;12672:1;12668:14;12660:6;12656:27;12652:38;12638:52;;12713:3;12705:6;12702:15;12699:35;;;12730:1;12727;12720:12;12699:35;12766:4;12758:6;12754:17;12780:214;12796:6;12791:3;12788:15;12780:214;;;12871:3;12865:10;12888:31;12913:5;12888:31;:::i;:::-;12932:18;;12979:4;12970:14;;;;12813;12780:214;;13030:1176;13159:6;13167;13220:2;13208:9;13199:7;13195:23;13191:32;13188:52;;;13236:1;13233;13226:12;13188:52;13269:9;13263:16;-1:-1:-1;;;;;13294:6:106;13291:30;13288:50;;;13334:1;13331;13324:12;13288:50;13357:72;13421:7;13412:6;13401:9;13397:22;13357:72;:::i;:::-;13347:82;;;13475:2;13464:9;13460:18;13454:25;-1:-1:-1;;;;;13494:8:106;13491:32;13488:52;;;13536:1;13533;13526:12;13488:52;13559:24;;13614:4;13606:13;;13602:27;-1:-1:-1;13592:55:106;;13643:1;13640;13633:12;13592:55;13676:2;13670:9;13699:64;13715:47;13755:6;13715:47;:::i;13699:64::-;13785:3;13809:6;13804:3;13797:19;13841:2;13836:3;13832:12;13825:19;;13896:2;13886:6;13883:1;13879:14;13875:2;13871:23;13867:32;13853:46;;13922:7;13914:6;13911:19;13908:39;;;13943:1;13940;13933:12;13908:39;13975:2;13971;13967:11;13956:22;;13987:189;14003:6;13998:3;13995:15;13987:189;;;14093:10;;14116:18;;14163:2;14020:12;;;;14154;;;;13987:189;;;14195:5;14185:15;;;;;;13030:1176;;;;;:::o;14211:127::-;14272:10;14267:3;14263:20;14260:1;14253:31;14303:4;14300:1;14293:15;14327:4;14324:1;14317:15;14343:127;14404:10;14399:3;14395:20;14392:1;14385:31;14435:4;14432:1;14425:15;14459:4;14456:1;14449:15;14475:125;14540:9;;;14561:10;;;14558:36;;;14574:18;;:::i;14605:514::-;14659:5;14712:3;14705:4;14697:6;14693:17;14689:27;14679:55;;14730:1;14727;14720:12;14679:55;14763:6;14757:13;14802:4;14794:6;14790:17;14831:1;14852:52;14868:35;14896:6;14868:35;:::i;14852:52::-;14841:63;;14929:6;14920:7;14913:23;14969:3;14960:6;14955:3;14951:16;14948:25;14945:45;;;14986:1;14983;14976:12;14945:45;15030:6;15025:3;15018:4;15009:7;15005:18;14999:38;15086:1;15057:20;;;15079:4;15053:31;15046:42;;;;-1:-1:-1;15061:7:106;14605:514;-1:-1:-1;;;14605:514:106:o;15124:471::-;15190:5;15238:4;15226:9;15221:3;15217:19;15213:30;15210:50;;;15256:1;15253;15246:12;15210:50;15278:22;;:::i;:::-;15345:16;;15370:22;;15436:2;15421:18;;15415:25;15269:31;;-1:-1:-1;;;;;;15452:30:106;;15449:50;;;15495:1;15492;15485:12;15449:50;15531:57;15584:3;15575:6;15564:9;15560:22;15531:57;:::i;:::-;15526:2;15519:5;15515:14;15508:81;;15124:471;;;;:::o;15600:1179::-;15692:6;15745:2;15733:9;15724:7;15720:23;15716:32;15713:52;;;15761:1;15758;15751:12;15713:52;15794:9;15788:16;-1:-1:-1;;;;;15819:6:106;15816:30;15813:50;;;15859:1;15856;15849:12;15813:50;15882:22;;15938:4;15920:16;;;15916:27;15913:47;;;15956:1;15953;15946:12;15913:47;15982:22;;:::i;:::-;16049:9;;16067:22;;16127:2;16119:11;;16113:18;16140:33;16113:18;16140:33;:::i;:::-;16200:2;16189:14;;16182:31;16251:2;16243:11;;16237:18;16264:33;16237:18;16264:33;:::i;:::-;16324:2;16313:14;;16306:31;16376:2;16368:11;;16362:18;-1:-1:-1;;;;;16392:32:106;;16389:52;;;16437:1;16434;16427:12;16389:52;16473:65;16530:7;16519:8;16515:2;16511:17;16473:65;:::i;:::-;16468:2;16457:14;;16450:89;-1:-1:-1;16598:3:106;16590:12;;;16584:19;16619:15;;;16612:32;16703:3;16695:12;;;16689:19;16724:15;;;16717:32;;;;16461:5;15600:1179;-1:-1:-1;;;15600:1179:106:o;16784:128::-;16851:9;;;16872:11;;;16869:37;;;16886:18;;:::i;17196:289::-;17371:6;17360:9;17353:25;17414:2;17409;17398:9;17394:18;17387:30;17334:4;17434:45;17475:2;17464:9;17460:18;17452:6;17434:45;:::i;17490:1262::-;17609:6;17662:2;17650:9;17641:7;17637:23;17633:32;17630:52;;;17678:1;17675;17668:12;17630:52;17711:9;17705:16;-1:-1:-1;;;;;17736:6:106;17733:30;17730:50;;;17776:1;17773;17766:12;17730:50;17799:22;;17852:4;17844:13;;17840:27;-1:-1:-1;17830:55:106;;17881:1;17878;17871:12;17830:55;17914:2;17908:9;17937:64;17953:47;17993:6;17953:47;:::i;17937:64::-;18023:3;18047:6;18042:3;18035:19;18079:2;18074:3;18070:12;18063:19;;18134:2;18124:6;18121:1;18117:14;18113:2;18109:23;18105:32;18091:46;;18160:7;18152:6;18149:19;18146:39;;;18181:1;18178;18171:12;18146:39;18213:2;18209;18205:11;18194:22;;18225:497;18241:6;18236:3;18233:15;18225:497;;;18323:4;18317:3;18308:7;18304:17;18300:28;18297:48;;;18341:1;18338;18331:12;18297:48;18371:22;;:::i;:::-;18427:3;18421:10;18444:33;18469:7;18444:33;:::i;:::-;18490:22;;18555:2;18546:12;;18540:19;18572:33;18540:19;18572:33;:::i;:::-;18641:7;18636:2;18629:5;18625:14;18618:31;;18674:5;18669:3;18662:18;;18709:2;18704:3;18700:12;18693:19;;18267:4;18262:3;18258:14;18251:21;;18225:497;;;18741:5;17490:1262;-1:-1:-1;;;;;;17490:1262:106:o;18757:164::-;18833:13;;18882;;18875:21;18865:32;;18855:60;;18911:1;18908;18901:12;18926:202;18993:6;19046:2;19034:9;19025:7;19021:23;19017:32;19014:52;;;19062:1;19059;19052:12;19014:52;19085:37;19112:9;19085:37;:::i;19133:127::-;19194:10;19189:3;19185:20;19182:1;19175:31;19225:4;19222:1;19215:15;19249:4;19246:1;19239:15;20057:218;20204:2;20193:9;20186:21;20167:4;20224:45;20265:2;20254:9;20250:18;20242:6;20224:45;:::i;20280:834::-;20343:5;20396:3;20389:4;20381:6;20377:17;20373:27;20363:55;;20414:1;20411;20404:12;20363:55;20447:6;20441:13;20474:64;20490:47;20530:6;20490:47;:::i;20474:64::-;20562:3;20586:6;20581:3;20574:19;20618:4;20613:3;20609:14;20602:21;;20679:4;20669:6;20666:1;20662:14;20654:6;20650:27;20646:38;20632:52;;20707:3;20699:6;20696:15;20693:35;;;20724:1;20721;20714:12;20693:35;20760:4;20752:6;20748:17;20774:309;20790:6;20785:3;20782:15;20774:309;;;20871:3;20865:10;-1:-1:-1;;;;;20894:11:106;20891:35;20888:55;;;20939:1;20936;20929:12;20888:55;20968:70;21034:3;21027:4;21013:11;21005:6;21001:24;20997:35;20968:70;:::i;:::-;20956:83;;-1:-1:-1;21068:4:106;21059:14;;;;20807;20774:309;;21119:616;21257:6;21265;21318:2;21306:9;21297:7;21293:23;21289:32;21286:52;;;21334:1;21331;21324:12;21286:52;21367:9;21361:16;-1:-1:-1;;;;;21392:6:106;21389:30;21386:50;;;21432:1;21429;21422:12;21386:50;21455:72;21519:7;21510:6;21499:9;21495:22;21455:72;:::i;:::-;21445:82;;;21573:2;21562:9;21558:18;21552:25;-1:-1:-1;;;;;21592:8:106;21589:32;21586:52;;;21634:1;21631;21624:12;21586:52;21657:72;21721:7;21710:8;21699:9;21695:24;21657:72;:::i;21740:380::-;21819:1;21815:12;;;;21862;;;21883:61;;21937:4;21929:6;21925:17;21915:27;;21883:61;21990:2;21982:6;21979:14;21959:18;21956:38;21953:161;;22036:10;22031:3;22027:20;22024:1;22017:31;22071:4;22068:1;22061:15;22099:4;22096:1;22089:15;21953:161;;21740:380;;;:::o;22125:191::-;-1:-1:-1;;;;;22193:26:106;;;22221;;;22189:59;;22260:27;;22257:53;;;22290:18;;:::i;22321:230::-;22391:6;22444:2;22432:9;22423:7;22419:23;22415:32;22412:52;;;22460:1;22457;22450:12;22412:52;-1:-1:-1;22505:16:106;;22321:230;-1:-1:-1;22321:230:106:o;22952:136::-;23030:13;;23052:30;23030:13;23052:30;:::i;23093:1217::-;23268:6;23276;23284;23292;23300;23308;23352:9;23343:7;23339:23;23382:3;23378:2;23374:12;23371:32;;;23399:1;23396;23389:12;23371:32;23423:4;23419:2;23415:13;23412:33;;;23441:1;23438;23431:12;23412:33;;23467:22;;:::i;:::-;23512:37;23539:9;23512:37;:::i;:::-;23505:5;23498:52;23595:2;23584:9;23580:18;23574:25;23608:32;23632:7;23608:32;:::i;:::-;23667:2;23656:14;;23649:31;23725:2;23710:18;;23704:25;23738:32;23704:25;23738:32;:::i;:::-;23797:2;23786:14;;23779:31;23790:5;-1:-1:-1;23853:50:106;23897:4;23882:20;;23853:50;:::i;:::-;23843:60;;23922:49;23966:3;23955:9;23951:19;23922:49;:::i;:::-;23912:59;;23990:49;24034:3;24023:9;24019:19;23990:49;:::i;:::-;23980:59;;24083:3;24072:9;24068:19;24062:26;-1:-1:-1;;;;;24103:6:106;24100:30;24097:50;;;24143:1;24140;24133:12;24097:50;24166:72;24230:7;24221:6;24210:9;24206:22;24166:72;:::i;:::-;24156:82;;;24257:47;24299:3;24288:9;24284:19;24257:47;:::i;:::-;24247:57;;23093:1217;;;;;;;;:::o;24315:370::-;24419:6;24472:2;24460:9;24451:7;24447:23;24443:32;24440:52;;;24488:1;24485;24478:12;24440:52;24521:9;24515:16;-1:-1:-1;;;;;24546:6:106;24543:30;24540:50;;;24586:1;24583;24576:12;24540:50;24609:70;24671:7;24662:6;24651:9;24647:22;24609:70;:::i;24816:518::-;24918:2;24913:3;24910:11;24907:421;;;24954:5;24951:1;24944:16;24998:4;24995:1;24985:18;25068:2;25056:10;25052:19;25049:1;25045:27;25039:4;25035:38;25104:4;25092:10;25089:20;25086:47;;;-1:-1:-1;25127:4:106;25086:47;25182:2;25177:3;25173:12;25170:1;25166:20;25160:4;25156:31;25146:41;;25237:81;25255:2;25248:5;25245:13;25237:81;;;25314:1;25300:16;;25281:1;25270:13;25237:81;;25510:1299;25636:3;25630:10;-1:-1:-1;;;;;25655:6:106;25652:30;25649:56;;;25685:18;;:::i;:::-;25714:97;25804:6;25764:38;25796:4;25790:11;25764:38;:::i;:::-;25758:4;25714:97;:::i;:::-;25860:4;25891:2;25880:14;;25908:1;25903:649;;;;26596:1;26613:6;26610:89;;;-1:-1:-1;26665:19:106;;;26659:26;26610:89;-1:-1:-1;;25467:1:106;25463:11;;;25459:24;25455:29;25445:40;25491:1;25487:11;;;25442:57;26712:81;;25873:930;;25903:649;24763:1;24756:14;;;24800:4;24787:18;;-1:-1:-1;;25939:20:106;;;26057:222;26071:7;26068:1;26065:14;26057:222;;;26153:19;;;26147:26;26132:42;;26260:4;26245:20;;;;26213:1;26201:14;;;;26087:12;26057:222;;;26061:3;26307:6;26298:7;26295:19;26292:201;;;26368:19;;;26362:26;-1:-1:-1;;26451:1:106;26447:14;;;26463:3;26443:24;26439:37;26435:42;26420:58;26405:74;;26292:201;-1:-1:-1;;;;26539:1:106;26523:14;;;26519:22;26506:36;;-1:-1:-1;25510:1299:106:o;26814:289::-;26989:2;26978:9;26971:21;26952:4;27009:45;27050:2;27039:9;27035:18;27027:6;27009:45;:::i;:::-;27001:53;;27090:6;27085:2;27074:9;27070:18;27063:34;26814:289;;;;;:::o;27108:135::-;27147:3;27168:17;;;27165:43;;27188:18;;:::i;:::-;-1:-1:-1;27235:1:106;27224:13;;27108:135::o;27248:393::-;27447:2;27436:9;27429:21;27410:4;27467:45;27508:2;27497:9;27493:18;27485:6;27467:45;:::i;:::-;-1:-1:-1;;;;;27548:32:106;;;;27543:2;27528:18;;27521:60;-1:-1:-1;27629:4:106;27617:17;;;;27612:2;27597:18;;;27590:45;27459:53;27248:393;-1:-1:-1;27248:393:106:o;27951:1111::-;28075:6;28083;28136:2;28124:9;28115:7;28111:23;28107:32;28104:52;;;28152:1;28149;28142:12;28104:52;28184:9;28178:16;28223:1;28216:5;28213:12;28203:40;;28239:1;28236;28229:12;28203:40;28311:2;28296:18;;28290:25;28262:5;;-1:-1:-1;;;;;;28327:30:106;;28324:50;;;28370:1;28367;28360:12;28324:50;28393:22;;28449:4;28431:16;;;28427:27;28424:47;;;28467:1;28464;28457:12;28424:47;28495:22;;:::i;:::-;28547:2;28541:9;28559:33;28584:7;28559:33;:::i;:::-;28601:24;;28684:2;28676:11;;;28670:18;28704:16;;;28697:33;28789:2;28781:11;;;28775:18;28809:16;;;28802:33;28874:2;28866:11;;28860:18;-1:-1:-1;;;;;28890:32:106;;28887:52;;;28935:1;28932;28925:12;28887:52;28973:56;29021:7;29010:8;29006:2;29002:17;28973:56;:::i;:::-;28968:2;28959:7;28955:16;28948:82;;29049:7;29039:17;;;;27951:1111;;;;;:::o;29255:811::-;29628:60;29678:9;29669:6;29663:13;29153:12;;-1:-1:-1;;;;;29149:38:106;29137:51;;29237:4;29226:16;;;29220:23;29204:14;;29197:47;29067:183;29628:60;29744:4;29736:6;29732:17;29726:24;29719:4;29708:9;29704:20;29697:54;29807:4;29799:6;29795:17;29789:24;29782:4;29771:9;29767:20;29760:54;29823:63;29881:3;29870:9;29866:19;29858:6;29153:12;;-1:-1:-1;;;;;29149:38:106;29137:51;;29237:4;29226:16;;;29220:23;29204:14;;29197:47;29067:183;29823:63;-1:-1:-1;;;;;29923:32:106;;29917:3;29902:19;;29895:61;29993:3;29987;29972:19;;29965:32;;;-1:-1:-1;;30014:46:106;;30040:19;;30032:6;30014:46;:::i;31495:717::-;31626:6;31634;31642;31695:2;31683:9;31674:7;31670:23;31666:32;31663:52;;;31711:1;31708;31701:12;31663:52;31743:9;31737:16;31762:31;31787:5;31762:31;:::i;:::-;31861:2;31846:18;;31840:25;31812:5;;-1:-1:-1;;;;;;31877:30:106;;31874:50;;;31920:1;31917;31910:12;31874:50;31943:70;32005:7;31996:6;31985:9;31981:22;31943:70;:::i;:::-;31933:80;;;32059:2;32048:9;32044:18;32038:25;-1:-1:-1;;;;;32078:8:106;32075:32;32072:52;;;32120:1;32117;32110:12;32072:52;32143:63;32198:7;32187:8;32176:9;32172:24;32143:63;:::i;:::-;32133:73;;;31495:717;;;;;:::o;32217:148::-;32305:4;32284:12;;;32298;;;32280:31;;32323:13;;32320:39;;;32339:18;;:::i;33157:269::-;33245:6;33298:2;33286:9;33277:7;33273:23;33269:32;33266:52;;;33314:1;33311;33304:12;33266:52;33346:9;33340:16;33365:31;33390:5;33365:31;:::i;33431:1174::-;33526:6;33579:2;33567:9;33558:7;33554:23;33550:32;33547:52;;;33595:1;33592;33585:12;33547:52;33628:9;33622:16;-1:-1:-1;;;;;33653:6:106;33650:30;33647:50;;;33693:1;33690;33683:12;33647:50;33716:22;;33772:4;33754:16;;;33750:27;33747:47;;;33790:1;33787;33780:12;33747:47;33816:22;;:::i;:::-;33883:9;;33901:22;;33982:2;33974:11;;;33968:18;34002:14;;;33995:31;34065:2;34057:11;;34051:18;-1:-1:-1;;;;;34081:32:106;;34078:52;;;34126:1;34123;34116:12;34078:52;34162:56;34210:7;34199:8;34195:2;34191:17;34162:56;:::i;:::-;34157:2;34150:5;34146:14;34139:80;;34258:2;34254;34250:11;34244:18;-1:-1:-1;;;;;34277:8:106;34274:32;34271:52;;;34319:1;34316;34309:12;34271:52;34355:65;34412:7;34401:8;34397:2;34393:17;34355:65;:::i;:::-;34350:2;34343:5;34339:14;34332:89;;34454:43;34492:3;34488:2;34484:12;34454:43;:::i;:::-;34448:3;34441:5;34437:15;34430:68;34531:43;34569:3;34565:2;34561:12;34531:43;:::i;:::-;34525:3;34514:15;;34507:68;34518:5;33431:1174;-1:-1:-1;;;;33431:1174:106:o;34889:194::-;-1:-1:-1;;;;;34987:26:106;;;34959;;;34955:59;;35026:28;;35023:54;;;35057:18;;:::i;35088:127::-;35149:10;35144:3;35140:20;35137:1;35130:31;35180:4;35177:1;35170:15;35204:4;35201:1;35194:15;35220:120;35260:1;35286;35276:35;;35291:18;;:::i;:::-;-1:-1:-1;35325:9:106;;35220:120::o;35345:112::-;35377:1;35403;35393:35;;35408:18;;:::i;:::-;-1:-1:-1;35442:9:106;;35345:112::o;35462:168::-;35535:9;;;35566;;35583:15;;;35577:22;;35563:37;35553:71;;35604:18;;:::i;36042:301::-;36171:3;36209:6;36203:13;36255:6;36248:4;36240:6;36236:17;36231:3;36225:37;36317:1;36281:16;;36306:13;;;-1:-1:-1;36281:16:106;36042:301;-1:-1:-1;36042:301:106:o',
    linkReferences: {},
    immutableReferences: {
      '3613': [
        { start: 573, length: 32 },
        { start: 1763, length: 32 },
        { start: 2384, length: 32 },
        { start: 3532, length: 32 },
        { start: 9776, length: 32 },
      ],
      '3616': [{ start: 828, length: 32 }],
      '4699': [
        { start: 1155, length: 32 },
        { start: 2922, length: 32 },
      ],
      '57587': [
        { start: 982, length: 32 },
        { start: 3119, length: 32 },
        { start: 4442, length: 32 },
        { start: 4644, length: 32 },
      ],
    },
  },
  methodIdentifiers: {
    'DIRECT_TRANSFER()': '6035b952',
    'REVIEW_EACH_STATUS()': '7a933ab6',
    'allocate(address[],uint256[],bytes,address)': '5fdfa0e0',
    'allocationEndTime()': '4533d678',
    'allocationStartTime()': 'd2e17f59',
    'allowedTokens(address)': 'e744092e',
    'amountAllocated(address,address)': '281bfc39',
    'claimAllocation(bytes)': 'f7f7bbf8',
    'distribute(address[],bytes,address)': '0a6f0ee9',
    'getAllo()': '15cc481e',
    'getPoolAmount()': '4ab4ba42',
    'getPoolId()': '38fff2d0',
    'getRecipient(address)': '62812a39',
    'getStrategyId()': '42fda9c7',
    'increasePoolAmount(uint256)': 'f5b0dfb7',
    'initialize(uint256,bytes)': 'edd146cc',
    'isUsingAllocationMetadata()': 'd565f5fb',
    'metadataRequired()': 'cb0e85a6',
    'payoutSummaries(address)': '385d7aec',
    'recipientIndexToRecipientId(uint256)': '99c64931',
    'recipientsCounter()': '95355b3b',
    'register(address[],bytes,address)': 'facfe313',
    'registrationEndTime()': 'dff7d2c7',
    'registrationStartTime()': '9af5c09d',
    'reviewRecipients((uint256,uint256)[],uint256)': 'f31db3d1',
    'setPayout(bytes)': '03386205',
    'statusesBitMap(uint256)': 'f6f25891',
    'totalPayoutAmount()': 'e7efcfc2',
    'updateAllocationTimestamps(uint64,uint64)': 'ac72a6ba',
    'updatePoolTimestamps(uint64,uint64)': '75777aaa',
    'withdraw(address,uint256,address)': '69328dec',
    'withdrawalCooldown()': 'd6c89c60',
  },
  rawMetadata:
    '{"compiler":{"version":"0.8.28+commit.7893614a"},"language":"Solidity","output":{"abi":[{"inputs":[{"internalType":"address","name":"_allo","type":"address"},{"internalType":"string","name":"_strategyName","type":"string"},{"internalType":"bool","name":"_directTransfer","type":"bool"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[],"name":"ALLOCATION_ACTIVE","type":"error"},{"inputs":[],"name":"ALLOCATION_NOT_ACTIVE","type":"error"},{"inputs":[],"name":"ALLOCATION_NOT_ENDED","type":"error"},{"inputs":[],"name":"ALREADY_INITIALIZED","type":"error"},{"inputs":[],"name":"ANCHOR_ERROR","type":"error"},{"inputs":[],"name":"ARRAY_MISMATCH","type":"error"},{"inputs":[],"name":"AllocationExtension_ALLOCATION_HAS_ALREADY_STARTED","type":"error"},{"inputs":[],"name":"AllocationExtension_ALLOCATION_HAS_ENDED","type":"error"},{"inputs":[],"name":"AllocationExtension_ALLOCATION_HAS_NOT_ENDED","type":"error"},{"inputs":[],"name":"AllocationExtension_ALLOCATION_NOT_ACTIVE","type":"error"},{"inputs":[],"name":"AllocationExtension_INVALID_ALLOCATION_TIMESTAMPS","type":"error"},{"inputs":[],"name":"BaseStrategy_AlreadyInitialized","type":"error"},{"inputs":[],"name":"BaseStrategy_InvalidPoolId","type":"error"},{"inputs":[],"name":"BaseStrategy_Unauthorized","type":"error"},{"inputs":[],"name":"BaseStrategy_WithdrawMoreThanPoolAmount","type":"error"},{"inputs":[],"name":"ETH_MISMATCH","type":"error"},{"inputs":[],"name":"INVALID","type":"error"},{"inputs":[],"name":"INVALID_ADDRESS","type":"error"},{"inputs":[],"name":"INVALID_FEE","type":"error"},{"inputs":[],"name":"INVALID_METADATA","type":"error"},{"inputs":[],"name":"INVALID_REGISTRATION","type":"error"},{"inputs":[],"name":"INVALID_SIGNATURE_LENGTH","type":"error"},{"inputs":[{"internalType":"address","name":"recipientId","type":"address"}],"name":"KickstarterQF_NothingToDistribute","type":"error"},{"inputs":[{"internalType":"address","name":"recipientId","type":"address"}],"name":"KickstarterQF_PayoutAlreadySet","type":"error"},{"inputs":[],"name":"KickstarterQF_PayoutsExceedPoolAmount","type":"error"},{"inputs":[],"name":"KickstarterQF_TokenNotAllowed","type":"error"},{"inputs":[],"name":"MISMATCH","type":"error"},{"inputs":[],"name":"NONCE_NOT_AVAILABLE","type":"error"},{"inputs":[],"name":"NON_ZERO_VALUE","type":"error"},{"inputs":[],"name":"NOT_ENOUGH_FUNDS","type":"error"},{"inputs":[],"name":"NOT_IMPLEMENTED","type":"error"},{"inputs":[],"name":"NOT_INITIALIZED","type":"error"},{"inputs":[],"name":"NOT_PENDING_OWNER","type":"error"},{"inputs":[],"name":"POOL_ACTIVE","type":"error"},{"inputs":[],"name":"POOL_INACTIVE","type":"error"},{"inputs":[],"name":"RECIPIENT_ALREADY_ACCEPTED","type":"error"},{"inputs":[{"internalType":"address","name":"recipientId","type":"address"}],"name":"RECIPIENT_ERROR","type":"error"},{"inputs":[],"name":"RECIPIENT_NOT_ACCEPTED","type":"error"},{"inputs":[],"name":"REGISTRATION_ACTIVE","type":"error"},{"inputs":[],"name":"REGISTRATION_NOT_ACTIVE","type":"error"},{"inputs":[],"name":"RecipientsExtension_InvalidMetada","type":"error"},{"inputs":[{"internalType":"address","name":"recipientId","type":"address"}],"name":"RecipientsExtension_RecipientError","type":"error"},{"inputs":[],"name":"RecipientsExtension_RecipientNotAccepted","type":"error"},{"inputs":[],"name":"RecipientsExtension_RegistrationHasNotEnded","type":"error"},{"inputs":[],"name":"RecipientsExtension_RegistrationNotActive","type":"error"},{"inputs":[],"name":"UNAUTHORIZED","type":"error"},{"inputs":[],"name":"ZERO_ADDRESS","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_recipient","type":"address"},{"indexed":true,"internalType":"address","name":"_sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"_data","type":"bytes"}],"name":"Allocated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"allocationStartTime","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"allocationEndTime","type":"uint64"},{"indexed":false,"internalType":"address","name":"sender","type":"address"}],"name":"AllocationTimestampsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipientId","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"token","type":"address"}],"name":"Claimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_recipient","type":"address"},{"indexed":false,"internalType":"bytes","name":"_data","type":"bytes"}],"name":"Distributed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"poolId","type":"uint256"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"}],"name":"Initialized","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipientId","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"PayoutSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"rowIndex","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fullRow","type":"uint256"},{"indexed":false,"internalType":"address","name":"sender","type":"address"}],"name":"RecipientStatusUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_recipient","type":"address"},{"indexed":false,"internalType":"bytes","name":"_data","type":"bytes"}],"name":"Registered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint64","name":"registrationStartTime","type":"uint64"},{"indexed":false,"internalType":"uint64","name":"registrationEndTime","type":"uint64"},{"indexed":false,"internalType":"address","name":"sender","type":"address"}],"name":"RegistrationTimestampsUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"recipientId","type":"address"},{"indexed":false,"internalType":"bytes","name":"data","type":"bytes"},{"indexed":false,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint8","name":"status","type":"uint8"}],"name":"UpdatedRegistration","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_token","type":"address"},{"indexed":false,"internalType":"uint256","name":"_amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"_recipient","type":"address"}],"name":"Withdrew","type":"event"},{"inputs":[],"name":"DIRECT_TRANSFER","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"REVIEW_EACH_STATUS","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_recipients","type":"address[]"},{"internalType":"uint256[]","name":"_amounts","type":"uint256[]"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"address","name":"_sender","type":"address"}],"name":"allocate","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"allocationEndTime","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"allocationStartTime","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"allowedTokens","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"amountAllocated","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"claimAllocation","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address[]","name":"_recipientIds","type":"address[]"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"address","name":"_sender","type":"address"}],"name":"distribute","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllo","outputs":[{"internalType":"contract IAllo","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPoolAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getPoolId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_recipientId","type":"address"}],"name":"getRecipient","outputs":[{"components":[{"internalType":"bool","name":"useRegistryAnchor","type":"bool"},{"internalType":"address","name":"recipientAddress","type":"address"},{"internalType":"uint64","name":"statusIndex","type":"uint64"},{"components":[{"internalType":"uint256","name":"protocol","type":"uint256"},{"internalType":"string","name":"pointer","type":"string"}],"internalType":"struct Metadata","name":"metadata","type":"tuple"}],"internalType":"struct IRecipientsExtension.Recipient","name":"_recipient","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStrategyId","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"increasePoolAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"__poolId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"isUsingAllocationMetadata","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"metadataRequired","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"payoutSummaries","outputs":[{"internalType":"address","name":"recipientAddress","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"recipientIndexToRecipientId","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"recipientsCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_recipients","type":"address[]"},{"internalType":"bytes","name":"_data","type":"bytes"},{"internalType":"address","name":"_sender","type":"address"}],"name":"register","outputs":[{"internalType":"address[]","name":"_recipientIds","type":"address[]"}],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"registrationEndTime","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"registrationStartTime","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"inputs":[{"components":[{"internalType":"uint256","name":"index","type":"uint256"},{"internalType":"uint256","name":"statusRow","type":"uint256"}],"internalType":"struct IRecipientsExtension.ApplicationStatus[]","name":"_statuses","type":"tuple[]"},{"internalType":"uint256","name":"_refRecipientsCounter","type":"uint256"}],"name":"reviewRecipients","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"setPayout","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"statusesBitMap","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPayoutAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint64","name":"_allocationStartTime","type":"uint64"},{"internalType":"uint64","name":"_allocationEndTime","type":"uint64"}],"name":"updateAllocationTimestamps","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint64","name":"_registrationStartTime","type":"uint64"},{"internalType":"uint64","name":"_registrationEndTime","type":"uint64"}],"name":"updatePoolTimestamps","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_token","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_recipient","type":"address"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"withdrawalCooldown","outputs":[{"internalType":"uint64","name":"","type":"uint64"}],"stateMutability":"view","type":"function"},{"stateMutability":"payable","type":"receive"}],"devdoc":{"errors":{"ANCHOR_ERROR()":[{"details":"Thrown if the anchor creation fails"}],"AllocationExtension_ALLOCATION_HAS_ALREADY_STARTED()":[{"details":"Error thrown when trying to call the function when the allocation has started"}],"AllocationExtension_ALLOCATION_HAS_ENDED()":[{"details":"Error thrown when trying to call the function when the allocation has ended"}],"AllocationExtension_ALLOCATION_HAS_NOT_ENDED()":[{"details":"Error thrown when trying to call the function when the allocation has not ended"}],"AllocationExtension_ALLOCATION_NOT_ACTIVE()":[{"details":"Error thrown when trying to call the function when the allocation is not active"}],"AllocationExtension_INVALID_ALLOCATION_TIMESTAMPS()":[{"details":"Error thrown when the allocation timestamps are invalid"}],"KickstarterQF_NothingToDistribute(address)":[{"params":{"recipientId":"The recipientId to which distribution was attempted."}}],"KickstarterQF_PayoutAlreadySet(address)":[{"params":{"recipientId":"The recipientId to which a repeated payout was attempted."}}],"NONCE_NOT_AVAILABLE()":[{"details":"Thrown when the nonce passed has been used or not available"}],"NOT_PENDING_OWNER()":[{"details":"Thrown when the \'msg.sender\' is not the pending owner on ownership transfer"}],"RECIPIENT_ERROR(address)":[{"params":{"recipientId":"The recipient id associated to the error."}}],"RecipientsExtension_RecipientError(address)":[{"params":{"recipientId":"The recipient id associated to the error."}}]},"events":{"Allocated(address,address,uint256,bytes)":{"params":{"_amount":"The amounts to allocate","_data":"The data to use to allocate to the recipient","_recipient":"The address of the recipient","_sender":"The address of the sender"}},"AllocationTimestampsUpdated(uint64,uint64,address)":{"params":{"allocationEndTime":"The end time for the allocation period","allocationStartTime":"The start time for the allocation period","sender":"The sender of the transaction"}},"Claimed(address,uint256,address)":{"params":{"amount":"The amount of pool tokens claimed","recipientId":"Id of the recipient","token":"The token address of the amount being claimed"}},"Distributed(address,bytes)":{"params":{"_data":"The data to use to distribute to the recipients","_recipient":"The ID of the recipient"}},"Initialized(uint256,bytes)":{"params":{"data":"The data passed to the \'initialize\' function","poolId":"The ID of the pool"}},"PayoutSet(address,uint256)":{"params":{"amount":"The amount of pool tokens set","recipientId":"Id of the recipient"}},"RecipientStatusUpdated(uint256,uint256,address)":{"params":{"fullRow":"The value of the row","rowIndex":"The index of the row in the bitmap","sender":"The sender of the transaction"}},"Registered(address,bytes)":{"params":{"_data":"The data to use to register the recipient","_recipient":"The address of the recipient"}},"RegistrationTimestampsUpdated(uint64,uint64,address)":{"params":{"registrationEndTime":"The end time for the registration","registrationStartTime":"The start time for the registration","sender":"The sender of the transaction"}},"UpdatedRegistration(address,bytes,address,uint8)":{"params":{"data":"The encoded data - (address recipientId, address recipientAddress, Metadata metadata)","recipientId":"Id of the recipient","sender":"The sender of the transaction","status":"The updated status of the recipient"}},"Withdrew(address,uint256,address)":{"params":{"_amount":"The amount to withdraw","_recipient":"The address to withdraw to","_token":"The address of the token"}}},"kind":"dev","methods":{"allocate(address[],uint256[],bytes,address)":{"details":"The encoded \'_data\' will be determined by the strategy implementation. Only \'Allo\' contract can      call this when it is initialized.","params":{"_amounts":"The amounts to allocate to the recipients","_data":"The data to use to allocate to the recipient","_recipients":"The addresses of the recipients to allocate to","_sender":"The address of the sender"}},"claimAllocation(bytes)":{"custom:data":"(Claim[] _claims)","details":"This function is ignored if DIRECT_TRANSFER is enabled, in which case allocated tokens are not stored in the contract for later claim but directly sent to recipients in `_allocate()`.","params":{"_data":"The data to be decoded"}},"constructor":{"params":{"_allo":"The \'Allo\' contract","_directTransfer":"false if allocations must be manually claimed, true if they are sent during allocation.","_strategyName":"The name of the strategy"}},"distribute(address[],bytes,address)":{"details":"The encoded \'_data\' will be determined by the strategy implementation. Only \'Allo\' contract can      call this when it is initialized.","params":{"_data":"The data to use to distribute to the recipients","_recipientIds":"The IDs of the recipients","_sender":"The address of the sender"}},"getAllo()":{"returns":{"_0":"_allo The \'Allo\' contract"}},"getPoolAmount()":{"returns":{"_0":"__poolAmount The balance of the pool"}},"getPoolId()":{"returns":{"_0":"__poolId The ID of the pool"}},"getRecipient(address)":{"params":{"_recipientId":"ID of the recipient"},"returns":{"_recipient":"The recipient details"}},"getStrategyId()":{"returns":{"_0":"_strategyId The ID of the strategy"}},"increasePoolAmount(uint256)":{"details":"Increases the \'_poolAmount\' by \'_amount\'. Only \'Allo\' contract can call this.","params":{"_amount":"The amount to increase the pool by"}},"initialize(uint256,bytes)":{"params":{"__poolId":"The pool id","_data":"custom data to be used to initialize the strategy"}},"register(address[],bytes,address)":{"details":"Registers multiple recipient and returns the IDs of the recipients. The encoded \'_data\' will be determined by the      strategy implementation. Only \'Allo\' contract can call this when it is initialized.","params":{"_data":"The data to use to register the recipient","_recipients":"The addresses of the recipients to register","_sender":"The address of the sender"},"returns":{"_recipientIds":"The recipientIds"}},"reviewRecipients((uint256,uint256)[],uint256)":{"details":"The statuses are stored in a bitmap of 4 bits for each recipient. The first 4 bits of the 256 bits represent      the status of the first recipient, the second 4 bits represent the status of the second recipient, and so on.      \'msg.sender\' must be a pool manager. Statuses: - 0: none - 1: pending - 2: accepted - 3: rejected - 4: appealed - 5: in review - 6: canceled Emits the RecipientStatusUpdated() event.","params":{"_refRecipientsCounter":"the recipientCounter the transaction is based on","_statuses":"new statuses"}},"setPayout(bytes)":{"custom:data":"(address[] _recipientIds, uint256[] _amounts)","params":{"_data":"The data to be decoded"}},"updateAllocationTimestamps(uint64,uint64)":{"details":"The \'msg.sender\' must be a pool manager.","params":{"_allocationEndTime":"The end time for the allocation","_allocationStartTime":"The start time for the allocation"}},"updatePoolTimestamps(uint64,uint64)":{"details":"The \'msg.sender\' must be a pool manager.","params":{"_registrationEndTime":"The end time for the registration","_registrationStartTime":"The start time for the registration"}},"withdraw(address,uint256,address)":{"details":"Withdraws \'_amount\' of \'_token\' to \'_recipient\'","params":{"_amount":"The amount to withdraw","_recipient":"The address to withdraw to","_token":"The address of the token"}}},"version":1},"userdoc":{"errors":{"ALLOCATION_ACTIVE()":[{"notice":"Thrown when the allocation is active."}],"ALLOCATION_NOT_ACTIVE()":[{"notice":"Thrown when the allocation is not active."}],"ALLOCATION_NOT_ENDED()":[{"notice":"Thrown when the allocation is not ended."}],"ALREADY_INITIALIZED()":[{"notice":"Thrown when data is already intialized"}],"ARRAY_MISMATCH()":[{"notice":"Thrown when two arrays length are not equal"}],"BaseStrategy_AlreadyInitialized()":[{"notice":"Error when the strategy is already initialized"}],"BaseStrategy_InvalidPoolId()":[{"notice":"Error when the pool ID is invalid"}],"BaseStrategy_Unauthorized()":[{"notice":"Error when the sender is not authorized"}],"BaseStrategy_WithdrawMoreThanPoolAmount()":[{"notice":"Error when the withdraw amount leaves the pool with insufficient funds"}],"ETH_MISMATCH()":[{"notice":"Thrown when there is a mismatch in ETH needed vs ETH provided"}],"INVALID()":[{"notice":"Thrown as a general error when input / data is invalid"}],"INVALID_ADDRESS()":[{"notice":"Thrown when an invalid address is used"}],"INVALID_FEE()":[{"notice":"Thrown when the fee is below 1e18 which is the fee percentage denominator"}],"INVALID_METADATA()":[{"notice":"Thrown when the metadata is invalid."}],"INVALID_REGISTRATION()":[{"notice":"Thrown when the registration is invalid."}],"INVALID_SIGNATURE_LENGTH()":[{"notice":"Thrown if a signature of a length different than 64 or 65 bytes is passed"}],"KickstarterQF_NothingToDistribute(address)":[{"notice":"Thrown when there is nothing to distribute for the given recipient."}],"KickstarterQF_PayoutAlreadySet(address)":[{"notice":"Thrown when a the payout for a recipient is attempted to be overwritten."}],"KickstarterQF_PayoutsExceedPoolAmount()":[{"notice":"Thrown when the total payout amount is greater than the pool amount."}],"KickstarterQF_TokenNotAllowed()":[{"notice":"Thrown when the token used was not whitelisted."}],"MISMATCH()":[{"notice":"Thrown when mismatch in decoding data"}],"NON_ZERO_VALUE()":[{"notice":"Thrown when the value is non-zero"}],"NOT_ENOUGH_FUNDS()":[{"notice":"Thrown when not enough funds are available"}],"NOT_IMPLEMENTED()":[{"notice":"Thrown when the function is not implemented"}],"NOT_INITIALIZED()":[{"notice":"Thrown when data is yet to be initialized"}],"POOL_ACTIVE()":[{"notice":"Thrown when a pool is already active"}],"POOL_INACTIVE()":[{"notice":"Thrown when a pool is inactive"}],"RECIPIENT_ALREADY_ACCEPTED()":[{"notice":"Thrown when recipient is already accepted."}],"RECIPIENT_ERROR(address)":[{"notice":"Thrown when there is an error in recipient."}],"RECIPIENT_NOT_ACCEPTED()":[{"notice":"Thrown when the recipient is not accepted."}],"REGISTRATION_ACTIVE()":[{"notice":"Thrown when registration is active."}],"REGISTRATION_NOT_ACTIVE()":[{"notice":"Thrown when registration is not active."}],"RecipientsExtension_InvalidMetada()":[{"notice":"Thrown when the metadata is invalid."}],"RecipientsExtension_RecipientError(address)":[{"notice":"Thrown when there is an error in recipient."}],"RecipientsExtension_RecipientNotAccepted()":[{"notice":"Error when the recipient is not accepted"}],"RecipientsExtension_RegistrationHasNotEnded()":[{"notice":"Error when the registration period has not ended"}],"RecipientsExtension_RegistrationNotActive()":[{"notice":"Error when the registration of recipients is not active"}],"UNAUTHORIZED()":[{"notice":"Thrown when user is not authorized"}],"ZERO_ADDRESS()":[{"notice":"Thrown when address is the zero address"}]},"events":{"Allocated(address,address,uint256,bytes)":{"notice":"Emits after recipients got allocated amount"},"AllocationTimestampsUpdated(uint64,uint64,address)":{"notice":"Emitted when the allocation timestamps are updated"},"Claimed(address,uint256,address)":{"notice":"Emitted when a recipient claims the tokens allocated to it"},"Distributed(address,bytes)":{"notice":"Emit after recipients got distributed"},"Initialized(uint256,bytes)":{"notice":"Emits when the pool is initialized"},"PayoutSet(address,uint256)":{"notice":"Emitted when the payout amount for a recipient is set"},"RecipientStatusUpdated(uint256,uint256,address)":{"notice":"Emitted when a recipient is registered and the status is updated"},"Registered(address,bytes)":{"notice":"Emit after recipients get registered"},"RegistrationTimestampsUpdated(uint64,uint64,address)":{"notice":"Emitted when the registration timestamps are updated"},"UpdatedRegistration(address,bytes,address,uint8)":{"notice":"Emitted when a recipient updates their registration"},"Withdrew(address,uint256,address)":{"notice":"Emits after a withdrawal is made"}},"kind":"user","methods":{"DIRECT_TRANSFER()":{"notice":"If true, allocations are directly sent to recipients. Otherwise, they they must be claimed later."},"REVIEW_EACH_STATUS()":{"notice":"if set to true, `_reviewRecipientStatus()` is called for each new status update."},"allocate(address[],uint256[],bytes,address)":{"notice":"Allocates to recipients."},"allocationEndTime()":{"notice":"The end time for allocations"},"allocationStartTime()":{"notice":"The start time for allocations"},"allowedTokens(address)":{"notice":"token -> isAllowed"},"amountAllocated(address,address)":{"notice":"recipientId -> token -> amount"},"claimAllocation(bytes)":{"notice":"Transfers the allocated tokens to recipients."},"constructor":{"notice":"Constructor for the Donation Voting Offchain strategy"},"distribute(address[],bytes,address)":{"notice":"Distributes funds (tokens) to recipients."},"getAllo()":{"notice":"Gets the allo contract"},"getPoolAmount()":{"notice":"Getter for the \'_poolAmount\'."},"getPoolId()":{"notice":"Getter for the \'_poolId\'."},"getRecipient(address)":{"notice":"Get a recipient with a \'_recipientId\'"},"getStrategyId()":{"notice":"Getter for the \'_STRATEGY_ID\'."},"increasePoolAmount(uint256)":{"notice":"Increases the pool amount."},"initialize(uint256,bytes)":{"notice":"Initialize the strategy"},"isUsingAllocationMetadata()":{"notice":"Defines if the strategy is sending Metadata struct in the data parameter"},"metadataRequired()":{"notice":"Flag to indicate whether metadata is required or not."},"payoutSummaries(address)":{"notice":"recipientId -> PayoutSummary"},"recipientIndexToRecipientId(uint256)":{"notice":"\'statusIndex\' of recipient in bitmap => \'recipientId\'."},"recipientsCounter()":{"notice":"The total number of recipients."},"register(address[],bytes,address)":{"notice":"Registers recipients to the strtategy."},"registrationEndTime()":{"notice":"The timestamp in seconds for the end time."},"registrationStartTime()":{"notice":"The timestamp in seconds for the start time."},"reviewRecipients((uint256,uint256)[],uint256)":{"notice":"Sets recipient statuses."},"setPayout(bytes)":{"notice":"Sets the payout amounts to be distributed to."},"statusesBitMap(uint256)":{"notice":"This is a packed array of booleans, \'statuses[0]\' is the first row of the bitmap and allows to store 256 bits to describe the status of 256 projects. \'statuses[1]\' is the second row, and so on Instead of using 1 bit for each recipient status, we will use 4 bits for each status to allow 7 statuses: 0: none 1: pending 2: accepted 3: rejected 4: appealed 5: in review 6: canceled Since it\'s a mapping the storage it\'s pre-allocated with zero values, so if we check the status of an existing recipient, the value is by default 0 (none). If we want to check the status of a recipient, we take its index from the `recipients` array and convert it to the 2-bits position in the bitmap."},"totalPayoutAmount()":{"notice":"amount to be distributed. `totalPayoutAmount` get reduced with each distribution."},"updateAllocationTimestamps(uint64,uint64)":{"notice":"Sets the start and end dates for allocation."},"updatePoolTimestamps(uint64,uint64)":{"notice":"Sets the start and end dates."},"withdraw(address,uint256,address)":{"notice":"Withdraws tokens from the pool."},"withdrawalCooldown()":{"notice":"Cooldown time from allocationEndTime after which the pool manager is allowed to withdraw tokens."}},"version":1}},"settings":{"compilationTarget":{"src/KickstarterQF.sol":"KickstarterQF"},"evmVersion":"cancun","libraries":{},"metadata":{"bytecodeHash":"ipfs"},"optimizer":{"enabled":true,"runs":200},"remappings":[":@openzeppelin/contracts-upgradeable/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/contracts/",":@openzeppelin/contracts/=lib/allo-v2.1/lib/openzeppelin-contracts/contracts/",":@prb/math/=lib/allo-v2.1/lib/v2-core/lib/prb-math/",":@prb/test/=lib/allo-v2.1/lib/v2-core/lib/prb-test/src/",":@sablier/v2-core/=lib/allo-v2.1/lib/v2-core/",":@superfluid-finance/=lib/allo-v2.1/lib/superfluid-protocol-monorepo/packages/",":ERC1155/=lib/allo-v2.1/lib/hats-protocol/lib/ERC1155/",":allo-v2.1/=lib/allo-v2.1/",":ccp-contracts/=lib/ccp-contracts/src/",":contracts/core/=lib/allo-v2.1/contracts/core/",":contracts/strategies/=lib/allo-v2.1/contracts/strategies/",":ds-test/=lib/ccp-contracts/lib/forge-std/lib/ds-test/src/",":eas-contracts/=lib/allo-v2.1/lib/eas-contracts/contracts/",":eas-proxy/=lib/allo-v2.1/lib/eas-proxy/contracts/",":erc4626-tests/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/",":eth-gas-reporter/=lib/ccp-contracts/node_modules/eth-gas-reporter/",":forge-gas-snapshot/=lib/allo-v2.1/lib/permit2/lib/forge-gas-snapshot/src/",":forge-std/=lib/forge-std/src/",":hardhat/=lib/forge-std/src/",":hats-protocol/=lib/allo-v2.1/lib/hats-protocol/",":hedgey-vesting/=lib/allo-v2.1/lib/hedgey-vesting/contracts/",":lib/ERC1155/=lib/allo-v2.1/lib/hats-protocol/lib/ERC1155/",":openzeppelin-contracts-upgradeable/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/",":openzeppelin-contracts/=lib/allo-v2.1/lib/openzeppelin-contracts/",":openzeppelin/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/contracts/",":permit2/=lib/allo-v2.1/lib/permit2/src/interfaces/",":prb-math/=lib/allo-v2.1/lib/v2-core/lib/prb-math/src/",":prb-test/=lib/allo-v2.1/lib/v2-core/lib/prb-test/src/",":solady/=lib/allo-v2.1/lib/solady/src/",":solarray/=lib/allo-v2.1/lib/v2-core/lib/solarray/src/",":solbase/=lib/allo-v2.1/lib/hats-protocol/lib/solbase/src/",":solmate/=lib/allo-v2.1/lib/permit2/lib/solmate/",":strategies/=lib/allo-v2.1/contracts/strategies/",":superfluid-protocol-monorepo/=lib/allo-v2.1/lib/superfluid-protocol-monorepo/packages/solidity-semantic-money/src/",":test/utils/=lib/allo-v2.1/test/utils/",":utils/=lib/allo-v2.1/lib/hats-protocol/lib/utils/",":v2-core/=lib/allo-v2.1/lib/v2-core/"]},"sources":{"lib/allo-v2.1/contracts/core/interfaces/IAllo.sol":{"keccak256":"0xddbabde86678d1cdaa9976bc1c6db2a31d39495b934bd7dd8554cca9a751f900","license":"AGPL-3.0-only","urls":["bzz-raw://3c10fe982959d9d804161f332bc06cdc5dd00e7aaf7f8ee1a373733caba95a25","dweb:/ipfs/QmZg4RpyMzyJe4MiPai7ZzsvP13MeEeHqxsXkDaJVqgKLG"]},"lib/allo-v2.1/contracts/core/interfaces/IDAI.sol":{"keccak256":"0xc359eefa79dabf5e283f35794ba4f297f447d2092b0c7e38fd74f32a5d1bd485","license":"AGPL-3.0-only","urls":["bzz-raw://1231b6fa8a18642111ecdc7eeb2ded4d2f343b61ff2cab4a3137be6bbeb56ab2","dweb:/ipfs/QmUQYBvAi4RQEtxS9CBmHQfnwLrN8cpvbjmZEKPJ9pMzAi"]},"lib/allo-v2.1/contracts/core/interfaces/IRegistry.sol":{"keccak256":"0xcd47a891d6080a5f274e9d6356d62c50bc44e5e67703ce4160aeef46e784e38a","license":"MIT","urls":["bzz-raw://759246c28d8e7441e74d41a42fcbf31a432bc578aae0507e9138db85baf751d0","dweb:/ipfs/QmbdaiYCWi2HN7NA98Gxb2vXCC7KgZeBFpkZbQpZyYBeF7"]},"lib/allo-v2.1/contracts/core/libraries/Errors.sol":{"keccak256":"0x6b90e98e8b65fe8f32557b6a9cb431bf96b909756877048247be5cb3c2018150","license":"AGPL-3.0-only","urls":["bzz-raw://8a3e2117a897527a34b29b691cef914f0d2a4e79113294771e05ce840e5bf06b","dweb:/ipfs/QmX3a5eyKq119LxyRM9jh3w3gCWgZP1xSvYiyBqFXemeqb"]},"lib/allo-v2.1/contracts/core/libraries/Metadata.sol":{"keccak256":"0x41ece5b83f50d180841f44324a883e12b3fc2005e425e4cd51944fb8d46b147f","license":"AGPL-3.0-only","urls":["bzz-raw://ecd926cbce88398d6fdb1762f7b75617635ae866f8461b7fb32dd2b0a17273ce","dweb:/ipfs/QmdvPsL48GbXV2hy4vDcW9XtkN7VUTDebtYihuj7ZxhaD7"]},"lib/allo-v2.1/contracts/core/libraries/Transfer.sol":{"keccak256":"0x0046ac6e0dd29f15da158e749bb928134e97d92880a89f9159de6bdadeee0d4a","license":"AGPL-3.0-only","urls":["bzz-raw://ef6c48009f97cf1a453fdd446a732565e66844de9b019c1259f2c5894ee33959","dweb:/ipfs/QmSnHz2YKMmxrkLZdcyf2A6Z1shQWcK2cNrWqaHcYjX8bS"]},"lib/allo-v2.1/contracts/strategies/BaseStrategy.sol":{"keccak256":"0x9e10b6af836b71f010a626a198e487401b89fab52bd731b4a3f13bdc66b7e586","license":"AGPL-3.0-only","urls":["bzz-raw://069a797f918907f073a14fe3eedb784a06debe7e484f6fb96d5918decb19a1e4","dweb:/ipfs/QmXSj4x9ZvFCeMgw4XBZsftb8mJcrcEvkXXEkLaWta85pw"]},"lib/allo-v2.1/contracts/strategies/IBaseStrategy.sol":{"keccak256":"0x48f8d5ee56b2eb03c2f3214407d740651ccb87a9c9f8328dfc9a158d6796ddef","license":"AGPL-3.0-only","urls":["bzz-raw://f1eb7e8922b2752fbfa4377cfe1ce2069d6f04d47d68388a2705b9f3273c1d82","dweb:/ipfs/QmPqq8sVjxZRdtSDaik5XwHkVvsvg772PLgUYJa9hmFrGV"]},"lib/allo-v2.1/contracts/strategies/extensions/allocate/AllocationExtension.sol":{"keccak256":"0xcedff137dcc55f611c48af954f6d07366721cb74f2cdc1f113dc4bc436bd094a","license":"AGPL-3.0-only","urls":["bzz-raw://70ab3b48535c8090711e8a2c600101c45d357976c31a2f9ef1ee97cdd1b6bd31","dweb:/ipfs/QmbRZ2QbRqe1rgg88wwrbXF6G9gwXaqefmjYCrFhUQo4kM"]},"lib/allo-v2.1/contracts/strategies/extensions/allocate/IAllocationExtension.sol":{"keccak256":"0x724c0cf3cf80fa503fda1c027682765e5f209341a652d93dc39fe77d095b4c84","license":"AGPL-3.0-only","urls":["bzz-raw://becb6fc54bb213d912b7cc81efc28bf90e15d4ba3e05d7dcdba934b89b0b4b04","dweb:/ipfs/QmT4vwRCzzktoJMX1aUnNDYS7hTW9bGr44cuF28xzbFYyD"]},"lib/allo-v2.1/contracts/strategies/extensions/register/IRecipientsExtension.sol":{"keccak256":"0xbe40738cb068bb32fbc8d75fe23e37328e87fedb45d7acbf3bbac1810a307cf1","license":"AGPL-3.0-only","urls":["bzz-raw://c6d0c0f4cfad55baca810d22d501113781f65958d4b832f91eab39cab87b7899","dweb:/ipfs/QmaqTqYwbjhF1KibbisSvrKri9fqvo6zqkUAQntQuEs3WD"]},"lib/allo-v2.1/contracts/strategies/extensions/register/RecipientsExtension.sol":{"keccak256":"0xc98c2ad99027546b0d0a773423f9a829e0bd6fe4f16184c0bb5bc28ad86815ed","license":"AGPL-3.0-only","urls":["bzz-raw://2baf8cc495ad90fc08f07831af66568aa9a5f1d2f6907a5cc02339b2717a0d29","dweb:/ipfs/QmWUN2xJoNfhjpgEM8tRw2oKmJ8CVajBJVJdRN6rtsCHUX"]},"lib/allo-v2.1/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol":{"keccak256":"0x287b55befed2961a7eabd7d7b1b2839cbca8a5b80ef8dcbb25ed3d4c2002c305","license":"MIT","urls":["bzz-raw://bd39944e8fc06be6dbe2dd1d8449b5336e23c6a7ba3e8e9ae5ae0f37f35283f5","dweb:/ipfs/QmPV3FGYjVwvKSgAXKUN3r9T9GwniZz83CxBpM7vyj2G53"]},"lib/allo-v2.1/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol":{"keccak256":"0xec63854014a5b4f2b3290ab9103a21bdf902a508d0f41a8573fea49e98bf571a","license":"MIT","urls":["bzz-raw://bc5b5dc12fbc4002f282eaa7a5f06d8310ed62c1c77c5770f6283e058454c39a","dweb:/ipfs/Qme9rE2wS3yBuyJq9GgbmzbsBQsW2M2sVFqYYLw7bosGrv"]},"lib/allo-v2.1/lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol":{"keccak256":"0xabefac93435967b4d36a4fabcbdbb918d1f0b7ae3c3d85bc30923b326c927ed1","license":"MIT","urls":["bzz-raw://9d213d3befca47da33f6db0310826bcdb148299805c10d77175ecfe1d06a9a68","dweb:/ipfs/QmRgCn6SP1hbBkExUADFuDo8xkT4UU47yjNF5FhCeRbQmS"]},"lib/allo-v2.1/lib/openzeppelin-contracts/contracts/utils/Address.sol":{"keccak256":"0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa","license":"MIT","urls":["bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931","dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm"]},"lib/allo-v2.1/lib/permit2/src/interfaces/IEIP712.sol":{"keccak256":"0xea70db68ce450ad38dfbd490058595441144808eb95272ae9b89e3fbe6456954","license":"MIT","urls":["bzz-raw://e8fad9ff319665acdc2f1295bb82db3e5b4d52babc0b58f147dbdbb9f322c6e5","dweb:/ipfs/QmTbYJPcux8eJ3qGVYQh6TiwCA2FPu6HXTUg6QFTnX91Ks"]},"lib/allo-v2.1/lib/permit2/src/interfaces/ISignatureTransfer.sol":{"keccak256":"0x6805563eaad92471fa1b3591a71d7020a93e59f1a4ac95398daf74927f5bd033","license":"MIT","urls":["bzz-raw://48cd13806cb8e82dcc38eb93423a372fbdd3b05364ecebb8bfd9cd29078dd90c","dweb:/ipfs/QmeLyFVrzKRHcm6aaFFBCG5mFESCqWLp1KYT41H8XhzMCp"]},"lib/allo-v2.1/lib/solady/src/utils/SafeTransferLib.sol":{"keccak256":"0x06d3261d13cf5a08f9bcda05e17be0a6a0380193116298fdf8eabf9bf80d3624","license":"MIT","urls":["bzz-raw://96965a8a2b1bd2d6cff4a8f78bcb33b0de8848834f8e4be28c03609ae08e9298","dweb:/ipfs/QmSoNDxaEozMZgNdVEygfEvnk26Tu4UeFeapvtMsoUFftt"]},"src/KickstarterQF.sol":{"keccak256":"0x8dc5b3c6a8334978f1160307d256e5c5fc0b2232c4860b37b077412d4bc48079","license":"MIT","urls":["bzz-raw://bad4d8f9f31d714b59149d2e6ede8c6e3f4de5f46a17c3cfd48ce1c2bcc50672","dweb:/ipfs/QmX3UstU7kcZ7CF51PxvF2n3uTTeam5dCUWgVgFnT75uox"]},"src/interfaces/ITreasury.sol":{"keccak256":"0x10e8910a2de9d441255ac5b48fb5a3c3a21cb7dbd308f61bde85fbfc30fded7b","license":"MIT","urls":["bzz-raw://41b766ab2f335da160177702b77f1ab668ae34695f4a48fded6e9dac1f56914f","dweb:/ipfs/QmRAEyovgpLKgV9D7zARtSoi8AdheN3jUabiZwg1RnGscv"]}},"version":1}',
  metadata: {
    compiler: { version: '0.8.28+commit.7893614a' },
    language: 'Solidity',
    output: {
      abi: [
        {
          inputs: [
            { internalType: 'address', name: '_allo', type: 'address' },
            {
              internalType: 'string',
              name: '_strategyName',
              type: 'string',
            },
            {
              internalType: 'bool',
              name: '_directTransfer',
              type: 'bool',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'constructor',
        },
        { inputs: [], type: 'error', name: 'ALLOCATION_ACTIVE' },
        { inputs: [], type: 'error', name: 'ALLOCATION_NOT_ACTIVE' },
        { inputs: [], type: 'error', name: 'ALLOCATION_NOT_ENDED' },
        { inputs: [], type: 'error', name: 'ALREADY_INITIALIZED' },
        { inputs: [], type: 'error', name: 'ANCHOR_ERROR' },
        { inputs: [], type: 'error', name: 'ARRAY_MISMATCH' },
        {
          inputs: [],
          type: 'error',
          name: 'AllocationExtension_ALLOCATION_HAS_ALREADY_STARTED',
        },
        {
          inputs: [],
          type: 'error',
          name: 'AllocationExtension_ALLOCATION_HAS_ENDED',
        },
        {
          inputs: [],
          type: 'error',
          name: 'AllocationExtension_ALLOCATION_HAS_NOT_ENDED',
        },
        {
          inputs: [],
          type: 'error',
          name: 'AllocationExtension_ALLOCATION_NOT_ACTIVE',
        },
        {
          inputs: [],
          type: 'error',
          name: 'AllocationExtension_INVALID_ALLOCATION_TIMESTAMPS',
        },
        {
          inputs: [],
          type: 'error',
          name: 'BaseStrategy_AlreadyInitialized',
        },
        { inputs: [], type: 'error', name: 'BaseStrategy_InvalidPoolId' },
        { inputs: [], type: 'error', name: 'BaseStrategy_Unauthorized' },
        {
          inputs: [],
          type: 'error',
          name: 'BaseStrategy_WithdrawMoreThanPoolAmount',
        },
        { inputs: [], type: 'error', name: 'ETH_MISMATCH' },
        { inputs: [], type: 'error', name: 'INVALID' },
        { inputs: [], type: 'error', name: 'INVALID_ADDRESS' },
        { inputs: [], type: 'error', name: 'INVALID_FEE' },
        { inputs: [], type: 'error', name: 'INVALID_METADATA' },
        { inputs: [], type: 'error', name: 'INVALID_REGISTRATION' },
        { inputs: [], type: 'error', name: 'INVALID_SIGNATURE_LENGTH' },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipientId',
              type: 'address',
            },
          ],
          type: 'error',
          name: 'KickstarterQF_NothingToDistribute',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipientId',
              type: 'address',
            },
          ],
          type: 'error',
          name: 'KickstarterQF_PayoutAlreadySet',
        },
        {
          inputs: [],
          type: 'error',
          name: 'KickstarterQF_PayoutsExceedPoolAmount',
        },
        {
          inputs: [],
          type: 'error',
          name: 'KickstarterQF_TokenNotAllowed',
        },
        { inputs: [], type: 'error', name: 'MISMATCH' },
        { inputs: [], type: 'error', name: 'NONCE_NOT_AVAILABLE' },
        { inputs: [], type: 'error', name: 'NON_ZERO_VALUE' },
        { inputs: [], type: 'error', name: 'NOT_ENOUGH_FUNDS' },
        { inputs: [], type: 'error', name: 'NOT_IMPLEMENTED' },
        { inputs: [], type: 'error', name: 'NOT_INITIALIZED' },
        { inputs: [], type: 'error', name: 'NOT_PENDING_OWNER' },
        { inputs: [], type: 'error', name: 'POOL_ACTIVE' },
        { inputs: [], type: 'error', name: 'POOL_INACTIVE' },
        { inputs: [], type: 'error', name: 'RECIPIENT_ALREADY_ACCEPTED' },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipientId',
              type: 'address',
            },
          ],
          type: 'error',
          name: 'RECIPIENT_ERROR',
        },
        { inputs: [], type: 'error', name: 'RECIPIENT_NOT_ACCEPTED' },
        { inputs: [], type: 'error', name: 'REGISTRATION_ACTIVE' },
        { inputs: [], type: 'error', name: 'REGISTRATION_NOT_ACTIVE' },
        {
          inputs: [],
          type: 'error',
          name: 'RecipientsExtension_InvalidMetada',
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipientId',
              type: 'address',
            },
          ],
          type: 'error',
          name: 'RecipientsExtension_RecipientError',
        },
        {
          inputs: [],
          type: 'error',
          name: 'RecipientsExtension_RecipientNotAccepted',
        },
        {
          inputs: [],
          type: 'error',
          name: 'RecipientsExtension_RegistrationHasNotEnded',
        },
        {
          inputs: [],
          type: 'error',
          name: 'RecipientsExtension_RegistrationNotActive',
        },
        { inputs: [], type: 'error', name: 'UNAUTHORIZED' },
        { inputs: [], type: 'error', name: 'ZERO_ADDRESS' },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_recipient',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'address',
              name: '_sender',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Allocated',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint64',
              name: 'allocationStartTime',
              type: 'uint64',
              indexed: false,
            },
            {
              internalType: 'uint64',
              name: 'allocationEndTime',
              type: 'uint64',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'AllocationTimestampsUpdated',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipientId',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'token',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Claimed',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_recipient',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Distributed',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'poolId',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Initialized',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipientId',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'amount',
              type: 'uint256',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'PayoutSet',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: 'rowIndex',
              type: 'uint256',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: 'fullRow',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'RecipientStatusUpdated',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_recipient',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'bytes',
              name: '_data',
              type: 'bytes',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Registered',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'uint64',
              name: 'registrationStartTime',
              type: 'uint64',
              indexed: false,
            },
            {
              internalType: 'uint64',
              name: 'registrationEndTime',
              type: 'uint64',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'RegistrationTimestampsUpdated',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: 'recipientId',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'bytes',
              name: 'data',
              type: 'bytes',
              indexed: false,
            },
            {
              internalType: 'address',
              name: 'sender',
              type: 'address',
              indexed: false,
            },
            {
              internalType: 'uint8',
              name: 'status',
              type: 'uint8',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'UpdatedRegistration',
          anonymous: false,
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_token',
              type: 'address',
              indexed: true,
            },
            {
              internalType: 'uint256',
              name: '_amount',
              type: 'uint256',
              indexed: false,
            },
            {
              internalType: 'address',
              name: '_recipient',
              type: 'address',
              indexed: false,
            },
          ],
          type: 'event',
          name: 'Withdrew',
          anonymous: false,
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'DIRECT_TRANSFER',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'REVIEW_EACH_STATUS',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_recipients',
              type: 'address[]',
            },
            {
              internalType: 'uint256[]',
              name: '_amounts',
              type: 'uint256[]',
            },
            { internalType: 'bytes', name: '_data', type: 'bytes' },
            { internalType: 'address', name: '_sender', type: 'address' },
          ],
          stateMutability: 'payable',
          type: 'function',
          name: 'allocate',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'allocationEndTime',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'allocationStartTime',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        },
        {
          inputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
          name: 'allowedTokens',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        },
        {
          inputs: [
            { internalType: 'address', name: '', type: 'address' },
            { internalType: 'address', name: '', type: 'address' },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'amountAllocated',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [{ internalType: 'bytes', name: '_data', type: 'bytes' }],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'claimAllocation',
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_recipientIds',
              type: 'address[]',
            },
            { internalType: 'bytes', name: '_data', type: 'bytes' },
            { internalType: 'address', name: '_sender', type: 'address' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'distribute',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'getAllo',
          outputs: [
            { internalType: 'contract IAllo', name: '', type: 'address' },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'getPoolAmount',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'getPoolId',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [
            {
              internalType: 'address',
              name: '_recipientId',
              type: 'address',
            },
          ],
          stateMutability: 'view',
          type: 'function',
          name: 'getRecipient',
          outputs: [
            {
              internalType: 'struct IRecipientsExtension.Recipient',
              name: '_recipient',
              type: 'tuple',
              components: [
                {
                  internalType: 'bool',
                  name: 'useRegistryAnchor',
                  type: 'bool',
                },
                {
                  internalType: 'address',
                  name: 'recipientAddress',
                  type: 'address',
                },
                {
                  internalType: 'uint64',
                  name: 'statusIndex',
                  type: 'uint64',
                },
                {
                  internalType: 'struct Metadata',
                  name: 'metadata',
                  type: 'tuple',
                  components: [
                    {
                      internalType: 'uint256',
                      name: 'protocol',
                      type: 'uint256',
                    },
                    {
                      internalType: 'string',
                      name: 'pointer',
                      type: 'string',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'getStrategyId',
          outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        },
        {
          inputs: [
            { internalType: 'uint256', name: '_amount', type: 'uint256' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'increasePoolAmount',
        },
        {
          inputs: [
            {
              internalType: 'uint256',
              name: '__poolId',
              type: 'uint256',
            },
            { internalType: 'bytes', name: '_data', type: 'bytes' },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'initialize',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'isUsingAllocationMetadata',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'metadataRequired',
          outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        },
        {
          inputs: [{ internalType: 'address', name: '', type: 'address' }],
          stateMutability: 'view',
          type: 'function',
          name: 'payoutSummaries',
          outputs: [
            {
              internalType: 'address',
              name: 'recipientAddress',
              type: 'address',
            },
            { internalType: 'uint256', name: 'amount', type: 'uint256' },
          ],
        },
        {
          inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
          name: 'recipientIndexToRecipientId',
          outputs: [{ internalType: 'address', name: '', type: 'address' }],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'recipientsCounter',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [
            {
              internalType: 'address[]',
              name: '_recipients',
              type: 'address[]',
            },
            { internalType: 'bytes', name: '_data', type: 'bytes' },
            { internalType: 'address', name: '_sender', type: 'address' },
          ],
          stateMutability: 'payable',
          type: 'function',
          name: 'register',
          outputs: [
            {
              internalType: 'address[]',
              name: '_recipientIds',
              type: 'address[]',
            },
          ],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'registrationEndTime',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'registrationStartTime',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        },
        {
          inputs: [
            {
              internalType: 'struct IRecipientsExtension.ApplicationStatus[]',
              name: '_statuses',
              type: 'tuple[]',
              components: [
                {
                  internalType: 'uint256',
                  name: 'index',
                  type: 'uint256',
                },
                {
                  internalType: 'uint256',
                  name: 'statusRow',
                  type: 'uint256',
                },
              ],
            },
            {
              internalType: 'uint256',
              name: '_refRecipientsCounter',
              type: 'uint256',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'reviewRecipients',
        },
        {
          inputs: [{ internalType: 'bytes', name: '_data', type: 'bytes' }],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'setPayout',
        },
        {
          inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
          stateMutability: 'view',
          type: 'function',
          name: 'statusesBitMap',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'totalPayoutAmount',
          outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
        },
        {
          inputs: [
            {
              internalType: 'uint64',
              name: '_allocationStartTime',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: '_allocationEndTime',
              type: 'uint64',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'updateAllocationTimestamps',
        },
        {
          inputs: [
            {
              internalType: 'uint64',
              name: '_registrationStartTime',
              type: 'uint64',
            },
            {
              internalType: 'uint64',
              name: '_registrationEndTime',
              type: 'uint64',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'updatePoolTimestamps',
        },
        {
          inputs: [
            { internalType: 'address', name: '_token', type: 'address' },
            { internalType: 'uint256', name: '_amount', type: 'uint256' },
            {
              internalType: 'address',
              name: '_recipient',
              type: 'address',
            },
          ],
          stateMutability: 'nonpayable',
          type: 'function',
          name: 'withdraw',
        },
        {
          inputs: [],
          stateMutability: 'view',
          type: 'function',
          name: 'withdrawalCooldown',
          outputs: [{ internalType: 'uint64', name: '', type: 'uint64' }],
        },
        { inputs: [], stateMutability: 'payable', type: 'receive' },
      ],
      devdoc: {
        kind: 'dev',
        methods: {
          'allocate(address[],uint256[],bytes,address)': {
            details:
              "The encoded '_data' will be determined by the strategy implementation. Only 'Allo' contract can      call this when it is initialized.",
            params: {
              _amounts: 'The amounts to allocate to the recipients',
              _data: 'The data to use to allocate to the recipient',
              _recipients: 'The addresses of the recipients to allocate to',
              _sender: 'The address of the sender',
            },
          },
          'claimAllocation(bytes)': {
            'custom:data': '(Claim[] _claims)',
            details:
              'This function is ignored if DIRECT_TRANSFER is enabled, in which case allocated tokens are not stored in the contract for later claim but directly sent to recipients in `_allocate()`.',
            params: { _data: 'The data to be decoded' },
          },
          constructor: {
            params: {
              _allo: "The 'Allo' contract",
              _directTransfer:
                'false if allocations must be manually claimed, true if they are sent during allocation.',
              _strategyName: 'The name of the strategy',
            },
          },
          'distribute(address[],bytes,address)': {
            details:
              "The encoded '_data' will be determined by the strategy implementation. Only 'Allo' contract can      call this when it is initialized.",
            params: {
              _data: 'The data to use to distribute to the recipients',
              _recipientIds: 'The IDs of the recipients',
              _sender: 'The address of the sender',
            },
          },
          'getAllo()': { returns: { _0: "_allo The 'Allo' contract" } },
          'getPoolAmount()': {
            returns: { _0: '__poolAmount The balance of the pool' },
          },
          'getPoolId()': { returns: { _0: '__poolId The ID of the pool' } },
          'getRecipient(address)': {
            params: { _recipientId: 'ID of the recipient' },
            returns: { _recipient: 'The recipient details' },
          },
          'getStrategyId()': {
            returns: { _0: '_strategyId The ID of the strategy' },
          },
          'increasePoolAmount(uint256)': {
            details:
              "Increases the '_poolAmount' by '_amount'. Only 'Allo' contract can call this.",
            params: { _amount: 'The amount to increase the pool by' },
          },
          'initialize(uint256,bytes)': {
            params: {
              __poolId: 'The pool id',
              _data: 'custom data to be used to initialize the strategy',
            },
          },
          'register(address[],bytes,address)': {
            details:
              "Registers multiple recipient and returns the IDs of the recipients. The encoded '_data' will be determined by the      strategy implementation. Only 'Allo' contract can call this when it is initialized.",
            params: {
              _data: 'The data to use to register the recipient',
              _recipients: 'The addresses of the recipients to register',
              _sender: 'The address of the sender',
            },
            returns: { _recipientIds: 'The recipientIds' },
          },
          'reviewRecipients((uint256,uint256)[],uint256)': {
            details:
              "The statuses are stored in a bitmap of 4 bits for each recipient. The first 4 bits of the 256 bits represent      the status of the first recipient, the second 4 bits represent the status of the second recipient, and so on.      'msg.sender' must be a pool manager. Statuses: - 0: none - 1: pending - 2: accepted - 3: rejected - 4: appealed - 5: in review - 6: canceled Emits the RecipientStatusUpdated() event.",
            params: {
              _refRecipientsCounter:
                'the recipientCounter the transaction is based on',
              _statuses: 'new statuses',
            },
          },
          'setPayout(bytes)': {
            'custom:data': '(address[] _recipientIds, uint256[] _amounts)',
            params: { _data: 'The data to be decoded' },
          },
          'updateAllocationTimestamps(uint64,uint64)': {
            details: "The 'msg.sender' must be a pool manager.",
            params: {
              _allocationEndTime: 'The end time for the allocation',
              _allocationStartTime: 'The start time for the allocation',
            },
          },
          'updatePoolTimestamps(uint64,uint64)': {
            details: "The 'msg.sender' must be a pool manager.",
            params: {
              _registrationEndTime: 'The end time for the registration',
              _registrationStartTime: 'The start time for the registration',
            },
          },
          'withdraw(address,uint256,address)': {
            details: "Withdraws '_amount' of '_token' to '_recipient'",
            params: {
              _amount: 'The amount to withdraw',
              _recipient: 'The address to withdraw to',
              _token: 'The address of the token',
            },
          },
        },
        version: 1,
      },
      userdoc: {
        kind: 'user',
        methods: {
          'DIRECT_TRANSFER()': {
            notice:
              'If true, allocations are directly sent to recipients. Otherwise, they they must be claimed later.',
          },
          'REVIEW_EACH_STATUS()': {
            notice:
              'if set to true, `_reviewRecipientStatus()` is called for each new status update.',
          },
          'allocate(address[],uint256[],bytes,address)': {
            notice: 'Allocates to recipients.',
          },
          'allocationEndTime()': { notice: 'The end time for allocations' },
          'allocationStartTime()': {
            notice: 'The start time for allocations',
          },
          'allowedTokens(address)': { notice: 'token -> isAllowed' },
          'amountAllocated(address,address)': {
            notice: 'recipientId -> token -> amount',
          },
          'claimAllocation(bytes)': {
            notice: 'Transfers the allocated tokens to recipients.',
          },
          constructor: {
            notice: 'Constructor for the Donation Voting Offchain strategy',
          },
          'distribute(address[],bytes,address)': {
            notice: 'Distributes funds (tokens) to recipients.',
          },
          'getAllo()': { notice: 'Gets the allo contract' },
          'getPoolAmount()': { notice: "Getter for the '_poolAmount'." },
          'getPoolId()': { notice: "Getter for the '_poolId'." },
          'getRecipient(address)': {
            notice: "Get a recipient with a '_recipientId'",
          },
          'getStrategyId()': { notice: "Getter for the '_STRATEGY_ID'." },
          'increasePoolAmount(uint256)': {
            notice: 'Increases the pool amount.',
          },
          'initialize(uint256,bytes)': { notice: 'Initialize the strategy' },
          'isUsingAllocationMetadata()': {
            notice:
              'Defines if the strategy is sending Metadata struct in the data parameter',
          },
          'metadataRequired()': {
            notice: 'Flag to indicate whether metadata is required or not.',
          },
          'payoutSummaries(address)': {
            notice: 'recipientId -> PayoutSummary',
          },
          'recipientIndexToRecipientId(uint256)': {
            notice: "'statusIndex' of recipient in bitmap => 'recipientId'.",
          },
          'recipientsCounter()': {
            notice: 'The total number of recipients.',
          },
          'register(address[],bytes,address)': {
            notice: 'Registers recipients to the strtategy.',
          },
          'registrationEndTime()': {
            notice: 'The timestamp in seconds for the end time.',
          },
          'registrationStartTime()': {
            notice: 'The timestamp in seconds for the start time.',
          },
          'reviewRecipients((uint256,uint256)[],uint256)': {
            notice: 'Sets recipient statuses.',
          },
          'setPayout(bytes)': {
            notice: 'Sets the payout amounts to be distributed to.',
          },
          'statusesBitMap(uint256)': {
            notice:
              "This is a packed array of booleans, 'statuses[0]' is the first row of the bitmap and allows to store 256 bits to describe the status of 256 projects. 'statuses[1]' is the second row, and so on Instead of using 1 bit for each recipient status, we will use 4 bits for each status to allow 7 statuses: 0: none 1: pending 2: accepted 3: rejected 4: appealed 5: in review 6: canceled Since it's a mapping the storage it's pre-allocated with zero values, so if we check the status of an existing recipient, the value is by default 0 (none). If we want to check the status of a recipient, we take its index from the `recipients` array and convert it to the 2-bits position in the bitmap.",
          },
          'totalPayoutAmount()': {
            notice:
              'amount to be distributed. `totalPayoutAmount` get reduced with each distribution.',
          },
          'updateAllocationTimestamps(uint64,uint64)': {
            notice: 'Sets the start and end dates for allocation.',
          },
          'updatePoolTimestamps(uint64,uint64)': {
            notice: 'Sets the start and end dates.',
          },
          'withdraw(address,uint256,address)': {
            notice: 'Withdraws tokens from the pool.',
          },
          'withdrawalCooldown()': {
            notice:
              'Cooldown time from allocationEndTime after which the pool manager is allowed to withdraw tokens.',
          },
        },
        version: 1,
      },
    },
    settings: {
      remappings: [
        '@openzeppelin/contracts-upgradeable/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/contracts/',
        '@openzeppelin/contracts/=lib/allo-v2.1/lib/openzeppelin-contracts/contracts/',
        '@prb/math/=lib/allo-v2.1/lib/v2-core/lib/prb-math/',
        '@prb/test/=lib/allo-v2.1/lib/v2-core/lib/prb-test/src/',
        '@sablier/v2-core/=lib/allo-v2.1/lib/v2-core/',
        '@superfluid-finance/=lib/allo-v2.1/lib/superfluid-protocol-monorepo/packages/',
        'ERC1155/=lib/allo-v2.1/lib/hats-protocol/lib/ERC1155/',
        'allo-v2.1/=lib/allo-v2.1/',
        'ccp-contracts/=lib/ccp-contracts/src/',
        'contracts/core/=lib/allo-v2.1/contracts/core/',
        'contracts/strategies/=lib/allo-v2.1/contracts/strategies/',
        'ds-test/=lib/ccp-contracts/lib/forge-std/lib/ds-test/src/',
        'eas-contracts/=lib/allo-v2.1/lib/eas-contracts/contracts/',
        'eas-proxy/=lib/allo-v2.1/lib/eas-proxy/contracts/',
        'erc4626-tests/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/lib/erc4626-tests/',
        'eth-gas-reporter/=lib/ccp-contracts/node_modules/eth-gas-reporter/',
        'forge-gas-snapshot/=lib/allo-v2.1/lib/permit2/lib/forge-gas-snapshot/src/',
        'forge-std/=lib/forge-std/src/',
        'hardhat/=lib/forge-std/src/',
        'hats-protocol/=lib/allo-v2.1/lib/hats-protocol/',
        'hedgey-vesting/=lib/allo-v2.1/lib/hedgey-vesting/contracts/',
        'lib/ERC1155/=lib/allo-v2.1/lib/hats-protocol/lib/ERC1155/',
        'openzeppelin-contracts-upgradeable/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/',
        'openzeppelin-contracts/=lib/allo-v2.1/lib/openzeppelin-contracts/',
        'openzeppelin/=lib/allo-v2.1/lib/openzeppelin-contracts-upgradeable/contracts/',
        'permit2/=lib/allo-v2.1/lib/permit2/src/interfaces/',
        'prb-math/=lib/allo-v2.1/lib/v2-core/lib/prb-math/src/',
        'prb-test/=lib/allo-v2.1/lib/v2-core/lib/prb-test/src/',
        'solady/=lib/allo-v2.1/lib/solady/src/',
        'solarray/=lib/allo-v2.1/lib/v2-core/lib/solarray/src/',
        'solbase/=lib/allo-v2.1/lib/hats-protocol/lib/solbase/src/',
        'solmate/=lib/allo-v2.1/lib/permit2/lib/solmate/',
        'strategies/=lib/allo-v2.1/contracts/strategies/',
        'superfluid-protocol-monorepo/=lib/allo-v2.1/lib/superfluid-protocol-monorepo/packages/solidity-semantic-money/src/',
        'test/utils/=lib/allo-v2.1/test/utils/',
        'utils/=lib/allo-v2.1/lib/hats-protocol/lib/utils/',
        'v2-core/=lib/allo-v2.1/lib/v2-core/',
      ],
      optimizer: { enabled: true, runs: 200 },
      metadata: { bytecodeHash: 'ipfs' },
      compilationTarget: { 'src/KickstarterQF.sol': 'KickstarterQF' },
      evmVersion: 'cancun',
      libraries: {},
    },
    sources: {
      'lib/allo-v2.1/contracts/core/interfaces/IAllo.sol': {
        keccak256:
          '0xddbabde86678d1cdaa9976bc1c6db2a31d39495b934bd7dd8554cca9a751f900',
        urls: [
          'bzz-raw://3c10fe982959d9d804161f332bc06cdc5dd00e7aaf7f8ee1a373733caba95a25',
          'dweb:/ipfs/QmZg4RpyMzyJe4MiPai7ZzsvP13MeEeHqxsXkDaJVqgKLG',
        ],
        license: 'AGPL-3.0-only',
      },
      'lib/allo-v2.1/contracts/core/interfaces/IDAI.sol': {
        keccak256:
          '0xc359eefa79dabf5e283f35794ba4f297f447d2092b0c7e38fd74f32a5d1bd485',
        urls: [
          'bzz-raw://1231b6fa8a18642111ecdc7eeb2ded4d2f343b61ff2cab4a3137be6bbeb56ab2',
          'dweb:/ipfs/QmUQYBvAi4RQEtxS9CBmHQfnwLrN8cpvbjmZEKPJ9pMzAi',
        ],
        license: 'AGPL-3.0-only',
      },
      'lib/allo-v2.1/contracts/core/interfaces/IRegistry.sol': {
        keccak256:
          '0xcd47a891d6080a5f274e9d6356d62c50bc44e5e67703ce4160aeef46e784e38a',
        urls: [
          'bzz-raw://759246c28d8e7441e74d41a42fcbf31a432bc578aae0507e9138db85baf751d0',
          'dweb:/ipfs/QmbdaiYCWi2HN7NA98Gxb2vXCC7KgZeBFpkZbQpZyYBeF7',
        ],
        license: 'MIT',
      },
      'lib/allo-v2.1/contracts/core/libraries/Errors.sol': {
        keccak256:
          '0x6b90e98e8b65fe8f32557b6a9cb431bf96b909756877048247be5cb3c2018150',
        urls: [
          'bzz-raw://8a3e2117a897527a34b29b691cef914f0d2a4e79113294771e05ce840e5bf06b',
          'dweb:/ipfs/QmX3a5eyKq119LxyRM9jh3w3gCWgZP1xSvYiyBqFXemeqb',
        ],
        license: 'AGPL-3.0-only',
      },
      'lib/allo-v2.1/contracts/core/libraries/Metadata.sol': {
        keccak256:
          '0x41ece5b83f50d180841f44324a883e12b3fc2005e425e4cd51944fb8d46b147f',
        urls: [
          'bzz-raw://ecd926cbce88398d6fdb1762f7b75617635ae866f8461b7fb32dd2b0a17273ce',
          'dweb:/ipfs/QmdvPsL48GbXV2hy4vDcW9XtkN7VUTDebtYihuj7ZxhaD7',
        ],
        license: 'AGPL-3.0-only',
      },
      'lib/allo-v2.1/contracts/core/libraries/Transfer.sol': {
        keccak256:
          '0x0046ac6e0dd29f15da158e749bb928134e97d92880a89f9159de6bdadeee0d4a',
        urls: [
          'bzz-raw://ef6c48009f97cf1a453fdd446a732565e66844de9b019c1259f2c5894ee33959',
          'dweb:/ipfs/QmSnHz2YKMmxrkLZdcyf2A6Z1shQWcK2cNrWqaHcYjX8bS',
        ],
        license: 'AGPL-3.0-only',
      },
      'lib/allo-v2.1/contracts/strategies/BaseStrategy.sol': {
        keccak256:
          '0x9e10b6af836b71f010a626a198e487401b89fab52bd731b4a3f13bdc66b7e586',
        urls: [
          'bzz-raw://069a797f918907f073a14fe3eedb784a06debe7e484f6fb96d5918decb19a1e4',
          'dweb:/ipfs/QmXSj4x9ZvFCeMgw4XBZsftb8mJcrcEvkXXEkLaWta85pw',
        ],
        license: 'AGPL-3.0-only',
      },
      'lib/allo-v2.1/contracts/strategies/IBaseStrategy.sol': {
        keccak256:
          '0x48f8d5ee56b2eb03c2f3214407d740651ccb87a9c9f8328dfc9a158d6796ddef',
        urls: [
          'bzz-raw://f1eb7e8922b2752fbfa4377cfe1ce2069d6f04d47d68388a2705b9f3273c1d82',
          'dweb:/ipfs/QmPqq8sVjxZRdtSDaik5XwHkVvsvg772PLgUYJa9hmFrGV',
        ],
        license: 'AGPL-3.0-only',
      },
      'lib/allo-v2.1/contracts/strategies/extensions/allocate/AllocationExtension.sol':
        {
          keccak256:
            '0xcedff137dcc55f611c48af954f6d07366721cb74f2cdc1f113dc4bc436bd094a',
          urls: [
            'bzz-raw://70ab3b48535c8090711e8a2c600101c45d357976c31a2f9ef1ee97cdd1b6bd31',
            'dweb:/ipfs/QmbRZ2QbRqe1rgg88wwrbXF6G9gwXaqefmjYCrFhUQo4kM',
          ],
          license: 'AGPL-3.0-only',
        },
      'lib/allo-v2.1/contracts/strategies/extensions/allocate/IAllocationExtension.sol':
        {
          keccak256:
            '0x724c0cf3cf80fa503fda1c027682765e5f209341a652d93dc39fe77d095b4c84',
          urls: [
            'bzz-raw://becb6fc54bb213d912b7cc81efc28bf90e15d4ba3e05d7dcdba934b89b0b4b04',
            'dweb:/ipfs/QmT4vwRCzzktoJMX1aUnNDYS7hTW9bGr44cuF28xzbFYyD',
          ],
          license: 'AGPL-3.0-only',
        },
      'lib/allo-v2.1/contracts/strategies/extensions/register/IRecipientsExtension.sol':
        {
          keccak256:
            '0xbe40738cb068bb32fbc8d75fe23e37328e87fedb45d7acbf3bbac1810a307cf1',
          urls: [
            'bzz-raw://c6d0c0f4cfad55baca810d22d501113781f65958d4b832f91eab39cab87b7899',
            'dweb:/ipfs/QmaqTqYwbjhF1KibbisSvrKri9fqvo6zqkUAQntQuEs3WD',
          ],
          license: 'AGPL-3.0-only',
        },
      'lib/allo-v2.1/contracts/strategies/extensions/register/RecipientsExtension.sol':
        {
          keccak256:
            '0xc98c2ad99027546b0d0a773423f9a829e0bd6fe4f16184c0bb5bc28ad86815ed',
          urls: [
            'bzz-raw://2baf8cc495ad90fc08f07831af66568aa9a5f1d2f6907a5cc02339b2717a0d29',
            'dweb:/ipfs/QmWUN2xJoNfhjpgEM8tRw2oKmJ8CVajBJVJdRN6rtsCHUX',
          ],
          license: 'AGPL-3.0-only',
        },
      'lib/allo-v2.1/lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol':
        {
          keccak256:
            '0x287b55befed2961a7eabd7d7b1b2839cbca8a5b80ef8dcbb25ed3d4c2002c305',
          urls: [
            'bzz-raw://bd39944e8fc06be6dbe2dd1d8449b5336e23c6a7ba3e8e9ae5ae0f37f35283f5',
            'dweb:/ipfs/QmPV3FGYjVwvKSgAXKUN3r9T9GwniZz83CxBpM7vyj2G53',
          ],
          license: 'MIT',
        },
      'lib/allo-v2.1/lib/openzeppelin-contracts/contracts/token/ERC20/extensions/IERC20Permit.sol':
        {
          keccak256:
            '0xec63854014a5b4f2b3290ab9103a21bdf902a508d0f41a8573fea49e98bf571a',
          urls: [
            'bzz-raw://bc5b5dc12fbc4002f282eaa7a5f06d8310ed62c1c77c5770f6283e058454c39a',
            'dweb:/ipfs/Qme9rE2wS3yBuyJq9GgbmzbsBQsW2M2sVFqYYLw7bosGrv',
          ],
          license: 'MIT',
        },
      'lib/allo-v2.1/lib/openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol':
        {
          keccak256:
            '0xabefac93435967b4d36a4fabcbdbb918d1f0b7ae3c3d85bc30923b326c927ed1',
          urls: [
            'bzz-raw://9d213d3befca47da33f6db0310826bcdb148299805c10d77175ecfe1d06a9a68',
            'dweb:/ipfs/QmRgCn6SP1hbBkExUADFuDo8xkT4UU47yjNF5FhCeRbQmS',
          ],
          license: 'MIT',
        },
      'lib/allo-v2.1/lib/openzeppelin-contracts/contracts/utils/Address.sol': {
        keccak256:
          '0x006dd67219697fe68d7fbfdea512e7c4cb64a43565ed86171d67e844982da6fa',
        urls: [
          'bzz-raw://2455248c8ddd9cc6a7af76a13973cddf222072427e7b0e2a7d1aff345145e931',
          'dweb:/ipfs/QmfYjnjRbWqYpuxurqveE6HtzsY1Xx323J428AKQgtBJZm',
        ],
        license: 'MIT',
      },
      'lib/allo-v2.1/lib/permit2/src/interfaces/IEIP712.sol': {
        keccak256:
          '0xea70db68ce450ad38dfbd490058595441144808eb95272ae9b89e3fbe6456954',
        urls: [
          'bzz-raw://e8fad9ff319665acdc2f1295bb82db3e5b4d52babc0b58f147dbdbb9f322c6e5',
          'dweb:/ipfs/QmTbYJPcux8eJ3qGVYQh6TiwCA2FPu6HXTUg6QFTnX91Ks',
        ],
        license: 'MIT',
      },
      'lib/allo-v2.1/lib/permit2/src/interfaces/ISignatureTransfer.sol': {
        keccak256:
          '0x6805563eaad92471fa1b3591a71d7020a93e59f1a4ac95398daf74927f5bd033',
        urls: [
          'bzz-raw://48cd13806cb8e82dcc38eb93423a372fbdd3b05364ecebb8bfd9cd29078dd90c',
          'dweb:/ipfs/QmeLyFVrzKRHcm6aaFFBCG5mFESCqWLp1KYT41H8XhzMCp',
        ],
        license: 'MIT',
      },
      'lib/allo-v2.1/lib/solady/src/utils/SafeTransferLib.sol': {
        keccak256:
          '0x06d3261d13cf5a08f9bcda05e17be0a6a0380193116298fdf8eabf9bf80d3624',
        urls: [
          'bzz-raw://96965a8a2b1bd2d6cff4a8f78bcb33b0de8848834f8e4be28c03609ae08e9298',
          'dweb:/ipfs/QmSoNDxaEozMZgNdVEygfEvnk26Tu4UeFeapvtMsoUFftt',
        ],
        license: 'MIT',
      },
      'src/KickstarterQF.sol': {
        keccak256:
          '0x8dc5b3c6a8334978f1160307d256e5c5fc0b2232c4860b37b077412d4bc48079',
        urls: [
          'bzz-raw://bad4d8f9f31d714b59149d2e6ede8c6e3f4de5f46a17c3cfd48ce1c2bcc50672',
          'dweb:/ipfs/QmX3UstU7kcZ7CF51PxvF2n3uTTeam5dCUWgVgFnT75uox',
        ],
        license: 'MIT',
      },
      'src/interfaces/ITreasury.sol': {
        keccak256:
          '0x10e8910a2de9d441255ac5b48fb5a3c3a21cb7dbd308f61bde85fbfc30fded7b',
        urls: [
          'bzz-raw://41b766ab2f335da160177702b77f1ab668ae34695f4a48fded6e9dac1f56914f',
          'dweb:/ipfs/QmRAEyovgpLKgV9D7zARtSoi8AdheN3jUabiZwg1RnGscv',
        ],
        license: 'MIT',
      },
    },
    version: 1,
  },
  id: 101,
};
