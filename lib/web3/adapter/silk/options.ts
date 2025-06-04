import { PROJECT_NAME, REOWN_CLOUD_PROJECT_ID } from '@/lib/constant';

import type { InitSilkOptions } from '@silk-wallet/silk-wallet-sdk';

export const options: InitSilkOptions = {
  useStaging: true,
  config: {
    styles: { darkMode: true },
    allowedSocials: ['google'],
    authenticationMethods: ['email', 'wallet'],
  },
  walletConnectProjectId: REOWN_CLOUD_PROJECT_ID,
  project: {
    name: PROJECT_NAME,
    // logo: '',
    // origin: getOrigin(),
    //    projectId:
    // termsOfServiceUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/terms-of-service`,
    // privacyPolicyUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/privacy-policy`,
  },
};
console.log(options);
