
import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  // Use higher salt rounds for better security
  const saltRounds = 14;
  return await bcrypt.hash(password, saltRounds);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizeString = (input: string): string => {
  // Remove dangerous characters and trim whitespace
  return input.trim().replace(/[<>]/g, '').slice(0, 1000); // Limit length to prevent DoS
};

export const generateSecurePassword = (): string => {
  const length = 16; // Increased length for better security
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const symbols = "!@#$%^&*";
  
  let password = "";
  
  // Ensure at least one character from each category
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));
  
  // Fill the rest randomly
  const allChars = lowercase + uppercase + numbers + symbols;
  for (let i = 4; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
};

// Rate limiting helper for authentication attempts
const authAttempts = new Map<string, { count: number; lastAttempt: number }>();

export const checkRateLimit = (identifier: string): boolean => {
  const now = Date.now();
  const maxAttempts = 5;
  const windowMs = 15 * 60 * 1000; // 15 minutes
  
  const attempts = authAttempts.get(identifier);
  
  if (!attempts) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Reset if window has passed
  if (now - attempts.lastAttempt > windowMs) {
    authAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }
  
  // Check if max attempts exceeded
  if (attempts.count >= maxAttempts) {
    return false;
  }
  
  // Increment attempts
  attempts.count++;
  attempts.lastAttempt = now;
  authAttempts.set(identifier, attempts);
  
  return true;
};

export const resetRateLimit = (identifier: string): void => {
  authAttempts.delete(identifier);
};

// Validate session token format
export const isValidSessionFormat = (sessionData: any): boolean => {
  if (!sessionData || typeof sessionData !== 'object') return false;
  
  const required = ['id', 'nome_completo', 'email', 'cargo', 'ativo', 'expiresAt'];
  return required.every(field => sessionData.hasOwnProperty(field));
};

// Generate secure session token
export const generateSessionToken = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
