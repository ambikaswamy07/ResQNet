import { Request, Response } from "express";
import { HospitalService } from "../services/hospital.service";

export class HospitalController {

    // =====================================
    // Hospital Dashboard
    // =====================================
    static async dashboard(req: Request, res: Response) {
        try {

            const data = await HospitalService.dashboard();

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

    // =====================================
    // Get All Hospitals
    // =====================================
    static async getAll(req: Request, res: Response) {
        try {

            const hospitals =
                await HospitalService.getAllHospitals();

            return res.status(200).json({
                success: true,
                count: hospitals.length,
                data: hospitals,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    // =====================================
    // Get Hospital By Id
    // =====================================
    static async getById(req: Request, res: Response) {
        try {

            const hospital =
                await HospitalService.getHospitalById(
                    req.params.id as string
                );

            if (!hospital) {

                return res.status(404).json({
                    success: false,
                    message: "Hospital not found",
                });

            }

            return res.status(200).json({
                success: true,
                data: hospital,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    // =====================================
    // Update Available Beds
    // =====================================
    static async updateBeds(req: Request, res: Response) {
        try {

            const { availableBeds } = req.body;

            const hospital =
                await HospitalService.updateBeds(
                    req.params.id as string,
                    availableBeds
                );

            return res.status(200).json({
                success: true,
                message: "Beds updated successfully",
                data: hospital,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    // =====================================
    // Nearby Hospitals
    // =====================================
    static async nearby(req: Request, res: Response) {
        try {

            const longitude = Number(req.query.longitude);
            const latitude = Number(req.query.latitude);

            const hospitals =
                await HospitalService.nearbyHospitals(
                    longitude,
                    latitude
                );

            return res.status(200).json({
                success: true,
                count: hospitals.length,
                data: hospitals,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    // =====================================
    // Assign Hospital
    // =====================================
    static async assignHospital(req: Request, res: Response) {
        try {

            const { incidentId, hospitalId } = req.body;

            const incident =
                await HospitalService.assignHospital(
                    incidentId,
                    hospitalId
                );

            return res.status(200).json({
                success: true,
                message: "Hospital assigned successfully",
                data: incident,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

    // =====================================
    // Release Bed
    // =====================================
    static async releaseBed(req: Request, res: Response) {
        try {

            const hospital =
                await HospitalService.releaseBed(
                    req.params.id as string
                );

            return res.status(200).json({
                success: true,
                message: "Bed released successfully",
                data: hospital,
            });

        } catch (error: any) {

            return res.status(500).json({
                success: false,
                message: error.message,
            });

        }
    }

}