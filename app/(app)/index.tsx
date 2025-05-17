import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Home' }}/>
      <Text style={styles.title}>Welcome to your App!</Text>
      <Text>This is the home screen.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});

export default HomeScreen; 