import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { Button } from 'react-native-elements';
import { supabase } from '../../lib/supabase';
import { Feather } from '@expo/vector-icons'; // Import an icon library

const AppLayout = () => {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      router.replace('/(auth)/login');
    }
  };

  return (
    <Stack>
      <Stack.Screen
        name="index" // This refers to app/(app)/index.tsx
        options={{
          title: 'Home',
          headerRight: () => (
            <Button
              onPress={handleLogout}
              icon={<Feather name="log-out" size={24} color="blue" />}
              type="clear"
            />
          ),
        }}
      />
    </Stack>
  );
};

export default AppLayout; 