import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

export class AuthController {
    static async register(req: Request, res: Response) {
        try {
            const result = await AuthService.register(req.body);

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                user: result.user,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            const result = await AuthService.login(email, password);

            return res.status(200).json({
                success: true,
                message: "Login successful",
                accessToken: result.accessToken,
                refreshToken: result.refreshToken,
                user: result.user,
            });
        } catch (error: any) {
            return res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }
}