import { Request, Response } from "express";
import { DispatcherService } from "../services/dispatcher.service";

export class DispatcherController {
    static async dashboard(req: Request, res: Response) {
        try {
            const data = await DispatcherService.dashboard();

            return res.status(200).json({
                success: true,
                data,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async availableVolunteers(
        req: Request,
        res: Response
    ) {
        try {
            const volunteers =
                await DispatcherService.availableVolunteers();

            return res.status(200).json({
                success: true,
                count: volunteers.length,
                data: volunteers,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async pendingIncidents(
        req: Request,
        res: Response
    ) {
        try {
            const incidents =
                await DispatcherService.pendingIncidents();

            return res.status(200).json({
                success: true,
                count: incidents.length,
                data: incidents,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}