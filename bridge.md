# Bridge API Integration & Profile Page Documentation

## 1. Introduction - ( for reference purposes, will be deleted before merging)

This document details the implementation of user profile management and integration with the Bridge (Crowdsplit) API within the Akashic platform. It covers configuration, backend API routes, frontend components, and data flow for features like user information management, KYC verification, payment method handling, and wallet address association.

## 2. Configuration

Environment variables are crucial for connecting to the Bridge API and other services.

**File:** `.env`

**Important Note:** The `BRIDGE_API_KEY` constant uses the `NEXT_PUBLIC_BRIDGE_CLIENT_ID`. The `BridgeService` uses this key directly in the `Authorization` header *without* the `Bearer` prefix.

## 3. Bridge Service (`lib/bridge-service.ts`)

This class acts as a central wrapper for all interactions with the Bridge API.

**Key Features:**

*   **Initialization:** Takes the API URL and API Key (Client ID) during instantiation. Logs basic configuration details.
*   **`request<T>` Method:** A private helper function to handle API calls.
    *   Constructs the full URL.
    *   Sets `Content-Type` to `application/json`.
    *   Sets the `Authorization` header directly with the cleaned API Key (Client ID). **No `Bearer` prefix is used.**
    *   Handles different HTTP methods (GET, POST, etc.).
    *   Stringifies the request body if provided.
    *   Includes extensive logging for requests and responses.
    *   Parses the JSON response.
    *   Provides specific error handling for 401 Unauthorized responses.
    *   Throws errors for non-OK responses, attempting to extract error messages from the response body.
*   **Public Methods:** Each method maps to a specific Bridge API endpoint:
    *   `createCustomer(customerData)`: Calls `POST /api/v1/customers`.
    *   `getKycSchema()`: Calls `GET /api/v1/kyc/schema?provider=BRIDGE`.
    *   `initiateKyc(customerId)`: Calls `POST /api/v1/kyc/{customerId}/initiate?provider=BRIDGE`.
    *   `getKycStatus(customerId)`: Calls `GET /api/v1/kyc/{customerId}/status?provider=BRIDGE`.
    *   `createPaymentMethod(data)`: Calls `POST /api/v1/customers/{customerId}/payment_methods`.
    *   `buyTransaction(data)`: Calls `POST /api/v1/wallets/trades/buy`.
    *   `sellTransaction(data)`: Calls `POST /api/v1/wallets/trades/sell`.

An instance of this service is exported for use throughout the backend:


## 4. Backend API Endpoints (`app/api/...`)

These Next.js API routes handle requests from the frontend, interact with the `bridgeService` and the Prisma database, and return responses.

### 4.1. User Data

*   **`GET /api/users/me`**:
    *   **Purpose:** Fetches detailed user data from the Prisma database based on the `userAddress` query parameter.
    *   **Returns:** User object including `id`, `address`, `recipientWallet`, `bridgeCustomerId`, `firstName`, `lastName`, `email`, `createdAt`, `updatedAt`, `isKycCompleted`.
*   **`POST /api/users/profile`**:
    *   **Purpose:** Updates basic user profile information (currently `firstName` and `recipientWallet`) in the Prisma database using `upsert`.
    *   **Request Body:** `{ userAddress: string, firstName?: string, recipientWallet?: string }`
    *   **Returns:** Success status and basic user info.

### 4.2. Bridge Customer Management

*   **`POST /api/bridge/customer`**:
    *   **Purpose:** Creates a new customer record in Bridge and updates the corresponding user record in Prisma.
    *   **Request Body:** `{ userAddress: string, first_name: string, last_name: string, email: string, ... }`
    *   **Actions:**
        1.  Finds the user in Prisma via `userAddress`.
        2.  Calls `bridgeService.createCustomer` with provided details.
        3.  Updates the Prisma user record with the returned `bridgeCustomerId` and other profile info (`firstName`, `lastName`, `email`).
    *   **Returns:** `{ success: true, customerId: string }` or error details.
*   **`GET /api/bridge/customer`**: (Used in `profile-form.tsx`, `personal-info-page.tsx`, `wallet-page.tsx`)
    *   **Purpose:** Checks if a user (identified by `userAddress` query param) has an associated Bridge customer ID in the Prisma database.
    *   **Actions:**
        1.  Finds the user in Prisma via `userAddress`.
        2.  Checks if `user.bridgeCustomerId` exists.
    *   **Returns:** `{ hasCustomer: boolean, customerId: string | null, kycCompleted?: boolean }` (Note: `kycCompleted` seems to be fetched directly from the user record here).

### 4.3. Bridge KYC Management

