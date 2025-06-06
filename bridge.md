# Crowdsplit API Integration & Profile Page Documentation

## 1. Introduction - ( for reference purposes, will be deleted before merging)

This document details the implementation of user profile management and integration with the Crowdsplit (Crowdsplit) API within the Akashic platform. It covers configuration, backend API routes, frontend components, and data flow for features like user information management, KYC verification, payment method handling, and wallet address association.

## 2. Configuration

Environment variables are crucial for connecting to the Crowdsplit API and other services.

**File:** `.env`

**Important Note:** The `CROWDSPLIT_API_KEY` constant uses the `NEXT_PUBLIC_CROWDSPLIT_CLIENT_ID`. The `CrowdsplitService` uses this key directly in the `Authorization` header _without_ the `Bearer` prefix.

## 3. Crowdsplit Service (`lib/crowdsplit/service.ts`)

This class acts as a central wrapper for all interactions with the Crowdsplit API.

**Key Features:**

- **Initialization:** Takes the API URL and API Key (Client ID) during instantiation. Logs basic configuration details.
- **`request<T>` Method:** A private helper function to handle API calls.
  - Constructs the full URL.
  - Sets `Content-Type` to `application/json`.
  - Sets the `Authorization` header directly with the cleaned API Key (Client ID). **No `Bearer` prefix is used.**
  - Handles different HTTP methods (GET, POST, etc.).
  - Stringifies the request body if provided.
  - Includes extensive logging for requests and responses.
  - Parses the JSON response.
  - Provides specific error handling for 401 Unauthorized responses.
  - Throws errors for non-OK responses, attempting to extract error messages from the response body.
- **Public Methods:** Each method maps to a specific Crowdsplit API endpoint:
  - `createCustomer(customerData)`: Calls `POST /api/v1/customers`.
  - `getKycSchema()`: Calls `GET /api/v1/kyc/schema?provider=CROWDSPLIT`.
  - `initiateKyc(customerId)`: Calls `POST /api/v1/kyc/{customerId}/initiate?provider=CROWDSPLIT`.
  - `getKycStatus(customerId)`: Calls `GET /api/v1/kyc/{customerId}/status?provider=CROWDSPLIT`.
  - `createPaymentMethod(data)`: Calls `POST /api/v1/customers/{customerId}/payment_methods`.
  - `buyTransaction(data)`: Calls `POST /api/v1/wallets/trades/buy`.
  - `sellTransaction(data)`: Calls `POST /api/v1/wallets/trades/sell`.

An instance of this service is exported for use throughout the backend:

## 4. Backend API Endpoints (`app/api/...`)

These Next.js API routes handle requests from the frontend, interact with the `crowdsplitService` and the Prisma database, and return responses.

### 4.1. User Data

- **`GET /api/users/me`**:
  - **Purpose:** Fetches detailed user data from the Prisma database based on the `userAddress` query parameter.
  - **Returns:** User object including `id`, `address`, `recipientWallet`, `crowdsplitCustomerId`, `firstName`, `lastName`, `email`, `createdAt`, `updatedAt`, `isKycCompleted`.
- **`POST /api/users/profile`**:
  - **Purpose:** Updates basic user profile information (currently `firstName` and `recipientWallet`) in the Prisma database using `upsert`.
  - **Request Body:** `{ userAddress: string, firstName?: string, recipientWallet?: string }`
  - **Returns:** Success status and basic user info.

### 4.2. Crowdsplit Customer Management

- **`POST /api/crowdsplit/customer`**:
  - **Purpose:** Creates a new customer record in Crowdsplit and updates the corresponding user record in Prisma.
  - **Request Body:** `{ userAddress: string, first_name: string, last_name: string, email: string, ... }`
  - **Actions:**
    1.  Finds the user in Prisma via `userAddress`.
    2.  Calls `crowdsplitService.createCustomer` with provided details.
    3.  Updates the Prisma user record with the returned `crowdsplitCustomerId` and other profile info (`firstName`, `lastName`, `email`).
  - **Returns:** `{ success: true, customerId: string }` or error details.
