import { Schema, model, Document } from "mongoose";
import { USER_ROLES, UserRole } from "../constants/roles";

export interface IRefreshToken {
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
}

export interface IGeoJSONPoint {
  type: "Point";
  coordinates: [number, number];
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

  // Volunteer
  isAvailable: boolean;
  skills: string[];
  experience: number;
  currentIncident?: Schema.Types.ObjectId | null;
  rating: number;
  completedIncidents: number;

  // Hospital
  hospitalName?: string;
  hospitalAddress?: string;
  totalBeds: number;
  availableBeds: number;

  // Common
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
    },

    isVerified: {
      type: Boolean,
      default: false,
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
    },

    location: {
      type: GeoJSONPointSchema,
      default: () => ({
        type: "Point",
        coordinates: [0, 0],
      }),
    },

    // Volunteer

    isAvailable: {
      type: Boolean,
      default: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: Number,
      default: 0,
    },

    currentIncident: {
      type: Schema.Types.ObjectId,
      ref: "Incident",
      default: null,
    },

    rating: {
      type: Number,
      default: 5,
    },

    completedIncidents: {
      type: Number,
      default: 0,
    },

    // Hospital

    hospitalName: {
      type: String,
      default: "",
    },

    hospitalAddress: {
      type: String,
      default: "",
    },

    totalBeds: {
      type: Number,
      default: 0,
    },

    availableBeds: {
      type: Number,
      default: 0,
    },

    // Common

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
      default: null,
    },

    failedLoginAttempts: {
      type: Number,
      default: 0,
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

UserSchema.index({ location: "2dsphere" });

export const User = model<IUserDocument>("User", UserSchema);

export default User;