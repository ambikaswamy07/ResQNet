import User from "../models/user.model";
import Incident, {
    IIncident,
    IncidentStatus,
} from "../models/incident.model";

export interface CreateIncidentDTO {
    title: string;
    description: string;
    category: string;
    priority: "Low" | "Medium" | "High" | "Critical";
    latitude: number;
    longitude: number;
    reportedBy: string;
}

export interface UpdateIncidentDTO {
    title?: string;
    description?: string;
    category?: string;
    priority?: "Low" | "Medium" | "High" | "Critical";
    remarks?: string;
}

export class IncidentService {
    // ============================
    // Create Incident
    // ============================
    static async create(data: CreateIncidentDTO) {
        const incident = await Incident.create({
            title: data.title,
            description: data.description,
            category: data.category,
            priority: data.priority,

            location: {
                type: "Point",
                coordinates: [data.longitude, data.latitude],
            },

            reportedBy: data.reportedBy,

            status: "Reported",
        });

        return incident;
    }

    // ============================
    // Get All
    // ============================
    static async getAll() {
        return Incident.find()
            .populate("reportedBy", "name email phone")
            .populate("assignedVolunteer", "name phone")
            .populate("assignedDispatcher", "name")
            .populate("assignedHospital", "name")
            .sort({ createdAt: -1 });
    }

    // ============================
    // Get By Id
    // ============================
    static async getById(id: string) {
        return Incident.findById(id)
            .populate("reportedBy", "name email phone")
            .populate("assignedVolunteer", "name phone")
            .populate("assignedDispatcher", "name")
            .populate("assignedHospital", "name");
    }

    // ============================
    // Update
    // ============================
    static async update(
        id: string,
        data: UpdateIncidentDTO
    ) {
        return Incident.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    // ============================
    // Delete
    // ============================
    static async delete(id: string) {
        return Incident.findByIdAndDelete(id);
    }

    // ============================
    // Assign Volunteer
    // ============================
    static async assignVolunteer(
        incidentId: string,
        volunteerId: string,
        dispatcherId: string
    ) {
        return Incident.findByIdAndUpdate(
            incidentId,
            {
                assignedVolunteer: volunteerId,
                assignedDispatcher: dispatcherId,
                status: "Assigned",
            },
            { new: true }
        );
    }

    // ============================
    // Assign Hospital
    // ============================
    static async assignHospital(
        incidentId: string,
        hospitalId: string
    ) {
        return Incident.findByIdAndUpdate(
            incidentId,
            {
                assignedHospital: hospitalId,
            },
            { new: true }
        );
    }

    // ============================
    // Volunteer Accept
    // ============================
    static async acceptIncident(id: string) {
        return Incident.findByIdAndUpdate(
            id,
            {
                status: "Accepted",
                acceptedAt: new Date(),
            },
            { new: true }
        );
    }

    // ============================
    // Update Status
    // ============================
    static async updateStatus(
        id: string,
        status: IncidentStatus
    ) {
        const update: any = {
            status,
        };

        if (status === "Completed") {
            update.completedAt = new Date();
        }

        if (status === "Cancelled") {
            update.cancelledAt = new Date();
        }

        const incident = await Incident.findByIdAndUpdate(
            id,
            update,
            { new: true }
        );

        if (
            status === "Completed" &&
            incident?.assignedVolunteer
        ) {
            await User.findByIdAndUpdate(
                incident.assignedVolunteer,
                {
                    $inc: {
                        completedIncidents: 1,
                    },
                }
            );
        }

        return incident;
    }

    // ============================
    // Dashboard Stats
    // ============================
    static async dashboard() {
        const total = await Incident.countDocuments();

        const reported = await Incident.countDocuments({
            status: "Reported",
        });

        const assigned = await Incident.countDocuments({
            status: "Assigned",
        });

        const accepted = await Incident.countDocuments({
            status: "Accepted",
        });

        const progress = await Incident.countDocuments({
            status: "In Progress",
        });

        const completed = await Incident.countDocuments({
            status: "Completed",
        });

        return {
            total,
            reported,
            assigned,
            accepted,
            progress,
            completed,
        };
    }
}