import User from "../models/user.model";
import Incident from "../models/incident.model";

export class VolunteerService {
    static async getAvailableVolunteers() {
        return User.find({
            role: "Volunteer",
            isAvailable: true,
            isActive: true,
        }).select("-password");
    }

    static async getVolunteerDashboard(volunteerId: string) {
        const volunteer = await User.findById(volunteerId).select("-password");

        const assignedIncidents = await Incident.find({
            assignedVolunteer: volunteerId,
        }).sort({ createdAt: -1 });

        return {
            volunteer,
            assignedIncidents,
        };
    }

    static async updateAvailability(
        volunteerId: string,
        isAvailable: boolean
    ) {
        return User.findByIdAndUpdate(
            volunteerId,
            { isAvailable },
            { new: true }
        ).select("-password");
    }

    static async getNearbyIncidents() {
        return Incident.find({
            status: {
                $in: ["Reported", "Assigned"],
            },
        }).sort({ createdAt: -1 });
    }

    static async myCompletedIncidents(volunteerId: string) {
        return Incident.find({
            assignedVolunteer: volunteerId,
            status: "Completed",
        }).sort({ completedAt: -1 });
    }
}