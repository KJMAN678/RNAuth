import { Stack } from 'expo-router/stack';
import { AuthGuard } from '../../components/AuthGuard';

export default function ProtectedLayout() {
  return (
    <AuthGuard>
      <Stack>
        <Stack.Screen 
          name="profile" 
          options={{ 
            title: 'プロフィール',
            headerShown: true 
          }} 
        />
      </Stack>
    </AuthGuard>
  );
}
