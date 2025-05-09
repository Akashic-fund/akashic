export const NFTMetadata = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'description',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'imageUri',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'campaignId',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'supporterNumber',
        type: 'uint256',
      },
    ],
    name: 'createMetadata',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
];
