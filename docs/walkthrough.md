# Walkthrough: Phase 5 - Implement User Model (Step 1)

We have successfully implemented **Step 1 of the Authentication Architecture**, creating the core User data model with Mongoose schemas and strict TypeScript definitions.

## Key Changes

### User Model File
- Created [server/src/models/user.model.ts](file:///c:/Projects/ResQNet/server/src/models/user.model.ts):
  - Defined `UserRole` union: `'Citizen' | 'Volunteer' | 'Dispatcher' | 'Hospital' | 'Admin'`.
  - Defined interfaces for `IRefreshToken`, `IGeoJSONPoint`, `IUser`, and `IUserDocument`.
  - Implemented nested Mongoose schemas for `RefreshTokenSchema` and `GeoJSONPointSchema`.
  - Implemented `UserSchema` mapped to the requirements:
    - **Basics:** `name`, `email`, `password` (default select false), `role`, `phone`, `avatar`.
    - **Geospatial:** `location` (GeoJSON `Point` with `2dsphere` index support).
    - **Verification & Recoveries:** `isVerified`, `verificationToken`, `verificationTokenExpires`, `passwordResetToken`, `passwordResetExpires`.
    - **Account State & Security:** `refreshTokens`, `isActive`, `lastLogin`, `failedLoginAttempts`, `accountLockedUntil`.
    - **System metadata:** `timestamps: true` (creating `createdAt` and `updatedAt`).

## Verification Results

### Build Compilation
- Ran verification compile tests:
  ```bash
  > npm run build
  > tsc
  ```
  *Result: Compiled successfully with zero compiler errors.*
