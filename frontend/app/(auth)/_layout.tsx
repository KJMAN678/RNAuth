import { Stack } from 'expo-router/stack';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="login" 
        options={{ 
          title: 'ログイン',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="signup" 
        options={{ 
          title: 'アカウント作成',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="reset-password" 
        options={{ 
          title: 'パスワードリセット',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}
