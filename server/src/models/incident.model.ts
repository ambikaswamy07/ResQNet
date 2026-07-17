import { Schema, model, Document, Types } from "mongoose";

export type IncidentPriority =
    | "Low"
    | "Medium"
    | "High"
    | "Critical";

export type IncidentStatus =
    | "Reported"
    | "Assigned"
    | "Accepted"
    | "In Progress"
    | "Completed"
    | "Cancelled";

export interface ILocation {
    type: "Point";
    coordinates: [number, number]; // [longitude, latitude]
}

export interface IIncident extends Document {
    title: string;
    description: string;
    category: string;

    priority: IncidentPriority;

    location: ILocation;

    status: IncidentStatus;

    reportedBy: Types.ObjectId;

    assignedVolunteer?: Types.ObjectId;

    assignedDispatcher?: Types.ObjectId;

    assignedHospital?: Types.ObjectId;

    images: string[];

    remarks: string;

    acceptedAt?: Date;

    completedAt?: Date;

    cancelledAt?: Date;

    createdAt: Date;

    updatedAt: Date;
}

const IncidentSchema = new Schema<IIncident>(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            trim: true,
        },

        priority: {
            type: String,
            enum: ["Low", "Medium", "High", "Critical"],
            default: "Medium",
            required: true,
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
                required: true,
            },

            coordinates: {
                type: [Number],
                required: true,
                validate: {
                    validator: function (value: number[]) {
                        return value.length === 2;
                    },
                    message:
                        "Coordinates must contain [longitude, latitude].",
                },
            },
        },

        status: {
            type: String,
            enum: [
                "Reported",
                "Assigned",
                "Accepted",
                "In Progress",
                "Completed",
                "Cancelled",
            ],
            default: "Reported",
            required: true,
        },

        reportedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        assignedVolunteer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        assignedDispatcher: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        assignedHospital: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        images: {
            type: [String],
            default: [],
        },

        remarks: {
            type: String,
            default: "",
            trim: true,
        },

        acceptedAt: {
            type: Date,
            default: null,
        },

        completedAt: {
            type: Date,
            default: null,
        },

        cancelledAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// GeoSpatial Index
IncidentSchema.index({
    location: "2dsphere",
});

// Frequently Used Query Indexes
IncidentSchema.index({
    status: 1,
});

IncidentSchema.index({
    priority: 1,
});

IncidentSchema.index({
    category: 1,
});

IncidentSchema.index({
    reportedBy: 1,
});

IncidentSchema.index({
    assignedVolunteer: 1,
});

IncidentSchema.index({
    assignedDispatcher: 1,
});

IncidentSchema.index({
    assignedHospital: 1,
});

const Incident = model<IIncident>("Incident", IncidentSchema);

export default Incident;