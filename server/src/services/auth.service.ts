import bcrypt from "bcrypt";
import User, { IUserDocument } from "../models/user.model";
import {
    generateAccessToken,
    generateRefreshToken,
    hashToken,
} from "./token.service";

export interface RegisterDTO {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
}

export class AuthService {
    static async register(data: RegisterDTO) {
        const existing = await User.findOne({ email: data.email });

        if (existing) {
            throw new Error("User already exists");
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const refreshToken = generateRefreshToken();

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            phone: data.phone,
            role: data.role,
            isVerified: false,
            refreshTokens: [
                {
                    tokenHash: hashToken(refreshToken),
                    expiresAt: new Date(
                        Date.now() + 30 * 24 * 60 * 60 * 1000
                    ),
                },
            ],
            location: {
                type: "Point",
                coordinates: [0, 0],
            },
        });

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            isVerified: user.isVerified,
        });

        return {
            user,
            accessToken,
            refreshToken,
        };
    }

    static async login(email: string, password: string) {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            throw new Error("Invalid credentials");
        }
        if (!user.isActive) {
            throw new Error("Account is disabled");
        }

        const match = await bcrypt.compare(
            password,
            user.password as string
        );

        if (!match) {
            throw new Error("Invalid credentials");
        }

        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role,
            isVerified: user.isVerified,
        });

        const refreshToken = generateRefreshToken();

        // Remove expired refresh tokens
        user.refreshTokens = user.refreshTokens.filter(
            (token) => token.expiresAt > new Date()
        );

        // Add the new refresh token
        user.refreshTokens.push({
            tokenHash: hashToken(refreshToken),
            expiresAt: new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
            ),
            createdAt: new Date(),
        });

        user.lastLogin = new Date();

        await user.save();

        return {
            user,
            accessToken,
            refreshToken,
        };
    }
}