*   **`POST /api/bridge/kyc/initiate`**:
    *   **Purpose:** Initiates the KYC process for a given Bridge customer.
    *   **Request Body:** `{ customerId: string }`
    *   **Actions:**
        1.  Finds the user in Prisma via `customerId` to ensure validity.
        2.  Calls `bridgeService.initiateKyc(customerId)`.
        3.  Extracts the `redirect_url` or `redirectUrl` from the Bridge response.
    *   **Returns:** `{ success: true, redirectUrl: string }` or error details.
*   **`GET /api/bridge/kyc/status`**:
    *   **Purpose:** Checks the current KYC status for a Bridge customer.
    *   **Query Parameter:** `customerId`
    *   **Actions:**
        1.  Finds the user in Prisma via `customerId`.
        2.  Calls `bridgeService.getKycStatus(customerId)`.
        3.  If the status from Bridge is `completed` and the user's `isKycCompleted` flag in Prisma is `false`, updates the Prisma record.
    *   **Returns:** `{ status: string, customerId: string, bridgeError?: string }`. Returns the status from the DB if the Bridge API call fails.
*   **`POST /api/bridge/kyc/complete`**: (Likely for testing/manual override)
    *   **Purpose:** Manually sets the `isKycCompleted` flag to `true` for a user in the Prisma database.
    *   **Request Body:** `{ customerId: string }`
    *   **Actions:** Updates the Prisma user record where `bridgeCustomerId` matches.
    *   **Returns:** `{ success: true, message: string }` or error details.

### 4.4. Bridge Payment Methods

*   **`GET /api/bridge/payment-methods`**:
    *   **Purpose:** Fetches payment methods associated with a user *from the Prisma database*.
    *   **Query Parameter:** `userAddress`
    *   **Actions:**
        1.  Finds the user in Prisma via `userAddress`.
        2.  Queries the `PaymentMethod` table for records linked to the `userId`.
    *   **Returns:** `{ paymentMethods: PaymentMethod[] }` or error details.
*   **`POST /api/bridge/payment-methods`**:
    *   **Purpose:** Adds a new bank account payment method via Bridge and saves a record in Prisma.
    *   **Request Body:** `{ userAddress: string, customerId: string, type: "BANK", bank_details: { provider: "BRIDGE", bankName: string, accountNumber: string, routingNumber: string, accountType: "CHECKING" | "SAVINGS", accountName: string } }`
    *   **Actions:**
        1.  Finds the user in Prisma via `userAddress` to verify `customerId` and get `userId`.
        2.  Calls `bridgeService.createPaymentMethod` with `customerId`, `type`, and `bank_details`.
        3.  Creates a new record in the Prisma `PaymentMethod` table, storing the `externalId` (from Bridge response), `type`, `userId`, and `details`.
    *   **Returns:** `{ success: true, paymentMethod: PaymentMethod }` or error details.
*   **`DELETE /api/bridge/payment-methods/:id`**: (Route structure inferred from `payment-methods-form.tsx`)
    *   **Purpose:** Deletes a payment method (likely both in Bridge and Prisma, though the provided backend code for DELETE is missing/commented out in `bridge-service.ts`).
    *   **Request Body:** `{ customerId: string, userAddress: string }` (Inferred)
    *   **Actions:**
        1.  (Expected) Call Bridge API to delete the payment method using `paymentMethodId` and `customerId`.
        2.  (Expected) Delete the corresponding record from the Prisma `PaymentMethod` table.
    *   **Returns:** Success or error status.

### 4.5. Bridge Wallet Addresses

*   **`POST /api/bridge/wallet-addresses`**:
    *   **Purpose:** Associates a recipient wallet address with a Bridge customer (via Bridge API) and updates the user's `recipientWallet` in Prisma.
    *   **Request Body:** `{ customerId: string, userAddress: string, walletAddress: string }`
    *   **Actions:**
        1.  Calls the Bridge API endpoint `POST /api/v1/customers/{customerId}/wallets` with the `walletAddress`. **Note:** This route directly uses `fetch` instead of `bridgeService`. It includes `Authorization: Bearer ${BRIDGE_API_KEY}` which contradicts the `bridgeService` implementation. This needs review/standardization.
        2.  Updates the `recipientWallet` field in the Prisma user record via `userAddress`.
    *   **Returns:** `{ success: true, message: string, data: any }` or error details.

### 4.6. Bridge Transactions

*   **`POST /api/bridge/transactions`**:
    *   **Purpose:** Initiates a buy or sell transaction via the Bridge API.
    *   **Request Body:** `{ type: "buy" | "sell", customerId: string, currency: string, amount: number, paymentMethodId?: string, walletAddress: string }`
    *   **Actions:**
        1.  Calls either `bridgeService.buyTransaction` or `bridgeService.sellTransaction` based on the `type`.
        2.  (Commented out) Potentially creates a `Payment` record in Prisma to track the transaction.
    *   **Returns:** `{ success: true, transactionId: string }` or error details.

