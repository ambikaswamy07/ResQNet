import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import {
    PlusCircle,
    MapPinned,
    Hospital,
    Clock,
    CheckCircle,
    AlertTriangle,
    Activity,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

interface Incident {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
}

export default function CitizenDashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [incidents, setIncidents] = useState<Incident[]>([]);

    const fetchIncidents = async () => {
        try {
            const res = await api.get("/incidents");

            const incidents = res.data.data;

            const myIncidents = incidents.filter((incident: any) => {
                const reportedBy =
                    typeof incident.reportedBy === "object"
                        ? incident.reportedBy._id
                        : incident.reportedBy;

                return reportedBy === user?._id;
            });

            setIncidents(myIncidents);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    const pending = incidents.filter(
        (i) => i.status === "Reported"
    ).length;

    const active = incidents.filter(
        (i) =>
            i.status === "Assigned" ||
            i.status === "Accepted" ||
            i.status === "In Progress"
    ).length;

    const completed = incidents.filter(
        (i) => i.status === "Completed"
    ).length;

    const critical = incidents.filter(
        (i) => i.priority === "High"
    ).length;
    return (
        <div className="min-h-screen bg-slate-100 p-8">

            {/* HERO */}

            <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl bg-gradient-to-r from-blue-700 via-cyan-600 to-teal-500 text-white p-10 shadow-xl"
            >
                <h1 className="text-4xl font-bold">
                    Welcome,
                    {" "}
                    {user?.name}
                </h1>

                <p className="mt-3 text-blue-100 max-w-2xl">
                    Report emergencies instantly, monitor rescue progress,
                    locate nearby hospitals and stay updated with real-time
                    incident tracking.
                </p>

                <div className="flex gap-5 mt-8">

                    <button
                        onClick={() => navigate("/report")}
                        className="bg-white text-blue-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:scale-105 duration-300"
                    >
                        <PlusCircle size={20} />
                        Report Incident
                    </button>

                    <button
                        onClick={() => navigate("/map")}
                        className="bg-blue-900 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-blue-800 duration-300"
                    >
                        <MapPinned size={20} />
                        Live Map
                    </button>

                    <button
                        onClick={() => navigate("/hospitals")}
                        className="bg-emerald-700 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:bg-emerald-600 duration-300"
                    >
                        <Hospital size={20} />
                        Hospitals
                    </button>

                </div>

            </motion.div>

            {/* STATS */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <Clock
                        className="text-yellow-500 mb-3"
                        size={34}
                    />

                    <h2 className="text-3xl font-bold">
                        <CountUp end={pending} duration={2} />
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Pending Incidents
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <Activity
                        className="text-blue-500 mb-3"
                        size={34}
                    />

                    <h2 className="text-3xl font-bold">
                        <CountUp end={active} duration={2} />
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Active Rescue
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <CheckCircle
                        className="text-green-600 mb-3"
                        size={34}
                    />

                    <h2 className="text-3xl font-bold">
                        <CountUp end={completed} duration={2} />
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Completed Cases
                    </p>
                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl p-6 shadow-lg"
                >
                    <AlertTriangle
                        className="text-red-600 mb-3"
                        size={34}
                    />

                    <h2 className="text-3xl font-bold">
                        <CountUp end={critical} duration={2} />
                    </h2>

                    <p className="text-gray-500 mt-1">
                        Critical Emergencies
                    </p>
                </motion.div>
            </div>

            {/* ================= RECENT INCIDENTS ================= */}

            <div className="mt-12 bg-white rounded-3xl shadow-lg p-8">

                <div className="flex justify-between items-center mb-8">

                    <h2 className="text-2xl font-bold text-gray-800">
                        Recent Incidents
                    </h2>

                    <button
                        onClick={() => navigate("/report")}
                        className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-xl"
                    >
                        + New Incident
                    </button>

                </div>

                {loading ? (

                    <div className="text-center py-16 text-gray-500">
                        Loading incidents...
                    </div>

                ) : incidents.length === 0 ? (

                    <div className="text-center py-20">

                        <AlertTriangle
                            size={60}
                            className="mx-auto text-gray-300"
                        />

                        <h3 className="mt-5 text-2xl font-semibold text-gray-700">
                            No Incidents Found
                        </h3>

                        <p className="text-gray-500 mt-2">
                            You haven't reported any emergency yet.
                        </p>

                        <button
                            onClick={() => navigate("/report")}
                            className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl"
                        >
                            Report Now
                        </button>

                    </div>

                ) : (

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead>

                                <tr className="border-b">

                                    <th className="text-left py-4">
                                        Title
                                    </th>

                                    <th className="text-left">
                                        Category
                                    </th>

                                    <th className="text-left">
                                        Priority
                                    </th>

                                    <th className="text-left">
                                        Status
                                    </th>

                                    <th className="text-left">
                                        Date
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {incidents.map((incident) => (

                                    <tr
                                        key={incident._id}
                                        className="border-b hover:bg-gray-50 transition"
                                    >

                                        <td className="py-5 font-semibold">
                                            {incident.title}
                                        </td>

                                        <td>
                                            {incident.category}
                                        </td>

                                        <td>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold

                                                ${incident.priority === "Critical"
                                                        ? "bg-red-100 text-red-700"

                                                        : incident.priority === "High"
                                                            ? "bg-orange-100 text-orange-700"

                                                            : incident.priority === "Medium"
                                                                ? "bg-yellow-100 text-yellow-700"

                                                                : "bg-green-100 text-green-700"
                                                    }

                                            `}
                                            >
                                                {incident.priority}
                                            </span>

                                        </td>

                                        <td>

                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold

                                                ${incident.status === "Completed"
                                                        ? "bg-green-100 text-green-700"

                                                        : incident.status === "Assigned"
                                                            ? "bg-blue-100 text-blue-700"

                                                            : "bg-yellow-100 text-yellow-700"
                                                    }

                                            `}
                                            >
                                                {incident.status}
                                            </span>

                                        </td>

                                        <td>
                                            {new Date(
                                                incident.createdAt
                                            ).toLocaleDateString()}
                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

            {/* ================= QUICK ACTIONS ================= */}

            <div className="grid md:grid-cols-3 gap-6 mt-12">

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-8 text-white cursor-pointer"
                    onClick={() => navigate("/report")}
                >

                    <PlusCircle size={40} />

                    <h2 className="text-2xl font-bold mt-5">
                        Report Emergency
                    </h2>

                    <p className="mt-3 text-red-100">
                        Instantly notify nearby responders.
                    </p>

                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white cursor-pointer"
                    onClick={() => navigate("/map")}
                >

                    <MapPinned size={40} />

                    <h2 className="text-2xl font-bold mt-5">
                        Live Tracking
                    </h2>

                    <p className="mt-3 text-blue-100">
                        Watch rescue progress in real time.
                    </p>

                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-r from-emerald-600 to-green-500 rounded-2xl p-8 text-white cursor-pointer"
                    onClick={() => navigate("/hospitals")}
                >

                    <Hospital size={40} />

                    <h2 className="text-2xl font-bold mt-5">
                        Nearby Hospitals
                    </h2>

                    <p className="mt-3 text-green-100">
                        Find hospitals closest to your location.
                    </p>

                </motion.div>

            </div>
            {/* ================= SAFETY TIPS ================= */}

            <div className="mt-12 grid lg:grid-cols-2 gap-8">

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl shadow-lg p-8"
                >

                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                        🛡 Safety Tips
                    </h2>

                    <div className="space-y-5">

                        <div className="border-l-4 border-red-500 pl-4">
                            <h3 className="font-semibold">
                                During an Accident
                            </h3>
                            <p className="text-gray-500">
                                Stay calm and move to a safe location before reporting.
                            </p>
                        </div>

                        <div className="border-l-4 border-blue-500 pl-4">
                            <h3 className="font-semibold">
                                Share Accurate Location
                            </h3>
                            <p className="text-gray-500">
                                Use GPS whenever possible for faster rescue.
                            </p>
                        </div>

                        <div className="border-l-4 border-green-500 pl-4">
                            <h3 className="font-semibold">
                                Follow Dispatcher Instructions
                            </h3>
                            <p className="text-gray-500">
                                Stay connected until help arrives.
                            </p>
                        </div>

                    </div>

                </motion.div>

                <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-gradient-to-br from-indigo-700 via-blue-600 to-cyan-500 rounded-3xl shadow-xl text-white p-8"
                >

                    <h2 className="text-2xl font-bold">
                        Citizen Profile
                    </h2>

                    <div className="mt-8 space-y-5">

                        <div>
                            <p className="text-blue-100">
                                Name
                            </p>

                            <h3 className="text-xl font-semibold">
                                {user?.name}
                            </h3>
                        </div>

                        <div>
                            <p className="text-blue-100">
                                Email
                            </p>

                            <h3 className="text-lg">
                                {user?.email}
                            </h3>
                        </div>

                        <div>
                            <p className="text-blue-100">
                                Role
                            </p>

                            <h3 className="text-lg">
                                Citizen
                            </h3>
                        </div>

                        <div>
                            <p className="text-blue-100">
                                Total Reports
                            </p>

                            <h3 className="text-3xl font-bold">
                                {incidents.length}
                            </h3>
                        </div>

                    </div>

                </motion.div>

            </div>

        </div>
    );
}