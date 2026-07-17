import { Router } from "express";
import { VolunteerController } from "../controllers/volunteer.controller";

const router = Router();

// Get all available volunteers
router.get("/", VolunteerController.getAvailable);

// Volunteer dashboard
router.get("/:id/dashboard", VolunteerController.dashboard);

// Nearby incidents
router.get("/:id/nearby-incidents", VolunteerController.nearbyIncidents);

// Completed incidents
router.get("/:id/completed", VolunteerController.completed);

// Update availability
router.patch("/:id/availability", VolunteerController.updateAvailability);

export default router;