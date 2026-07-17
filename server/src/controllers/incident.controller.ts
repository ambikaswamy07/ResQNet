import { Request, Response } from "express";
import { IncidentService } from "../services/incident.service";
import {
    emitIncidentCreated,
    emitIncidentUpdated,
    emitIncidentDeleted,
    emitVolunteerAssigned,
    emitHospitalAssigned,
    emitIncidentCompleted,
} from "../sockets/socket";

export class IncidentController {
    // ==========================
    // Create Incident
    // ==========================
    static async create(req: Request, res: Response) {
        try {
            const incident = await IncidentService.create(req.body);
            emitIncidentCreated(incident);

            return res.status(201).json({
                success: true,
                message: "Incident reported successfully",
                data: incident,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ==========================
    // Get All Incidents
    // ==========================
    static async getAll(req: Request, res: Response) {
        try {
            const incidents = await IncidentService.getAll();

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

    // ==========================
    // Get Incident By Id
    // ==========================
    static async getById(req: Request, res: Response) {
        try {
            const incident = await IncidentService.getById(req.params.id as string);

            if (!incident) {
                return res.status(404).json({
                    success: false,
                    message: "Incident not found",
                });
            }

            return res.status(200).json({
                success: true,
                data: incident,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ==========================
    // Update Incident
    // ==========================
    static async update(req: Request, res: Response) {
        try {
            const incident = await IncidentService.update(
                req.params.id as string,
                req.body
            );
            emitIncidentUpdated(incident);

            return res.status(200).json({
                success: true,
                message: "Incident updated successfully",
                data: incident,
            });
        } catch (error: any) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ==========================
    // Delete Incident
    // ==========================
    static async delete(req: Request, res: Response) {
        try {
            await IncidentService.delete(req.params.id as string);
            emitIncidentDeleted(req.params.id as string);

            return res.status(200).json({
                success: true,
                message: "Incident deleted successfully",
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ==========================
    // Assign Volunteer
    // ==========================
    static async assignVolunteer(req: Request, res: Response) {
        try {
            const { volunteerId, dispatcherId } = req.body;

            const incident = await IncidentService.assignVolunteer(
                req.params.id as string,
                volunteerId,
                dispatcherId
            );
            emitVolunteerAssigned(incident);

            return res.status(200).json({
                success: true,
                message: "Volunteer assigned successfully",
                data: incident,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ==========================
    // Assign Hospital
    // ==========================
    static async assignHospital(req: Request, res: Response) {
        try {
            const incident = await IncidentService.assignHospital(
                req.params.id as string,
                req.body.hospitalId
            );
            emitHospitalAssigned(incident);

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

    // ==========================
    // Volunteer Accept
    // ==========================
    static async accept(req: Request, res: Response) {
        try {
            const incident = await IncidentService.acceptIncident(
                req.params.id as string
            );
            emitIncidentUpdated(incident);

            return res.status(200).json({
                success: true,
                message: "Incident accepted",
                data: incident,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ==========================
    // Update Status
    // ==========================
    static async updateStatus(req: Request, res: Response) {
        try {
            const incident = await IncidentService.updateStatus(
                req.params.id as string,
                req.body.status
            );
            emitIncidentUpdated(incident);
            if (req.body.status == "Completed") {
                emitIncidentCompleted(incident);
            }

            return res.status(200).json({
                success: true,
                message: "Status updated",
                data: incident,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // ==========================
    // Dashboard
    // ==========================
    static async dashboard(req: Request, res: Response) {
        try {
            const stats = await IncidentService.dashboard();

            return res.status(200).json({
                success: true,
                data: stats,
            });
        } catch (error: any) {
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}