- **`GET /api/crowdsplit/customer`**: (Used in `profile-form.tsx`, `personal-info-page.tsx`, `wallet-page.tsx`)
  - **Purpose:** Checks if a user (identified by `userAddress` query param) has an associated Crowdsplit customer ID in the Prisma database.
  - **Actions:**
    1.  Finds the user in Prisma via `userAddress`.
    2.  Checks if `user.crowdsplitCustomerId` exists.
  - **Returns:** `{ hasCustomer: boolean, customerId: string | null, kycCompleted?: boolean }` (Note: `kycCompleted` seems to be fetched directly from the user record here).

### 4.3. Crowdsplit KYC Management

- **`POST /api/crowdsplit/kyc/initiate`**:
  - **Purpose:** Initiates the KYC process for a given Crowdsplit customer.
  - **Request Body:** `{ customerId: string }`
  - **Actions:**
    1.  Finds the user in Prisma via `customerId` to ensure validity.
    2.  Calls `crowdsplitService.initiateKyc(customerId)`.
    3.  Extracts the `redirect_url` or `redirectUrl` from the Crowdsplit response.
  - **Returns:** `{ success: true, redirectUrl: string }` or error details.
- **`GET /api/crowdsplit/kyc/status`**:
  - **Purpose:** Checks the current KYC status for a Crowdsplit customer.
  - **Query Parameter:** `customerId`
  - **Actions:**
    1.  Finds the user in Prisma via `customerId`.
    2.  Calls `crowdsplitService.getKycStatus(customerId)`.
    3.  If the status from Crowdsplit is `completed` and the user's `isKycCompleted` flag in Prisma is `false`, updates the Prisma record.
  - **Returns:** `{ status: string, customerId: string, crowdsplitError?: string }`. Returns the status from the DB if the Crowdsplit API call fails.
- **`POST /api/crowdsplit/kyc/complete`**: (Likely for testing/manual override)
  - **Purpose:** Manually sets the `isKycCompleted` flag to `true` for a user in the Prisma database.
  - **Request Body:** `{ customerId: string }`
  - **Actions:** Updates the Prisma user record where `crowdsplitCustomerId` matches.
  - **Returns:** `{ success: true, message: string }` or error details.

### 4.4. Crowdsplit Payment Methods

- **`GET /api/crowdsplit/payment-methods`**:
  - **Purpose:** Fetches payment methods associated with a user _from the Prisma database_.
  - **Query Parameter:** `userAddress`
  - **Actions:**
    1.  Finds the user in Prisma via `userAddress`.
    2.  Queries the `PaymentMethod` table for records linked to the `userId`.
  - **Returns:** `{ paymentMethods: PaymentMethod[] }` or error details.
- **`POST /api/crowdsplit/payment-methods`**:
  - **Purpose:** Adds a new bank account payment method via Crowdsplit and saves a record in Prisma.
  - **Request Body:** `{ userAddress: string, customerId: string, type: "BANK", bank_details: { provider: "CROWDSPLIT", bankName: string, accountNumber: string, routingNumber: string, accountType: "CHECKING" | "SAVINGS", accountName: string } }`
  - **Actions:**
    1.  Finds the user in Prisma via `userAddress` to verify `customerId` and get `userId`.
    2.  Calls `crowdsplitService.createPaymentMethod` with `customerId`, `type`, and `bank_details`.
    3.  Creates a new record in the Prisma `PaymentMethod` table, storing the `externalId` (from Crowdsplit response), `type`, `userId`, and `details`.
  - **Returns:** `{ success: true, paymentMethod: PaymentMethod }` or error details.
