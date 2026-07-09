import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export interface IAccessTokenPayload {
  userId: string;
  role: string;
  isVerified: boolean;
}

/**
 * Generates a short-lived JSON Web Token (JWT) for authentication
 * @param user User object containing id, role, and verification status
 * @returns JWT access token string
 */
export const generateAccessToken = (user: { id: string; role: string; isVerified: boolean }): string => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable is not defined');
  }

  const payload: IAccessTokenPayload = {
    userId: user.id,
    role: user.role,
    isVerified: user.isVerified,
  };

  const expiresIn = process.env.JWT_ACCESS_EXPIRES || '15m';

  return jwt.sign(
    payload,
    secret as jwt.Secret,
    {
      expiresIn: expiresIn as jwt.SignOptions["expiresIn"],
    }
  );
};

/**
 * Generates a cryptographically secure random token (64 bytes) to be used as a refresh token
 * @returns 128-character hex string representing the 64-byte token
 */
export const generateRefreshToken = (): string => {
  return crypto.randomBytes(64).toString('hex');
};

/**
 * Generates a cryptographically secure random token (32 bytes) for email verification
 * @returns 64-character hex string
 */
export const generateEmailVerificationToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Generates a cryptographically secure random token (32 bytes) for password resetting
 * @returns 64-character hex string
 */
export const generatePasswordResetToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

/**
 * Hashes a token using SHA-256 algorithm for secure database storage
 * @param token Raw token string
 * @returns SHA-256 hash string in hex format
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verifies an access token and returns its decoded payload
 * @param token JWT access token
 * @returns Decoded token payload if valid, otherwise throws an error
 */
export const verifyAccessToken = (token: string): IAccessTokenPayload => {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error('JWT_ACCESS_SECRET environment variable is not defined');
  }

  return jwt.verify(token, secret) as IAccessTokenPayload;
};

/**
 * Validates the structure and format of a raw refresh token string
 * @param token Raw refresh token string
 * @returns Boolean indicating if the format matches a 128-character hex string (64 bytes)
 */
export const isValidRefreshTokenFormat = (token: string): boolean => {
  const hexRegex = /^[a-f0-9]{128}$/i;
  return hexRegex.test(token);
};
