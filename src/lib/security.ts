/**
 * Security utilities for input validation and sanitization
 */

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;

/**
 * Validates email format
 */
export const validateEmail = (
  email: string,
): { isValid: boolean; error?: string } => {
  if (!email) {
    return { isValid: false, error: "Email is required" };
  }

  if (!EMAIL_REGEX.test(email)) {
    return { isValid: false, error: "Please enter a valid email address" };
  }

  if (email.length > 254) {
    return { isValid: false, error: "Email address is too long" };
  }

  return { isValid: true };
};

/**
 * Validates password strength
 */
export const validatePassword = (
  password: string,
): { isValid: boolean; error?: string } => {
  if (!password) {
    return { isValid: false, error: "Password is required" };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
    };
  }

  if (password.length > 128) {
    return { isValid: false, error: "Password is too long" };
  }

  if (!PASSWORD_REGEX.test(password)) {
    return {
      isValid: false,
      error:
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    };
  }

  return { isValid: true };
};

/**
 * Validates name input
 */
export const validateName = (
  name: string,
): { isValid: boolean; error?: string } => {
  if (!name) {
    return { isValid: false, error: "Name is required" };
  }

  const trimmedName = name.trim();

  if (trimmedName.length < 2) {
    return { isValid: false, error: "Name must be at least 2 characters long" };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: "Name must be less than 50 characters" };
  }

  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmedName)) {
    return {
      isValid: false,
      error: "Name can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { isValid: true };
};

/**
 * Sanitizes HTML content to prevent XSS attacks
 */
export const sanitizeHtml = (input: string): string => {
  if (typeof input !== "string") return "";

  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Validates and sanitizes search query
 */
export const validateSearchQuery = (
  query: string,
): { isValid: boolean; sanitized: string; error?: string } => {
  if (!query) {
    return { isValid: false, sanitized: "", error: "Search query is required" };
  }

  const trimmedQuery = query.trim();

  if (trimmedQuery.length > 100) {
    return { isValid: false, sanitized: "", error: "Search query is too long" };
  }

  // Remove potentially dangerous characters
  const sanitized = sanitizeHtml(trimmedQuery);

  return { isValid: true, sanitized };
};

/**
 * Rate limiting helper for authentication
 */
class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> =
    new Map();
  private maxAttempts: number;
  private windowMs: number;

  constructor(maxAttempts: number = 5, windowMs: number = 15 * 60 * 1000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
  }

  isRateLimited(identifier: string): boolean {
    const now = Date.now();
    const attemptData = this.attempts.get(identifier);

    if (!attemptData) {
      return false;
    }

    if (now > attemptData.resetTime) {
      this.attempts.delete(identifier);
      return false;
    }

    return attemptData.count >= this.maxAttempts;
  }

  recordAttempt(identifier: string): void {
    const now = Date.now();
    const attemptData = this.attempts.get(identifier);

    if (!attemptData || now > attemptData.resetTime) {
      this.attempts.set(identifier, {
        count: 1,
        resetTime: now + this.windowMs,
      });
    } else {
      attemptData.count++;
    }
  }

  getRemainingTime(identifier: string): number {
    const attemptData = this.attempts.get(identifier);
    if (!attemptData) return 0;

    return Math.max(0, attemptData.resetTime - Date.now());
  }
}

export const authRateLimiter = new RateLimiter();

/**
 * Generates a secure session token (simplified for demo)
 */
export const generateSessionToken = (): string => {
  const array = new Uint8Array(32);
  window.crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
};

/**
 * Checks if a URL is safe for redirection
 */
export const isSafeUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url, window.location.origin);
    return parsedUrl.origin === window.location.origin;
  } catch {
    return false;
  }
};

/**
 * Simple hash function for passwords (use proper bcrypt in production)
 */
export const hashPassword = async (password: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "disney-clone-salt");
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

/**
 * Verify password hash
 */
export const verifyPassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
};
