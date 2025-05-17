# React Native Expo App with Supabase Authentication

This project demonstrates a basic React Native application built with Expo, using Supabase for user authentication (signup, login, logout) and session management.

## Key Setup Steps & Configurations

Getting Supabase authentication to work smoothly in a React Native Expo environment involved several key configurations and troubleshooting steps:

1.  **Dependencies:**
    *   `@supabase/supabase-js`: The official Supabase JavaScript client.
    *   `expo-router`: For file-based routing.
    *   `react-native-url-polyfill`: Crucial for providing a stable networking layer for Supabase, especially for `fetch`. **This must be the very first import in your Supabase client initialization file.**
    *   `@react-native-async-storage/async-storage`: Used for persistent session storage. `ExpoSecureStore` was initially tried but encountered size limitations with Supabase session tokens, leading to `AuthSessionMissingError` or truncated session issues. `AsyncStorage` does not have these size limits.
    *   `react-native-elements`: For UI components (optional, but used in this setup).
    *   `expo-secure-store`: Initially used for session storage, but replaced by `@react-native-async-storage/async-storage` due to session size limitations.

2.  **Supabase Client Initialization (`lib/supabase.ts`):**
    *   **Order of Imports is Critical:** `import 'react-native-url-polyfill/auto';` MUST be the absolute first line in this file. This ensures that the global `fetch` and other network-related functionalities are polyfilled before the Supabase client or any other networking-dependent library is initialized.
    *   **Storage Adapter:** The Supabase client (`createClient`) was configured to use `AsyncStorage` for its `auth.storage` option.
        ```typescript
        import 'react-native-url-polyfill/auto'; // MUST be first
        import AsyncStorage from '@react-native-async-storage/async-storage';
        import { createClient } from '@supabase/supabase-js';

        // ... (environment variable loading for SUPABASE_URL and SUPABASE_ANON_KEY)

        export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
          auth: {
            storage: AsyncStorage, // Using AsyncStorage
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: false, // Important for React Native
          },
        });
        ```

3.  **Environment Variables (`.env`):**
    *   Supabase URL (`EXPO_PUBLIC_SUPABASE_URL`) and Anon Key (`EXPO_PUBLIC_SUPABASE_ANON_KEY`) must be correctly set up in an `.env` file at the project root and loaded by Expo.

4.  **Expo Router Setup:**
    *   Root layout (`app/_layout.tsx`): Manages session state and redirects users to auth screens or the main app based on their authentication status. It listens to `onAuthStateChange` from Supabase.
    *   Auth layout (`app/(auth)/_layout.tsx`): Layout for screens within the `(auth)` group (e.g., login).
    *   App layout (`app/(app)/_layout.tsx`): Layout for screens within the `(app)` group (e.g., home screen, with a logout button).
    *   `package.json` main entry: `"main": "expo-router/entry"` is required for Expo Router.

5.  **`metro.config.js` for `ws` / `stream` issue:**
    *   A `metro.config.js` file was added to resolve issues related to the `ws` package (a dependency of `supabase-js` for real-time features) trying to import the Node.js `stream` module, which isn't available in React Native.
        ```javascript
        // metro.config.js
        const { getDefaultConfig } = require('expo/metro-config');
        const config = getDefaultConfig(__dirname);

        config.resolver.unstable_conditionNames = ['browser', 'require', 'default'];
        config.resolver.unstable_enablePackageExports = false; // Or true depending on specific needs

        module.exports = config;
        ```
    *   *Note: While this was added during troubleshooting, the primary fix for network errors later appeared to be the `react-native-url-polyfill` import order and `AsyncStorage`.*

6.  **`app.json` Configuration:**
    *   A basic `app.json` was created, including a `scheme` for deep linking (important for some auth flows, though not strictly for email/password in this basic setup yet) and placeholder asset paths.
    *   The `plugins` array should include `"expo-router"`.

7.  **Troubleshooting Steps Taken:**
    *   **Network Request Failed:** This was a recurring error. The most effective solution was ensuring `react-native-url-polyfill/auto` was the first import in `lib/supabase.ts` and using `AsyncStorage`. Previous attempts to explicitly pass `fetch` via `global.fetch` in Supabase client options did not resolve this as reliably.
    *   **AuthSessionMissingError / SecureStore Size Limit:** Supabase session objects can exceed `ExpoSecureStore`'s 2KB limit. Switching to `AsyncStorage` resolved this.
    *   **Cache Clearing:** Repeatedly clearing Metro's cache (`npx expo start -c`) and reinstalling Expo Go on the simulator/device was crucial after making significant changes to dependencies or native configurations.
    *   **`--no-dev` Flag:** Running `npx expo start -c --no-dev` helps simulate a production-like environment and can sometimes surface or resolve issues differently than the standard development mode.

## Running the App

1.  Ensure you have Node.js and npm/yarn installed.
2.  Install project dependencies: `npm install` or `yarn install`.
3.  Create a `.env` file in the project root with your Supabase credentials:
    ```
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```
4.  Start the Expo development server: `npx expo start`
5.  Scan the QR code with the Expo Go app on your iOS or Android device/simulator.

This summary should cover the main points for a successful Supabase auth integration in this Expo project. 