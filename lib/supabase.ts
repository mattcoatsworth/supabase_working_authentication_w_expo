import 'react-native-url-polyfill/auto';
// import * as SecureStore from 'expo-secure-store'; // Commenting out SecureStore
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importing AsyncStorage
import { createClient } from '@supabase/supabase-js';

// const ExpoSecureStoreAdapter = { // Commenting out SecureStoreAdapter
//   getItem: (key: string) => {
//     return SecureStore.getItemAsync(key);
//   },
//   setItem: (key: string, value: string) => {
//     SecureStore.setItemAsync(key, value);
//   },
//   removeItem: (key: string) => {
//     SecureStore.deleteItemAsync(key);
//   },
// };

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log('Supabase URL or Anon Key is missing. Please check your environment variables.');
  // You might want to throw an error here or handle it differently
}

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    // storage: ExpoSecureStoreAdapter as any, // Using AsyncStorage now
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
  // global: { // Removing this, relying on polyfill being first import
  //   fetch: fetch,
  // },
}); 