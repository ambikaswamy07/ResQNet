import { useEffect, useState } from "react";
import {
    RefreshCw,
    Activity,
    AlertTriangle,
    Clock3,
    ShieldCheck,
} from "lucide-react";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import DashboardCard from "../components/common/DashboardCard";

import { useAuth } from "../context/AuthContext";

import {
    getDashboardStats,
    getRecentIncidents,
} from "../services/dashboard.service";

interface Incident {
    _id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
}

interface DashboardStats {
    total: number;
    reported: number;
    assigned: number;
    accepted: number;
    progress: number;
    completed: number;
}

export default function MainLayout() {

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [stats, setStats] =
        useState<DashboardStats>({
            total: 0,
            reported: 0,
            assigned: 0,
            accepted: 0,
            progress: 0,
            completed: 0,
        });

    const [incidents, setIncidents] =
        useState<Incident[]>([]);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const dashboardStats =
                await getDashboardStats();

            const recent =
                await getRecentIncidents();

            setStats(dashboardStats);

            setIncidents(recent);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadDashboard();

    }, []);

    return (

        <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200">

            <Sidebar />

            <div className="flex-1">

                <Navbar />

                <main className="p-10">

                    {/* HERO */}

                    <div className="mb-10 rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 p-10 shadow-2xl text-white">

                        <div className="flex justify-between items-center">

                            <div>

                                <h1 className="text-5xl font-extrabold">

                                    Welcome Back,

                                </h1>

                                <h2 className="text-4xl mt-3 font-bold">

                                    {user?.name} 👋

                                </h2>

                                <p className="mt-5 text-blue-100 text-lg">

                                    Smart Disaster & Emergency
                                    Coordination Platform

                                </p>

                            </div>

                            <button
                                onClick={loadDashboard}
                                className="bg-white text-blue-700 px-7 py-4 rounded-2xl font-bold shadow-lg hover:scale-105 transition flex items-center gap-3"
                            >

                                <RefreshCw size={20} />

                                Refresh

                            </button>

                        </div>

                    </div>

                    {loading ? (

                        <div className="bg-white rounded-3xl shadow-xl h-80 flex justify-center items-center">

                            <div className="text-center">

                                <RefreshCw
                                    className="animate-spin mx-auto text-blue-600"
                                    size={45}
                                />

                                <p className="mt-6 text-2xl font-semibold">

                                    Loading Dashboard...

                                </p>

                            </div>

                        </div>

                    ) : (

                        <>
                            <div className="grid xl:grid-cols-3 md:grid-cols-2 gap-8">

                                <DashboardCard
                                    title="Total Incidents"
                                    value={stats.total}
                                    color="bg-blue-600"
                                />

                                <DashboardCard
                                    title="Reported"
                                    value={stats.reported}
                                    color="bg-red-600"
                                />

                                <DashboardCard
                                    title="Assigned"
                                    value={stats.assigned}
                                    color="bg-purple-600"
                                />

                                <DashboardCard
                                    title="Accepted"
                                    value={stats.accepted}
                                    color="bg-green-600"
                                />

                                <DashboardCard
                                    title="In Progress"
                                    value={stats.progress}
                                    color="bg-orange-500"
                                />

                                <DashboardCard
                                    title="Completed"
                                    value={stats.completed}
                                    color="bg-emerald-600"
                                />

                            </div>

                            <div className="bg-white rounded-3xl shadow-xl mt-10 p-8">

                                <div className="flex justify-between items-center mb-8">

                                    <h2 className="text-3xl font-bold text-slate-800">
                                        Recent Incidents
                                    </h2>

                                    <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">
                                        {incidents.length} Incident(s)
                                    </span>

                                </div>

                                <div className="overflow-x-auto">

                                    <table className="w-full">

                                        <thead>

                                            <tr className="border-b">

                                                <th className="text-left py-4">Title</th>
                                                <th className="text-left py-4">Category</th>
                                                <th className="text-left py-4">Priority</th>
                                                <th className="text-left py-4">Status</th>
                                                <th className="text-left py-4">Date</th>

                                            </tr>

                                        </thead>

                                        <tbody>

                                            {incidents.length === 0 ? (

                                                <tr>

                                                    <td
                                                        colSpan={5}
                                                        className="text-center py-12 text-slate-500"
                                                    >
                                                        No Incidents Found
                                                    </td>

                                                </tr>

                                            ) : (

                                                incidents.map((incident) => (

                                                    <tr
                                                        key={incident._id}
                                                        className="border-b hover:bg-slate-50 transition"
                                                    >

                                                        <td className="py-5 font-semibold">
                                                            {incident.title}
                                                        </td>

                                                        <td>{incident.category}</td>

                                                        <td>{incident.priority}</td>

                                                        <td>{incident.status}</td>

                                                        <td>
                                                            {new Date(
                                                                incident.createdAt
                                                            ).toLocaleDateString()}
                                                        </td>

                                                    </tr>

                                                ))

                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </>
                    )}

                </main>

            </div>

        </div>

    );
}