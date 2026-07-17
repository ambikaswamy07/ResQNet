import User from "../models/user.model";
import Incident from "../models/incident.model";

export class HospitalService {

    // =====================================
    // Dashboard Statistics
    // =====================================
    static async dashboard() {

        const hospitals = await User.countDocuments({
            role: "Hospital",
        });

        const totalBeds = await User.aggregate([
            {
                $match: {
                    role: "Hospital",
                },
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$totalBeds",
                    },
                    available: {
                        $sum: "$availableBeds",
                    },
                },
            },
        ]);

        const assignedIncidents = await Incident.countDocuments({
            assignedHospital: {
                $ne: null,
            },
        });

        return {
            hospitals,
            totalBeds:
                totalBeds.length > 0
                    ? totalBeds[0].total
                    : 0,

            availableBeds:
                totalBeds.length > 0
                    ? totalBeds[0].available
                    : 0,

            assignedIncidents,
        };
    }

    // =====================================
    // Get All Hospitals
    // =====================================
    static async getAllHospitals() {

        return User.find({
            role: "Hospital",
        })
            .select("-password -refreshTokens")
            .sort({
                hospitalName: 1,
            });

    }

    // =====================================
    // Get Hospital By Id
    // =====================================
    static async getHospitalById(id: string) {

        return User.findById(id)
            .select("-password -refreshTokens");

    }

    // =====================================
    // Update Bed Availability
    // =====================================
    static async updateBeds(
        id: string,
        availableBeds: number
    ) {

        return User.findByIdAndUpdate(
            id,
            {
                availableBeds,
            },
            {
                new: true,
                runValidators: true,
            }
        );

    }

    // =====================================
    // Nearby Hospitals
    // =====================================
    static async nearbyHospitals(
        longitude: number,
        latitude: number
    ) {

        return User.find({
            role: "Hospital",
            location: {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [
                            longitude,
                            latitude,
                        ],
                    },
                },
            },
        }).select(
            "-password -refreshTokens"
        );

    }

    // =====================================
    // Assign Hospital
    // =====================================
    static async assignHospital(
        incidentId: string,
        hospitalId: string
    ) {

        const incident =
            await Incident.findByIdAndUpdate(
                incidentId,
                {
                    assignedHospital: hospitalId,
                },
                {
                    new: true,
                }
            );

        await User.findByIdAndUpdate(
            hospitalId,
            {
                $inc: {
                    availableBeds: -1,
                },
            }
        );

        return incident;

    }

    // =====================================
    // Release Bed
    // =====================================
    static async releaseBed(
        hospitalId: string
    ) {

        return User.findByIdAndUpdate(
            hospitalId,
            {
                $inc: {
                    availableBeds: 1,
                },
            },
            {
                new: true,
            }
        );

    }

}