### 4.7. Webhooks

*   **`POST /api/bridge/webhook/kyc`**:
    *   **Purpose:** Receives KYC status updates from Bridge.
    *   **Actions:**
        1.  (Optional/Production) Verifies the `bridge-signature` header using `BRIDGE_WEBHOOK_SECRET`.
        2.  Parses the request body.
        3.  If `event === 'kyc.status_updated'` and `status === 'completed'`, updates the `isKycCompleted` flag to `true` for the user matching `customer_id` in Prisma.
    *   **Returns:** `{ success: true }` (Always returns 200 OK to acknowledge receipt, even if processing fails internally).
*   **`POST /api/webhooks/bridge`**:
    *   **Purpose:** Receives generic transaction updates from Bridge.
    *   **Actions:**
        1.  (Optional/Production) Verifies the `x-bridge-signature` header using `BRIDGE_CLIENT_SECRET`.
        2.  Parses the request body.
        3.  If `event === 'transaction.update'`, finds the corresponding `Payment` record in Prisma using `transaction_id` (as `externalId`).
        4.  Updates the `status` of the Prisma `Payment` record based on the webhook status (`completed` -> `confirmed`, `failed` -> `failed`, etc.).
        5.  Stores the webhook payload in the payment's metadata.
    *   **Returns:** `{ success: true }` or error details (returns 200 OK on success, 404 if payment not found, 500 on other errors).

## 5. Frontend Implementation (`app/profile/...`, `components/profile/...`)

The frontend uses Next.js App Router pages and React components (built with Shadcn UI) to provide the user interface for profile management.

### 5.1. Main Profile Page (`app/profile/page.tsx`)

*   **Purpose:** Displays an overview of the user's profile and provides navigation to different settings sections.
*   **Data Fetching:** Uses `useEffect` and `usePrivy` to fetch user data from `/api/users/me` once authenticated.
*   **UI:**
    *   Uses `ProfileHeader` component.
    *   Displays user avatar, name (first/last), wallet address, and last login time.
    *   Renders `UserProfileForm` to allow editing basic info (first name, recipient wallet).
    *   Provides links (wrapped in Buttons within a Card) to sub-pages: Payment Methods, KYC Verification, Wallet Settings.

### 5.2. Sub-Pages (`app/profile/.../page.tsx`)

These pages follow a similar pattern:

*   Use `usePrivy` for authentication context.
*   Use `useEffect` to fetch necessary data on load (usually user data from `/api/users/me` to get `bridgeCustomerId`, and potentially specific data like payment methods or KYC status).
*   Display loading states.
*   Render the corresponding form component (`PersonalInfoForm`, `KycVerificationForm`, etc.), passing down necessary props like `customerId`, initial data, and `onSuccess` callbacks.
*   Include a "Back to Profile" link/button.

### 5.3. Profile Form Components (`components/profile/...`)

*   **`PersonalInfoForm.tsx`**:
    *   Collects first name, last name, email.
    *   Uses `react-hook-form` and `zod` for validation.
    *   On submit, calls `POST /api/bridge/customer`.
    *   Displays an alert if the customer account already exists (`hasCustomer` prop).
    *   Calls `onSuccess(customerId)` after successful creation.
*   **`KycVerificationForm.tsx`**:
    *   Displays current KYC status (`isCompleted` prop, internal `kycStatus` state).
    *   **Status Checking:**
        *   Uses `useEffect` to periodically poll `GET /api/bridge/kyc/status` if status is not 'completed'.
        *   Updates internal `kycStatus` based on the API response.
        *   Calls `onSuccess()` if status becomes 'completed'.
    *   **Initiation:**
        *   Provides a "Start KYC" button if status is `not_started` or similar.
        *   On click, calls `POST /api/bridge/kyc/initiate`.
        *   If successful, receives a `redirectUrl`, opens it in a new tab (`window.open`), and sets internal status to `pending`.
*   **`PaymentMethodsForm.tsx`**:
    *   Displays a table of existing payment methods (passed via `paymentMethods` prop).
    *   Provides an "Add Bank Account" button triggering a Dialog.
    *   **Add Dialog:**
        *   Uses `react-hook-form` and `zod` (`bankAccountSchema`) for bank detail validation (name, account/routing number, type, account name).
        *   On submit, calls `POST /api/bridge/payment-methods`.
        *   On success, calls `onSuccess(updatedMethods)` to refresh the list in the parent, closes the dialog, resets the form, and shows a success toast.
    *   **Deletion:**
        *   Provides a delete button for each method.
        *   On click, calls `DELETE /api/bridge/payment-methods/:id`.
        *   On success, calls `onSuccess(updatedMethods)` to refresh the list and shows a success toast.
