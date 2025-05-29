export { countries } from './countries';
export { categories } from './categories';
export const adminAddress = process.env.NEXT_PUBLIC_PLATFORM_ADMIN;
export const USDC_ADDRESS = process.env.NEXT_PUBLIC_PLEDGE_TOKEN;

// Akashic NFT Contract Addresses
export const NFT_METADATA = '0x73258C5813AB9494473d34eD57869531B2dd6ac2';
export const CAMPAIGN_NFT_FACTORY =
  '0x41ab8cf665f931B010d13D46b5178551594EE2DA';
export const AKASHIC_NFT_REGISTRY =
  '0x41b40AB343E607e59de62930D726A324B3b7cf63';

// Allo Integration Contract
export const ALLO_ADDRESS = '0x1133eA7Af70876e64665ecD07C0A0476d09465a1';
export const KICKSTARTER_QF_ADDRESS =
  '0x331e239848571d98B917982c16562b6E29DD91C5';

// Crowdsplit API configuration
export const CROWDSPLIT_API_URL = 'https://api.usecrowdpay.xyz';
export const CROWDSPLIT_CLIENT_ID = process.env.CROWDSPLIT_CLIENT_ID;
export const CROWDSPLIT_CLIENT_SECRET = process.env.CROWDSPLIT_CLIENT_SECRET;
export const CROWDSPLIT_WEBHOOK_SECRET = process.env.CROWDSPLIT_WEBHOOK_SECRET;
