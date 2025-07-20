import * as SecureStore from 'expo-secure-store';
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
        SecureStore.setItemAsync(AUTH_CONFIG.STORAGE_KEYS.AUTH_TOKEN, token),
        SecureStore.setItemAsync(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY, expiryTime.toString()),
        SecureStore.setItemAsync(AUTH_CONFIG.STORAGE_KEYS.USER, JSON.stringify(user)),
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
      const [token, expiry, userJson] = await Promise.all([
        SecureStore.getItemAsync(AUTH_CONFIG.STORAGE_KEYS.AUTH_TOKEN),
        SecureStore.getItemAsync(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY),
        SecureStore.getItemAsync(AUTH_CONFIG.STORAGE_KEYS.USER),
      ]);

      const expiryTime = expiry ? parseInt(expiry) : null;
      const user = userJson ? JSON.parse(userJson) : null;

      return {
        token,
        expiryTime,
        user,
      };
    } catch (error) {
      console.error('認証データの取得に失敗:', error);
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
        SecureStore.deleteItemAsync(AUTH_CONFIG.STORAGE_KEYS.AUTH_TOKEN),
        SecureStore.deleteItemAsync(AUTH_CONFIG.STORAGE_KEYS.TOKEN_EXPIRY),
        SecureStore.deleteItemAsync(AUTH_CONFIG.STORAGE_KEYS.USER),
      ]);
    } catch (error) {
      console.error('認証データの削除に失敗:', error);
    }
  },

  async isTokenValid(): Promise<boolean> {
    try {
      const { token, expiryTime } = await this.getAuthData();
      
      if (!token || !expiryTime) {
        return false;
      }

      return Date.now() < expiryTime;
    } catch (error) {
      console.error('トークン検証に失敗:', error);
      return false;
    }
  },
};
