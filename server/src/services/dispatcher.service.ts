import User from "../models/user.model";
import Incident from "../models/incident.model";

export class DispatcherService {
    static async dashboard() {
        const totalIncidents = await Incident.countDocuments();

        const reported = await Incident.countDocuments({
            status: "Reported",
        });

        const assigned = await Incident.countDocuments({
            status: "Assigned",
        });

        const accepted = await Incident.countDocuments({
            status: "Accepted",
        });

        const inProgress = await Incident.countDocuments({
            status: "In Progress",
        });

        const completed = await Incident.countDocuments({
            status: "Completed",
        });

        const volunteers = await User.countDocuments({
            role: "Volunteer",
        });

        const availableVolunteers = await User.countDocuments({
            role: "Volunteer",
            isAvailable: true,
        });

        return {
            totalIncidents,
            reported,
            assigned,
            accepted,
            inProgress,
            completed,
            volunteers,
            availableVolunteers,
        };
    }

    static async availableVolunteers() {
        return User.find({
            role: "Volunteer",
            isAvailable: true,
        }).select("-password");
    }

    static async pendingIncidents() {
        return Incident.find({
            status: "Reported",
        })
            .populate("reportedBy", "name phone")
            .sort({ createdAt: -1 });
    }
}