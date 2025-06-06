import { PrismaClient } from '../.generated/prisma/client';
import { CampaignStatus } from '../types/campaign';
import shortUUID from 'short-uuid';
import crypto from 'crypto';

const db = new PrismaClient({
  log: ['error'],
});
const campaignAddresses = [
  '0x8A7B9a472F45382A6B4bC0d20625a69FF84A12bf',
  '0x3e4893F8667CacFD3A241Bec0A10C080041e44F6',
  '0x91e64470124d22C269dB6c07Bd44F0eEB9Ab2C77',
  '0x9Ca820ccd1648375aEBf93B0626E8B7D4c3f92A9',
  '0x4E2eBd9e05F30d2255E9814e314207725bA9Dc18',
  '0x5520f8531e4eF425fb26C6A8cb330f07b421678f',
  '0x73262Efe13Cb68a50501d04727E4Be9ccfe3Df76',
  '0x8566B62792777Bc86fFfd31f34b3FBaa42842B19',
  '0x4E193Ed197b064a98EE30ADeb64bdE85d8720c1a',
  '0xA5CB38fAf4B89047888b9518e40967292Bd16e14',
  '0xf3296A1C7268F8Dc15D3a9d6a5CE42EaB701a8AD',
  '0x6DE4cB03519AC9DF9362Bd7Ea41D83dB49002b5b',
  '0xc3053dB90b4474Fb1B8F3A33fDAE065dC1221d9f',
  '0xbddFcb6025C863DCd2e2Ed24e5d4EA8732AE8d91',
  '0x464d6deec9f23F17e99D9Eab39cd7057c9F2f77c',
  '0xd0FBa9726e6e143240690Efb78c53A16666E2d9B',
  '0xB312a1e100585163A9D68543b39A26C5A440Aef3',
  '0xcb8b45b4d1FB5C88D1325cc29f6f79A4F25D0aDB',
  '0x52C4E1AdA24cA2d477b8C8c19282aF584d86a9A1',
  '0xAceD46b399Fac263C8F671F2fcc237Ae60a231fC',
  '0x793583227d5415AF64B5b1a92FCaabfFA310eFD2',
  '0x8935050e949366da682F8012fb441c3323d3DE41',
  '0x296017F520555556c6057FB9fe7c6762e24cafF5',
];

const campaignTitles = [
  'Emergency Shelter for Syrian Families',
  'Education Support for Refugee Children',
  'Medical Aid for Venezuelan Refugees',
  'Food Security Program for Yemen',
  'Mental Health Support for Afghan Refugees',
  'Winter Supplies for Ukrainian Families',
  'Clean Water Initiative for Rohingya Camps',
  'Job Training for Displaced Youth',
  'Emergency Medical Transport Service',
  "Children's Safe Spaces Project",
  "Women's Empowerment Program",
  'Refugee Legal Aid Support',
  'Emergency Communication Network',
  'Sustainable Housing Project',
  'Mobile Medical Clinics',
  'Educational Technology Access',
  'Family Reunification Program',
  'Community Integration Initiative',
  'Emergency Food Distribution',
  'Trauma Counseling Services',
  'Vocational Training Center',
  'Child Protection Services',
  'Emergency Response Unit',
];

const campaignCategories = [
  { id: 'visual-arts', name: 'Visual Arts', icon: '🎨' },
  { id: 'music-audio', name: 'Music & Audio', icon: '🎵' },
  { id: 'film-photography', name: 'Film & Photography', icon: '📷' },
  { id: 'crafts-artifacts', name: 'Crafts & Artifacts', icon: '🏺' },
  { id: 'literature-writing', name: 'Literature & Writing', icon: '📚' },
  { id: 'food-culinary', name: 'Food & Culinary Arts', icon: '🍳' },
  { id: 'fashion-textiles', name: 'Fashion & Textiles', icon: '👕' },
  { id: 'education-workshops', name: 'Education & Workshops', icon: '🎓' },
  { id: 'digital-art-nfts', name: 'Digital Art & NFTs', icon: '💻' },
  { id: 'community-goods', name: 'Community & Public Goods', icon: '🤝' },
];

const locations = [
  'Kakuma, Kenya',
  'Zaatari, Jordan',
  "Cox's Bazar, Bangladesh",
  'Berlin, Germany',
  'London, United Kingdom',
  'Minneapolis, United States',
  'Toronto, Canada',
  'Bidi Bidi, Uganda',
  'Dadaab, Kenya',
  'Paris, France',
];

const campaignStatuses = Object.values(CampaignStatus);

