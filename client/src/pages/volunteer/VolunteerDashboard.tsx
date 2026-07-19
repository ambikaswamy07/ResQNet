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
    Activity,
    Ambulance,
} from "lucide-react";

import CountUp from "react-countup";
import { motion } from "framer-motion";

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

            <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-600 rounded-3xl shadow-2xl p-10 text-white mb-10">

                <div className="flex flex-col lg:flex-row justify-between items-center">

                    <div>

                        <h1 className="text-5xl font-extrabold">
                            Welcome, {dashboard?.volunteer?.name}
                        </h1>

                        <p className="mt-4 text-lg text-cyan-100 max-w-2xl">
                            Thank you for serving your community. Stay prepared for rescue
                            missions, monitor assigned emergencies, and help save lives.
                        </p>

                        <div className="flex gap-4 mt-8">

                            <button
                                onClick={toggleAvailability}
                                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${dashboard?.volunteer?.isAvailable
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                    }`}
                            >
                                {dashboard?.volunteer?.isAvailable
                                    ? "🟢 Available"
                                    : "🔴 Unavailable"}
                            </button>

                            <button
                                onClick={loadDashboard}
                                className="bg-white text-blue-700 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold"
                            >
                                🔄 Refresh Dashboard
                            </button>

                        </div>

                    </div>

                    <div className="mt-10 lg:mt-0">

                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center">

                            <ShieldCheck size={70} className="mx-auto mb-4" />

                            <h2 className="text-2xl font-bold">
                                Volunteer Status
                            </h2>

                            <p className="text-xl mt-3">

                                {dashboard?.volunteer?.isAvailable
                                    ? "Ready for Rescue"
                                    : "Currently Offline"}

                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

                {/* Assigned Incidents */}

                <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                >

                    <Ambulance
                        className="text-red-500 mb-4"
                        size={38}
                    />

                    <h2 className="text-4xl font-bold text-slate-800">
                        <CountUp
                            end={dashboard?.assignedIncidents?.length || 0}
                            duration={2}
                        />
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Assigned Incidents
                    </p>

                </motion.div>

                {/* Rating */}

                <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                >

                    <Star
                        className="text-yellow-500 mb-4"
                        size={38}
                    />

                    <h2 className="text-4xl font-bold text-slate-800">
                        {dashboard?.volunteer?.rating}
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Volunteer Rating
                    </p>

                </motion.div>

                {/* Completed */}

                <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                >

                    <CheckCircle
                        className="text-green-600 mb-4"
                        size={38}
                    />

                    <h2 className="text-4xl font-bold text-slate-800">

                        <CountUp
                            end={dashboard?.volunteer?.completedIncidents || 0}
                            duration={2}
                        />

                    </h2>

                    <p className="text-slate-500 mt-2">
                        Completed Missions
                    </p>

                </motion.div>

                {/* Availability */}

                <motion.div
                    whileHover={{ y: -8 }}
                    className="bg-white rounded-2xl shadow-xl p-6"
                >

                    <Activity
                        className={`mb-4 ${dashboard?.volunteer?.isAvailable
                            ? "text-green-600"
                            : "text-red-500"
                            }`}
                        size={38}
                    />

                    <h2
                        className={`text-3xl font-bold ${dashboard?.volunteer?.isAvailable
                            ? "text-green-600"
                            : "text-red-600"
                            }`}
                    >
                        {dashboard?.volunteer?.isAvailable
                            ? "Online"
                            : "Offline"}
                    </h2>

                    <p className="text-slate-500 mt-2">
                        Current Status
                    </p>

                </motion.div>

            </div>

            <div className="bg-white rounded-2xl shadow-xl mt-16 p-8">
                {/* ================= QUICK ACTIONS ================= */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        onClick={toggleAvailability}
                        className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
                    >
                        <Activity size={42} />

                        <h2 className="text-2xl font-bold mt-5">
                            Availability
                        </h2>

                        <p className="mt-3 opacity-90">
                            {dashboard?.volunteer?.isAvailable
                                ? "You are available for rescue operations."
                                : "Click here to become available."}
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
                    >
                        <MapPin size={42} />

                        <h2 className="text-2xl font-bold mt-5">
                            Live Tracking
                        </h2>

                        <p className="mt-3 opacity-90">
                            Monitor assigned incidents in real time.
                        </p>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
                    >
                        <ShieldCheck size={42} />

                        <h2 className="text-2xl font-bold mt-5">
                            Emergency Support
                        </h2>

                        <p className="mt-3 opacity-90">
                            Contact dispatch and nearby hospitals instantly.
                        </p>
                    </motion.div>

                </div>
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