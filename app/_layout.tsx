import React, { useState, useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { View } from 'react-native';

const InitialLayout = () => {
  const router = useRouter();
  const segments = useSegments();
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      authSubscription?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!initialized) return;

    const inAuthGroup = segments[0] === '(auth)';

    // If the user is not signed in and the initial segment is not anything in the auth group.
    if (!session && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (session && inAuthGroup) {
      // Redirect to the main app if the user is signed in and is currently in the auth group.
      router.replace('/(app)');
    }
  }, [session, segments, initialized, router]);

  // Render a loading indicator or splash screen while checking authentication
  if (!initialized) {
    return <View /> // Or your custom loading component
  }

  return <Slot />;
};

export default InitialLayout; 