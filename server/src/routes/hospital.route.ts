import { Router } from "express";
import { HospitalController } from "../controllers/hospital.controller";

const router = Router();

// =====================================
// Dashboard
// =====================================
router.get(
    "/dashboard",
    HospitalController.dashboard
);

// =====================================
// Get All Hospitals
// =====================================
router.get(
    "/",
    HospitalController.getAll
);

// =====================================
// Nearby Hospitals
// =====================================
router.get(
    "/nearby",
    HospitalController.nearby
);

// =====================================
// Get Hospital By Id
// =====================================
router.get(
    "/:id",
    HospitalController.getById
);

// =====================================
// Update Bed Availability
// =====================================
router.patch(
    "/:id/beds",
    HospitalController.updateBeds
);

// =====================================
// Release Bed
// =====================================
router.patch(
    "/:id/release-bed",
    HospitalController.releaseBed
);

// =====================================
// Assign Hospital
// =====================================
router.patch(
    "/assign",
    HospitalController.assignHospital
);

export default router;