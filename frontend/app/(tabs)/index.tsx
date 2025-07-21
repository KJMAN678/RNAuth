import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function Tab() {
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>読み込み中...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ホーム</Text>
      <Text style={styles.subtitle}>認証システムのデモアプリへようこそ</Text>
      
      {isAuthenticated ? (
        <View style={styles.authSection}>
          <Text style={styles.welcomeText}>
            ようこそ、{user?.name || user?.email}さん！
          </Text>
          <TouchableOpacity
            style={styles.profileButton}
            onPress={() => router.push('/(protected)/profile')}
          >
            <Text style={styles.buttonText}>プロフィールを見る</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.logoutButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>ログアウト</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.authSection}>
          <Text style={styles.authPrompt}>
            アカウントをお持ちでない方は新規登録、
            {'\n'}既にアカウントをお持ちの方はログインしてください
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.signupButton]}
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text style={styles.buttonText}>新規登録</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.loginButton]}
            onPress={() => router.push('/(auth)/login')}
          >
            <Text style={styles.buttonText}>ログイン</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  authSection: {
    width: '100%',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
  },
  authPrompt: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  button: {
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  signupButton: {
    backgroundColor: '#007AFF',
  },
  loginButton: {
    backgroundColor: '#34C759',
  },
  profileButton: {
    backgroundColor: '#5856D6',
    width: '80%',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
