export const AUTH_CONFIG = {
  TOKEN_EXPIRY_MINUTES: 5,
  STORAGE_KEYS: {
    AUTH_TOKEN: 'authToken',
    TOKEN_EXPIRY: 'tokenExpiry',
    USER: 'user',
  },
} as const;

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('パスワードは6文字以上である必要があります');
  }
  
  if (!/[A-Za-z]/.test(password)) {
    errors.push('パスワードには英字を含める必要があります');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('パスワードには数字を含める必要があります');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const isTokenExpired = (expiryTime: number): boolean => {
  return Date.now() >= expiryTime;
};

export const generateTokenExpiry = (minutes: number = AUTH_CONFIG.TOKEN_EXPIRY_MINUTES): number => {
  return Date.now() + (minutes * 60 * 1000);
};
