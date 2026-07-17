import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket/socket";
import {
    CheckCircle,
    Clock,
    MapPin,
    Star,
    User,
    ShieldCheck,
} from "lucide-react";

export default function VolunteerDashboard() {

    const { user } = useAuth();

    const [dashboard, setDashboard] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadDashboard();

        socket.on("incidentCreated", () => {
            loadDashboard();
        });

        socket.on("incidentUpdated", () => {
            loadDashboard();
        });

        socket.on("volunteerAssigned", () => {
            loadDashboard();
        });

        socket.on("incidentCompleted", () => {
            loadDashboard();
        });

        return () => {

            socket.off("incidentCreated");
            socket.off("incidentUpdated");
            socket.off("volunteerAssigned");
            socket.off("incidentCompleted");

        };

    }, []);

    const loadDashboard = async () => {
        try {

            setLoading(true);

            const res = await api.get(
                `/volunteers/${user?._id}/dashboard`
            );

            setDashboard(res.data.data);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const acceptIncident = async (id: string) => {
        try {
            await api.patch(`/incidents/${id}/accept`);

            alert("✅ Incident Accepted");

            loadDashboard();

        } catch (error) {
            console.error(error);
            alert("Unable to accept incident");
        }
    };

    const completeIncident = async (id: string) => {
        try {

            await api.patch(`/incidents/${id}/status`, {
                status: "Completed",
            });

            alert("✅ Incident Completed");

            loadDashboard();

        } catch (error) {
            console.error(error);
            alert("Unable to complete incident");
        }
    };

    const toggleAvailability = async () => {
        try {

            await api.patch(
                `/volunteers/${user?._id}/availability`,
                {
                    isAvailable: !dashboard.volunteer.isAvailable,
                }
            );

            loadDashboard();

        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen text-2xl font-bold">
                Loading Volunteer Dashboard...
            </div>
        );
    }

    return (

        <div className="min-h-screen bg-slate-100 p-8">

            <div className="flex justify-between items-center mb-10">

                <div>

                    <h1 className="text-5xl font-bold text-slate-800">
                        🚑 Volunteer Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2 text-lg">
                        Manage your rescue operations
                    </p>

                </div>

                <div className="flex gap-4">

                    <button
                        onClick={toggleAvailability}
                        className={`px-5 py-3 rounded-xl text-white font-semibold ${dashboard?.volunteer?.isAvailable
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-red-600 hover:bg-red-700"
                            }`}
                    >
                        {dashboard?.volunteer?.isAvailable
                            ? "Available"
                            : "Unavailable"}
                    </button>

                    <button
                        onClick={loadDashboard}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
                    >
                        Refresh
                    </button>

                </div>
            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Volunteer
                            </p>

                            <h2 className="text-2xl font-bold mt-3">
                                {dashboard?.volunteer?.name}
                            </h2>

                        </div>

                        <User className="text-blue-600" size={40} />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Rating
                            </p>

                            <h2 className="text-3xl font-bold mt-3">
                                ⭐ {dashboard?.volunteer?.rating}
                            </h2>

                        </div>

                        <Star className="text-yellow-500" size={40} />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Completed
                            </p>

                            <h2 className="text-3xl font-bold mt-3">
                                {dashboard?.volunteer?.completedIncidents}
                            </h2>

                        </div>

                        <CheckCircle className="text-green-600" size={40} />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Availability
                            </p>

                            <h2
                                className={`text-2xl font-bold mt-3 ${dashboard?.volunteer?.isAvailable
                                    ? "text-green-600"
                                    : "text-red-600"
                                    }`}
                            >

                                {dashboard?.volunteer?.isAvailable
                                    ? "Available"
                                    : "Unavailable"}

                            </h2>

                        </div>

                        <ShieldCheck className="text-blue-600" size={40} />

                    </div>

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-xl mt-10 p-8">

                <h2 className="text-3xl font-bold mb-6">
                    Assigned Incidents
                </h2>
                {dashboard?.assignedIncidents?.length === 0 ? (

                    <div className="text-center py-16">

                        <Clock
                            size={70}
                            className="mx-auto text-slate-300"
                        />

                        <h3 className="text-2xl font-bold mt-5">
                            No Assigned Incidents
                        </h3>

                        <p className="text-slate-500 mt-2">
                            Waiting for dispatcher to assign incidents.
                        </p>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-slate-100">

                                <tr>

                                    <th className="text-left p-4">Title</th>

                                    <th className="text-left p-4">Category</th>

                                    <th className="text-left p-4">Priority</th>

                                    <th className="text-left p-4">Status</th>

                                    <th className="text-left p-4">Location</th>

                                    <th className="text-left p-4">Action</th>

                                </tr>

                            </thead>

                            <tbody>

                                {dashboard.assignedIncidents.map((incident: any) => (

                                    <tr
                                        key={incident._id}
                                        className="border-b hover:bg-slate-50 transition"
                                    >

                                        <td className="p-4 font-semibold">
                                            {incident.title}
                                        </td>

                                        <td className="p-4">
                                            {incident.category}
                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-white

${incident.priority === "Critical"
                                                        ? "bg-red-600"

                                                        : incident.priority === "High"
                                                            ? "bg-orange-500"

                                                            : incident.priority === "Medium"
                                                                ? "bg-yellow-500"

                                                                : "bg-green-600"

                                                    }
`}
                                            >

                                                {incident.priority}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-white

${incident.status === "Completed"

                                                        ? "bg-green-600"

                                                        : incident.status === "Accepted"

                                                            ? "bg-blue-600"

                                                            : incident.status === "Assigned"

                                                                ? "bg-purple-600"

                                                                : "bg-gray-600"

                                                    }

`}
                                            >

                                                {incident.status}

                                            </span>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2">

                                                <MapPin size={18} />

                                                Coordinates Available

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex gap-3">

                                                {incident.status === "Assigned" && (
                                                    <button
                                                        onClick={() => acceptIncident(incident._id)}
                                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Accept
                                                    </button>
                                                )}

                                                {incident.status === "Accepted" && (
                                                    <button
                                                        onClick={() => completeIncident(incident._id)}
                                                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                                                    >
                                                        Complete
                                                    </button>
                                                )}

                                                {incident.status === "Completed" && (
                                                    <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                                                        ✅ Completed
                                                    </span>
                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}