- **`DELETE /api/crowdsplit/payment-methods/:id`**: (Route structure inferred from `payment-methods-form.tsx`)
  - **Purpose:** Deletes a payment method (likely both in Crowdsplit and Prisma, though the provided backend code for DELETE is missing/commented out in `crowdsplit-service.ts`).
  - **Request Body:** `{ customerId: string, userAddress: string }` (Inferred)
  - **Actions:**
    1.  (Expected) Call Crowdsplit API to delete the payment method using `paymentMethodId` and `customerId`.
    2.  (Expected) Delete the corresponding record from the Prisma `PaymentMethod` table.
  - **Returns:** Success or error status.

### 4.5. Crowdsplit Wallet Addresses

- **`POST /api/crowdsplit/wallet-addresses`**:
  - **Purpose:** Associates a recipient wallet address with a Crowdsplit customer (via Crowdsplit API) and updates the user's `recipientWallet` in Prisma.
  - **Request Body:** `{ customerId: string, userAddress: string, walletAddress: string }`
  - **Actions:**
    1.  Calls the Crowdsplit API endpoint `POST /api/v1/customers/{customerId}/wallets` with the `walletAddress`. **Note:** This route directly uses `fetch` instead of `crowdsplitService`. It includes `Authorization: Bearer ${CROWDSPLIT_API_KEY}` which contradicts the `crowdsplitService` implementation. This needs review/standardization.
    2.  Updates the `recipientWallet` field in the Prisma user record via `userAddress`.
  - **Returns:** `{ success: true, message: string, data: any }` or error details.

### 4.6. Crowdsplit Transactions

- **`POST /api/crowdsplit/transactions`**:
  - **Purpose:** Initiates a buy or sell transaction via the Crowdsplit API.
  - **Request Body:** `{ type: "buy" | "sell", customerId: string, currency: string, amount: number, paymentMethodId?: string, walletAddress: string }`
  - **Actions:**
    1.  Calls either `crowdsplitService.buyTransaction` or `crowdsplitService.sellTransaction` based on the `type`.
    2.  (Commented out) Potentially creates a `Payment` record in Prisma to track the transaction.
  - **Returns:** `{ success: true, transactionId: string }` or error details.

### 4.7. Webhooks

- **`POST /api/crowdsplit/webhook`**:
  - **Purpose:** Unified webhook endpoint that receives ALL webhook events from CrowdSplit and routes them internally.
  - **Event Types Supported:**
    - `transaction.updated` -> Payment transaction updates (both Stripe and Bridge.xyz)
    - `kyc.status_updated` -> KYC status updates
  - **Actions:**
    1.  Validates webhook authentication using multiple methods (payload secret, HMAC SHA256, Stripe-style signatures).
    2.  Parses the request body and extracts event type.
    3.  Routes events internally based on event type:
       - **Payment Events (`transaction.updated`):**
         - Finds the corresponding `Payment` record in Prisma using `transaction_id` (as `externalId`).
         - Updates the `status` of the Prisma `Payment` record based on the webhook status (`COMPLETED` -> `confirmed`, `FAILED` -> `failed`, etc.).
         - Stores the webhook payload in the payment's metadata.
       - **KYC Events (`kyc.status_updated`):**
         - If `status === 'completed'`, updates the `isKycCompleted` flag to `true` for the user matching `customer_id` in Prisma.
  - **Authentication:** Uses shared webhook authentication utility supporting:
    - Payload secret validation (current CrowdSplit method)
    - HMAC SHA256 signature verification (future-ready)
    - Stripe-style timestamp signature validation (future-ready)
  - **Returns:** `{ success: true, received: true, event_type: string, authentication_method: string, ... }` (Always returns 200 OK to acknowledge receipt, includes event processing results).

## 5. Frontend Implementation (`app/profile/...`, `components/profile/...`)

The frontend uses Next.js App Router pages and React components (built with Shadcn UI) to provide the user interface for profile management.

### 5.1. Main Profile Page (`app/profile/page.tsx`)

