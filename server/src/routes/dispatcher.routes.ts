import { Router } from "express";
import { DispatcherController } from "../controllers/dispatcher.controller";

const router = Router();

// Dispatcher Dashboard
router.get("/dashboard", DispatcherController.dashboard);

// Available Volunteers
router.get(
    "/available-volunteers",
    DispatcherController.availableVolunteers
);

// Pending Incidents
router.get(
    "/pending-incidents",
    DispatcherController.pendingIncidents
);

export default router;