// Helper function to generate slug from title
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 16); // Use more characters for better uniqueness
  const slug = `${baseSlug}-${shortUUID().generate()}`;
  return slug;
}
function selectRandom<T>(array: T[]): T {
  if (array.length === 0) {
    throw new Error('to use selectRandom, provide a list of values');
  }
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}
function randomHash(): string {
  const array = new Uint8Array(32); // 32 bytes for a 256-bit hash
  crypto.getRandomValues(array); // Fill the array with cryptographically secure random values
  return (
    '0x' +
    Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
  ); // Convert to hex string
}
function randomAddress(): string {
  // Generate a random 40-character hexadecimal string
  const randomHexString = Array.from({ length: 40 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');

  // Prefix with '0x' to resemble an Ethereum address
  return '0x' + randomHexString;
}
async function createUsers(amount: number, roles: string[]) {
  const userPromises = [];
  for (let i = 0; i < amount; i++) {
    userPromises.push(
      db.user.create({
        data: {
          address: randomAddress(),
          roles,
        },
      }),
    );
  }
  return await Promise.all(userPromises);
}

// Generate realistic funding goals ($1,000 - $50,000)
function generateFundingGoal(): string {
  const goals = [
    1000, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 35000, 50000,
  ];
  return selectRandom(goals).toString();
}

// Generate realistic campaign descriptions
function generateDescription(title: string): string {
  const descriptions = [
    `${title} aims to provide immediate relief and long-term support to displaced families. Our comprehensive approach includes emergency assistance, community building, and sustainable development initiatives.`,
    `Join us in supporting ${title.toLowerCase()} through a community-driven initiative. We work directly with local organizations to ensure maximum impact and transparency in our humanitarian efforts.`,
    `${title} addresses critical needs in refugee communities through innovative solutions and grassroots partnerships. Every contribution directly funds essential services and empowerment programs.`,
    `Help us expand ${title.toLowerCase()} to reach more families in need. This campaign focuses on sustainable impact through education, healthcare, and economic empowerment initiatives.`,
    `${title} is a collaborative effort to restore dignity and hope to displaced communities. We prioritize community-led solutions and long-term capacity building.`,
  ];
  return selectRandom(descriptions);
}

// Generate random number of payments per campaign (2-15)
function generatePaymentCount(): number {
  return Math.floor(Math.random() * 14) + 2; // 2-15 payments
}

// Generate realistic payment amounts ($5-$500)
function generatePaymentAmount(): string {
  const amounts = [5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 300, 500];
  return selectRandom(amounts).toString();
}

async function main() {
  const imageFiles = [
    'c318ab6059374812-ethereum-main.jpg',
    'ffeeccde2afa88f6-UN0345662.jpg.jpeg',
    '63b6dfc5b215fa92-whole-child-education-920x513.jpg',
    'a41bb1ae87c99ce0-celo-camp.webp',
    '345351662ea35292-ethereum-main.jpg',
    '47e747dce8507cc6-celo-camp.webp',
    '53b6b5c0a25e3f55-clown-girls.jpg',
    '5f9a0d7156c725ef-water.jpg',
    'c1.png',
    'c2.png',
    'c3.png',
  ];

  const campaigns = Array.from({ length: 10 }, (_, i) => ({
    title: campaignTitles[i],
    description: generateDescription(campaignTitles[i]),
    fundingGoal: generateFundingGoal(),
    startTime: new Date(),
    endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    creatorAddress: '0x1234567890123456789012345678901234567890',
    status:
      i < 7
        ? CampaignStatus.ACTIVE
        : campaignStatuses[i % campaignStatuses.length],
    slug: generateSlug(campaignTitles[i]),
    transactionHash: `0xdeadbeef${(i + 1).toString().padStart(2, '0')}`,
    campaignAddress: campaignAddresses[i] || null,
    treasuryAddress: campaignAddresses[i] || null,
    category: campaignCategories[i % campaignCategories.length].id,
    location: locations[i % locations.length],
  }));

  // Clear existing data
  await db.campaignImage.deleteMany();
  await db.campaignCollection.deleteMany();
  await db.payment.deleteMany();
  await db.campaign.deleteMany();

  // Create 25 users instead of 100 (more realistic for debugging)
  const donorUsers = await createUsers(25, ['user']);

  let totalPayments = 0;

  for (let i = 0; i < campaigns.length; i++) {
    const campaign = await db.campaign.create({
      data: campaigns[i],
    });

    // Assign an image from the local file system
    const imageFile = imageFiles[i % imageFiles.length];
    await db.campaignImage.create({
      data: {
        imageUrl: `/campaign-images/${imageFile}`,
        isMainImage: true,
        campaignId: campaign.id,
      },
    });

    // Generate 2-15 payments per campaign (randomized)
    const paymentCount = generatePaymentCount();
    totalPayments += paymentCount;

    for (let j = 0; j < paymentCount; j++) {
      // Generate realistic payment method distribution
      // 60% credit card, 40% crypto
      const isCreditCard = Math.random() < 0.6;

      await db.payment.create({
        data: {
          amount: generatePaymentAmount(),
          token: 'USD', // All payments are processed as USD by CrowdSplit
          status: selectRandom([
            'confirmed',
            'confirmed',
            'confirmed', // Higher chance of confirmed
            'pending',
            'pending', // Some pending
            'failed', // Occasional failures
          ]),
          type: 'BUY',
          // Credit card payments don't have blockchain transaction hashes
          transactionHash: isCreditCard ? null : randomHash(),
          // Track payment method in metadata for proper link display
          metadata: {
            paymentMethod: isCreditCard ? 'credit_card' : 'crypto',
            originalToken: isCreditCard ? 'USD' : 'USDC', // Native USDC on Celo (Circle-issued)
          },
          campaign: { connect: { id: campaign.id } },
          user: {
            connect: { id: selectRandom(donorUsers.map(({ id }) => id)) },
          },
        },
      });
    }
  }

  console.log(
    `Seeded ${campaigns.length} campaigns with images and ${totalPayments} total payments`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