- **Purpose:** Displays an overview of the user's profile and provides navigation to different settings sections.
- **Data Fetching:** Uses `useEffect` and `usePrivy` to fetch user data from `/api/users/me` once authenticated.
- **UI:**
  - Uses `ProfileHeader` component.
  - Displays user avatar, name (first/last), wallet address, and last login time.
  - Renders `UserProfileForm` to allow editing basic info (first name, recipient wallet).
  - Provides links (wrapped in Buttons within a Card) to sub-pages: Payment Methods, KYC Verification, Wallet Settings.

### 5.2. Sub-Pages (`app/profile/.../page.tsx`)

These pages follow a similar pattern:

- Use `usePrivy` for authentication context.
- Use `useEffect` to fetch necessary data on load (usually user data from `/api/users/me` to get `crowdsplitCustomerId`, and potentially specific data like payment methods or KYC status).
- Display loading states.
- Render the corresponding form component (`PersonalInfoForm`, `KycVerificationForm`, etc.), passing down necessary props like `customerId`, initial data, and `onSuccess` callbacks.
- Include a "Back to Profile" link/button.

### 5.3. Profile Form Components (`components/profile/...`)

- **`PersonalInfoForm.tsx`**:
  - Collects first name, last name, email.
  - Uses `react-hook-form` and `zod` for validation.
  - On submit, calls `POST /api/crowdsplit/customer`.
  - Displays an alert if the customer account already exists (`hasCustomer` prop).
  - Calls `onSuccess(customerId)` after successful creation.
- **`KycVerificationForm.tsx`**:
  - Displays current KYC status (`isCompleted` prop, internal `kycStatus` state).
  - **Status Checking:**
    - Uses `useEffect` to periodically poll `GET /api/crowdsplit/kyc/status` if status is not 'completed'.
    - Updates internal `kycStatus` based on the API response.
    - Calls `onSuccess()` if status becomes 'completed'.
  - **Initiation:**
    - Provides a "Start KYC" button if status is `not_started` or similar.
    - On click, calls `POST /api/crowdsplit/kyc/initiate`.
    - If successful, receives a `redirectUrl`, opens it in a new tab (`window.open`), and sets internal status to `pending`.
- **`PaymentMethodsForm.tsx`**:
  - Displays a table of existing payment methods (passed via `paymentMethods` prop).
  - Provides an "Add Bank Account" button triggering a Dialog.
  - **Add Dialog:**
    - Uses `react-hook-form` and `zod` (`bankAccountSchema`) for bank detail validation (name, account/routing number, type, account name).
    - On submit, calls `POST /api/crowdsplit/payment-methods`.
    - On success, calls `onSuccess(updatedMethods)` to refresh the list in the parent, closes the dialog, resets the form, and shows a success toast.
  - **Deletion:**
    - Provides a delete button for each method.
    - On click, calls `DELETE /api/crowdsplit/payment-methods/:id`.
    - On success, calls `onSuccess(updatedMethods)` to refresh the list and shows a success toast.
- **`WalletAddressesForm.tsx`**:
  - Collects a recipient wallet address.
  - Uses `react-hook-form` and `zod` for validation (Ethereum address format).
  - Fetches the current recipient wallet address from user data (`/api/users/me`) to pre-fill the form.
  - On submit, calls `POST /api/crowdsplit/wallet-addresses`.
  - Calls `onSuccess()` on successful update.
- **`UserProfileForm.tsx`**:
  - Collects `firstName`.
  - Uses `react-hook-form` and `zod`.
  - On submit, calls `POST /api/users/profile` to update the user's basic info in Prisma.

## 6. Data Flow Examples