*   **`WalletAddressesForm.tsx`**:
    *   Collects a recipient wallet address.
    *   Uses `react-hook-form` and `zod` for validation (Ethereum address format).
    *   Fetches the current recipient wallet address from user data (`/api/users/me`) to pre-fill the form.
    *   On submit, calls `POST /api/bridge/wallet-addresses`.
    *   Calls `onSuccess()` on successful update.
*   **`UserProfileForm.tsx`**:
    *   Collects `firstName`.
    *   Uses `react-hook-form` and `zod`.
    *   On submit, calls `POST /api/users/profile` to update the user's basic info in Prisma.

## 6. Data Flow Examples

*   **New User Onboarding (Profile Creation & KYC):**
    1.  User connects wallet (Privy).
    2.  User navigates to Profile -> Personal Info.
    3.  `PersonalInfoForm` loads, `hasCustomer` is false.
    4.  User fills form, submits.
    5.  Frontend calls `POST /api/bridge/customer`.
    6.  Backend calls `bridgeService.createCustomer`.
    7.  Bridge API creates customer, returns ID.
    8.  Backend updates Prisma User with `bridgeCustomerId`, `firstName`, etc.
    9.  Backend returns `{ success: true, customerId }`.
    10. Frontend receives success, calls `onSuccess(customerId)`, potentially navigates or updates UI state.
    11. User navigates to Profile -> KYC Verification.
    12. `KycVerificationForm` loads, `isCompleted` is false. Polls `/api/bridge/kyc/status` (status likely 'not_started' or 'pending').
    13. User clicks "Start KYC".
    14. Frontend calls `POST /api/bridge/kyc/initiate` with `customerId`.
    15. Backend calls `bridgeService.initiateKyc`.
    16. Bridge API returns `{ redirectUrl }`.
    17. Backend returns `{ success: true, redirectUrl }`.
    18. Frontend opens `redirectUrl` in a new tab, sets internal status to 'pending'.
    19. Frontend continues polling `/api/bridge/kyc/status`.
    20. User completes KYC flow in the Bridge tab.
    21. Bridge sends webhook `POST /api/bridge/webhook/kyc` with `status: 'completed'`.
    22. Webhook handler updates Prisma User `isKycCompleted = true`.
    23. Frontend polling eventually receives `status: 'completed'` from `/api/bridge/kyc/status`.
    24. `KycVerificationForm` updates UI to show "Completed", calls `onSuccess()`.

*   **Adding a Bank Account:**
    1.  User navigates to Profile -> Payment Methods.
    2.  `PaymentMethodsPage` fetches user data (`/api/users/me`) and existing methods (`/api/bridge/payment-methods`).
    3.  `PaymentMethodsForm` displays existing methods.
    4.  User clicks "Add Bank Account", dialog opens.
    5.  User fills bank details, submits form.
    6.  Frontend calls `POST /api/bridge/payment-methods` with `customerId` and bank details.
    7.  Backend calls `bridgeService.createPaymentMethod`.
    8.  Bridge API adds method, returns ID.
    9.  Backend creates `PaymentMethod` record in Prisma.
    10. Backend returns `{ success: true, paymentMethod }`.
    11. Frontend receives success, calls `onSuccess(newMethodsList)` (after re-fetching), closes dialog, shows toast.

## 7. Key Dependencies

*   **Next.js:** Framework
*   **React:** UI Library
*   **Prisma:** Database ORM
*   **Privy:** Authentication (`@privy-io/react-auth`)
*   **WAGMI / Viem:** Wallet interaction (implied by `useAccount`, `useWallets`)
*   **Shadcn UI / Tailwind CSS:** UI Components & Styling
*   **React Hook Form / Zod:** Form management and validation
*   **Lucide React:** Icons
*   **date-fns:** Date formatting

## 8. Potential Improvements & TODOs

*   **Standardize API Authorization:** The direct `fetch` call in `POST /api/bridge/wallet-addresses` uses `Bearer` while `bridgeService` does not. This should be consistent. Clarify if `Bearer` is actually required by the Bridge API.
*   **Consolidate Webhooks:** Review if two separate webhook handlers (`/api/bridge/webhook/kyc` and `/api/webhooks/bridge`) are necessary or if they can be combined.
*   **Implement Payment Method Deletion:** The backend logic for deleting payment methods in `bridgeService` seems missing/commented out. Implement this if required.
*   **Error Handling:** Enhance error handling, potentially providing more user-friendly messages based on specific Bridge API error codes.
*   **Refine Polling:** Consider using WebSockets or Server-Sent Events instead of polling for KYC status updates for better efficiency, although the webhook should be the primary mechanism.
*   **Configuration Clarity:** Clarify the duplication/naming convention between `CROWDSPLIT` and `BRIDGE` environment variables.
*   **Transaction Tracking:** Fully implement the creation and updating of `Payment` records in Prisma for buy/sell transactions if needed for internal tracking.