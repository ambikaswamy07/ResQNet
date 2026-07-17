import { Request, Response } from "express";
import { VolunteerService } from "../services/volunteer.service";

export class VolunteerController {
    static async getAvailable(req: Request, res: Response) {
        try {
            const volunteers = await VolunteerService.getAvailableVolunteers();

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

    static async dashboard(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            const data = await VolunteerService.getVolunteerDashboard(id);

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

    static async updateAvailability(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { isAvailable } = req.body;

            const volunteer = await VolunteerService.updateAvailability(
                id,
                isAvailable
            );

            return res.status(200).json({
                success: true,
                message: "Availability updated successfully",
                data: volunteer,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    static async nearbyIncidents(req: Request, res: Response) {
        try {
            const incidents = await VolunteerService.getNearbyIncidents();

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

    static async completed(req: Request, res: Response) {
        try {
            const id = req.params.id as string;

            const incidents = await VolunteerService.myCompletedIncidents(id);

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