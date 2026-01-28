/**
 * Auth Types
 *
 * Re-export shared types for auth feature
 */

import { UserRole } from '@/shared';

export * from '@/shared/types';

export interface User {
  id: string;
  username: string;
  email: string;
  isDeleted: boolean;
  firstName: string;
  lastName: string;
  gender: string;
  createdAt: string;
  updatedAt: string;
  role?: UserRole;
}
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
  email: string;
  givenName: string;
  familyName: string;
}
