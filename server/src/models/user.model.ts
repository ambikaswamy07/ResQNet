import { Schema, model, Document } from "mongoose";
import { USER_ROLES, UserRole } from "../constants/roles";

export interface IRefreshToken {
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IGeoJSONPoint {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  isVerified: boolean;
  verificationToken?: string | null;
  verificationTokenExpires?: Date | null;
  passwordResetToken?: string | null;
  passwordResetExpires?: Date | null;
  refreshTokens: IRefreshToken[];
  avatar?: string;
  phone: string;
  location: IGeoJSONPoint;
  isActive: boolean;
  lastLogin?: Date | null;
  failedLoginAttempts: number;
  accountLockedUntil?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document { }

const RefreshTokenSchema = new Schema<IRefreshToken>(
  {
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const GeoJSONPointSchema = new Schema<IGeoJSONPoint>(
  {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point",
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
      default: [0, 0],
    },
  },
  { _id: false }
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: USER_ROLES,
      default: "Citizen",
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    verificationToken: {
      type: String,
      default: null,
    },

    verificationTokenExpires: {
      type: Date,
      default: null,
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    refreshTokens: {
      type: [RefreshTokenSchema],
      default: [],
    },

    avatar: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: GeoJSONPointSchema,
      required: true,
      default: () => ({
        type: "Point",
        coordinates: [0, 0],
      }),
    },

    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
      required: true,
    },

    accountLockedUntil: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Spatial index for location-based queries
UserSchema.index({ location: "2dsphere" });

export const User = model<IUserDocument>("User", UserSchema);

export default User;