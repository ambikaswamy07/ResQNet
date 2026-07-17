import { Router } from "express";
import { IncidentController } from "../controllers/incident.controller";

const router = Router();

// ==============================
// Citizen
// ==============================

// Report Incident
router.post("/", IncidentController.create);

// View All Incidents
router.get("/", IncidentController.getAll);

// Dashboard Statistics
router.get("/dashboard", IncidentController.dashboard);

// Get Incident By Id
router.get("/:id", IncidentController.getById);

// Update Incident
router.put("/:id", IncidentController.update);

// Delete Incident
router.delete("/:id", IncidentController.delete);

// ==============================
// Dispatcher
// ==============================

// Assign Volunteer
router.patch(
    "/:id/assign-volunteer",
    IncidentController.assignVolunteer
);

// Assign Hospital
router.patch(
    "/:id/assign-hospital",
    IncidentController.assignHospital
);

// ==============================
// Volunteer
// ==============================

// Accept Incident
router.patch(
    "/:id/accept",
    IncidentController.accept
);

// Update Status
router.patch(
    "/:id/status",
    IncidentController.updateStatus
);

export default router;