- **New User Onboarding (Profile Creation & KYC):**

  1.  User connects wallet (Privy).
  2.  User navigates to Profile -> Personal Info.
  3.  `PersonalInfoForm` loads, `hasCustomer` is false.
  4.  User fills form, submits.
  5.  Frontend calls `POST /api/crowdsplit/customer`.
  6.  Backend calls `crowdsplitService.createCustomer`.
  7.  Crowdsplit API creates customer, returns ID.
  8.  Backend updates Prisma User with `crowdsplitCustomerId`, `firstName`, etc.
  9.  Backend returns `{ success: true, customerId }`.
  10. Frontend receives success, calls `onSuccess(customerId)`, potentially navigates or updates UI state.
  11. User navigates to Profile -> KYC Verification.
  12. `KycVerificationForm` loads, `isCompleted` is false. Polls `/api/crowdsplit/kyc/status` (status likely 'not_started' or 'pending').
  13. User clicks "Start KYC".
  14. Frontend calls `POST /api/crowdsplit/kyc/initiate` with `customerId`.
  15. Backend calls `crowdsplitService.initiateKyc`.
  16. Crowdsplit API returns `{ redirectUrl }`.
  17. Backend returns `{ success: true, redirectUrl }`.
  18. Frontend opens `redirectUrl` in a new tab, sets internal status to 'pending'.
  19. Frontend continues polling `/api/crowdsplit/kyc/status`.
  20. User completes KYC flow in the Crowdsplit tab.
  21. Crowdsplit sends webhook `POST /api/crowdsplit/webhook/kyc` with `status: 'completed'`.
  22. Webhook handler updates Prisma User `isKycCompleted = true`.
  23. Frontend polling eventually receives `status: 'completed'` from `/api/crowdsplit/kyc/status`.
  24. `KycVerificationForm` updates UI to show "Completed", calls `onSuccess()`.

- **Adding a Bank Account:**
  1.  User navigates to Profile -> Payment Methods.
  2.  `PaymentMethodsPage` fetches user data (`/api/users/me`) and existing methods (`/api/crowdsplit/payment-methods`).
  3.  `PaymentMethodsForm` displays existing methods.
  4.  User clicks "Add Bank Account", dialog opens.
  5.  User fills bank details, submits form.
  6.  Frontend calls `POST /api/crowdsplit/payment-methods` with `customerId` and bank details.
  7.  Backend calls `crowdsplitService.createPaymentMethod`.
  8.  Crowdsplit API adds method, returns ID.
  9.  Backend creates `PaymentMethod` record in Prisma.
  10. Backend returns `{ success: true, paymentMethod }`.
  11. Frontend receives success, calls `onSuccess(newMethodsList)` (after re-fetching), closes dialog, shows toast.

## 7. Key Dependencies

- **Next.js:** Framework
- **React:** UI Library
- **Prisma:** Database ORM
- **Privy:** Authentication (`@privy-io/react-auth`)
- **WAGMI / Viem:** Wallet interaction (implied by `useAccount`, `useWallets`)
- **Shadcn UI / Tailwind CSS:** UI Components & Styling
- **React Hook Form / Zod:** Form management and validation
- **Lucide React:** Icons
- **date-fns:** Date formatting

## 8. Potential Improvements & TODOs

- **Standardize API Authorization:** The direct `fetch` call in `POST /api/crowdsplit/wallet-addresses` uses `Bearer` while `crowdsplitService` does not. This should be consistent. Clarify if `Bearer` is actually required by the Crowdsplit API.
- **Implement Payment Method Deletion:** The backend logic for deleting payment methods in `crowdsplitService` seems missing/commented out. Implement this if required.
- **Error Handling:** Enhance error handling, potentially providing more user-friendly messages based on specific Crowdsplit API error codes.
- **Refine Polling:** Consider using WebSockets or Server-Sent Events instead of polling for KYC status updates for better efficiency, although the webhook should be the primary mechanism.
- **Configuration Clarity:** Clarify the duplication/naming convention between `CROWDSPLIT` and `CROWDSPLIT` environment variables.
- **Transaction Tracking:** Fully implement the creation and updating of `Payment` records in Prisma for buy/sell transactions if needed for internal tracking.
