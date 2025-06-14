
interface RateLimitData {
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const RATE_LIMIT_STORAGE_KEY = 'auth_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes
const RESET_WINDOW = 60 * 60 * 1000; // 1 hour

class AuthRateLimit {
  private getRateLimitData(identifier: string): RateLimitData {
    try {
      const stored = localStorage.getItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier}`);
      if (!stored) return { attempts: 0, lastAttempt: 0 };
      return JSON.parse(stored);
    } catch {
      return { attempts: 0, lastAttempt: 0 };
    }
  }

  private setRateLimitData(identifier: string, data: RateLimitData): void {
    try {
      localStorage.setItem(`${RATE_LIMIT_STORAGE_KEY}_${identifier}`, JSON.stringify(data));
    } catch {
      // Silently fail if localStorage is not available
    }
  }

  public checkRateLimit(identifier: string): { allowed: boolean; timeRemaining?: number } {
    const now = Date.now();
    const data = this.getRateLimitData(identifier);

    // Reset if window has passed
    if (now - data.lastAttempt > RESET_WINDOW) {
      this.setRateLimitData(identifier, { attempts: 0, lastAttempt: 0 });
      return { allowed: true };
    }

    // Check if currently blocked
    if (data.blockedUntil && now < data.blockedUntil) {
      const timeRemaining = Math.ceil((data.blockedUntil - now) / 1000);
      return { allowed: false, timeRemaining };
    }

    // Check attempt limit
    if (data.attempts >= MAX_ATTEMPTS) {
      const blockedUntil = now + LOCKOUT_DURATION;
      this.setRateLimitData(identifier, { ...data, blockedUntil });
      return { allowed: false, timeRemaining: Math.ceil(LOCKOUT_DURATION / 1000) };
    }

    return { allowed: true };
  }

  public recordAttempt(identifier: string, success: boolean): void {
    const now = Date.now();
    const data = this.getRateLimitData(identifier);

    if (success) {
      // Reset on successful login
      this.setRateLimitData(identifier, { attempts: 0, lastAttempt: now });
    } else {
      // Increment failed attempts
      const newAttempts = data.attempts + 1;
      let blockedUntil = data.blockedUntil;

      if (newAttempts >= MAX_ATTEMPTS) {
        blockedUntil = now + LOCKOUT_DURATION;
      }

      this.setRateLimitData(identifier, {
        attempts: newAttempts,
        lastAttempt: now,
        blockedUntil
      });
    }
  }

  public getRemainingAttempts(identifier: string): number {
    const data = this.getRateLimitData(identifier);
    return Math.max(0, MAX_ATTEMPTS - data.attempts);
  }
}

export const authRateLimit = new AuthRateLimit();
