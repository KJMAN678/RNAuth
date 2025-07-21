import { Stack } from 'expo-router/stack';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { useEffect } from 'react';
import { router, useSegments } from 'expo-router';

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    console.log('🔄 [Layout] Navigation check:', { isAuthenticated, isLoading, segments });
    
    if (!isLoading) {
      const inAuthGroup = segments[0] === '(auth)';
      
      console.log('🔄 [Layout] Navigation decision:', { inAuthGroup, isAuthenticated });
      
      if (!isAuthenticated && !inAuthGroup) {
        console.log('➡️ [Layout] Redirecting to login');
        router.replace('/(auth)/login');
      } else if (isAuthenticated && inAuthGroup) {
        console.log('➡️ [Layout] Redirecting to tabs');
        router.replace('/(tabs)');
      }
    }
  }, [isAuthenticated, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(protected)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}
