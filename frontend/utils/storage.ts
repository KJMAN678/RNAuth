import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ネイティブ環境のみ SecureStore をロード
let nativeSecureStore: typeof import('expo-secure-store') | null = null;
if (Platform.OS !== 'web') {
  // `require` を使うことで web バンドルに含まれないようにする
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  nativeSecureStore = require('expo-secure-store');
}

// プラットフォーム毎にストレージを切り替えるユーティリティ
const storage = {
  getItem: async (key: string): Promise<string | null> => {
    if (Platform.OS === 'web') {
      return AsyncStorage.getItem(key);
    }
    return nativeSecureStore!.getItemAsync(key);
  },
  setItem: async (key: string, value: string): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem(key, value);
      return;
    }
    await nativeSecureStore!.setItemAsync(key, value);
  },
  deleteItem: async (key: string): Promise<void> => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem(key);
      return;
    }
    await nativeSecureStore!.deleteItemAsync(key);
  },
} as const;

import { AUTH_CONFIG } from './auth';

export interface StoredUser {
  id: string;
  email: string;
  name?: string;
}

export const AuthStorage = {
  async setAuthData(user: StoredUser, token: string, expiryTime: number): Promise<void> {
    try {
      await Promise.all([
        storage.setItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token),
        storage.setItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()),
        storage.setItem(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user)),
      ]);
    } catch (error) {
      console.error('認証データの保存に失敗:', error);
      throw new Error('認証データの保存に失敗しました');
    }
  },

  async getAuthData(): Promise<{
    token: string | null;
    expiryTime: number | null;
    user: StoredUser | null;
  }> {
    try {
      console.log('📦 [Storage] 認証データ取得開始');
      const [token, expiry, userJson] = await Promise.all([
        storage.getItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TOKEN),
        storage.getItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY),
        storage.getItem(AUTH_CONFIG.STORAGE_KEYS.USER),
      ]);

      console.log('📦 [Storage] 生データ:', { 
        token: token ? token.substring(0, 10) + '...' : null, 
        expiry, 
        userJson: userJson ? userJson.substring(0, 50) + '...' : null 
      });

      const expiryTime = expiry ? parseInt(expiry) : null;
      const user = userJson ? JSON.parse(userJson) : null;

      if (user) {
        console.log('📦 [Storage] ユーザーデータパース成功:', { userId: user?.id, email: user?.email });
      }

      console.log('📦 [Storage] 認証データ取得完了:', { hasToken: !!token, hasUser: !!user, expiryTime });

      return {
        token,
        expiryTime,
        user,
      };
    } catch (error) {
      console.error('❌ [Storage] 認証データの取得に失敗:', error);
      return {
        token: null,
        expiryTime: null,
        user: null,
      };
    }
  },

  async clearAuthData(): Promise<void> {
    try {
      await Promise.all([
        storage.deleteItem(AUTH_CONFIG.STORAGE_KEYS.AUTH_TOKEN),
        storage.deleteItem(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY),
        storage.deleteItem(AUTH_CONFIG.STORAGE_KEYS.USER),
      ]);
    } catch (error) {
      console.error('認証データの削除に失敗:', error);
    }
  },

  async isTokenValid(): Promise<boolean> {
    try {
      console.log('🔍 [Storage] トークン検証開始');
      const { token, expiryTime } = await this.getAuthData();
      
      console.log('🔍 [Storage] 取得データ:', { hasToken: !!token, hasExpiryTime: !!expiryTime, expiryTime });
      
      if (!token || !expiryTime) {
        console.log('❌ [Storage] トークンまたは有効期限が存在しません');
        return false;
      }

      const currentTime = Date.now();
      const isValid = currentTime < expiryTime;
      console.log('🔍 [Storage] トークン検証結果:', { isValid, currentTime, expiryTime, diff: expiryTime - currentTime });
      
      return isValid;
    } catch (error) {
      console.error('❌ [Storage] トークン検証に失敗:', error);
      return false;
    }
  },
};
