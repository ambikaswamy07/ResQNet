import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import {
    AlertTriangle,
    RefreshCw,
    Search,
    Filter,
    Users,
    Hospital,
    CheckCircle,
    Clock,
} from "lucide-react";
import socket from "../../socket/socket";
interface Incident {
    _id: string;
    title: string;
    description: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;

    reportedBy?: {
        name: string;
        email: string;
    };

    assignedVolunteer?: {
        _id: string;
        name: string;
    } | null;

    assignedHospital?: {
        _id: string;
        name: string;
    } | null;
}

export default function DispatcherDashboard() {

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [incidents, setIncidents] = useState<Incident[]>([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] =
        useState("All");

    const [stats, setStats] = useState({
        total: 0,
        reported: 0,
        assigned: 0,
        accepted: 0,
        progress: 0,
        completed: 0,
    });

    useEffect(() => {

        loadDashboard();

        socket.on("incidentCreated", () => {
            loadDashboard();
        });

        socket.on("incidentUpdated", () => {
            loadDashboard();
        });

        socket.on("incidentDeleted", () => {
            loadDashboard();
        });

        socket.on("volunteerAssigned", () => {
            loadDashboard();
        });

        socket.on("hospitalAssigned", () => {
            loadDashboard();
        });

        socket.on("incidentCompleted", () => {
            loadDashboard();
        });

        return () => {

            socket.off("incidentCreated");
            socket.off("incidentUpdated");
            socket.off("incidentDeleted");
            socket.off("volunteerAssigned");
            socket.off("hospitalAssigned");
            socket.off("incidentCompleted");

        };
    }, []);
    const assignVolunteer = async (incidentId: string) => {

        const volunteerId = prompt("Enter Volunteer ID");

        if (!volunteerId) return;
        try {

            await api.patch(`/incidents/${incidentId}/assign-volunteer`, {

                volunteerId,

                dispatcherId: user?._id,

            });

            loadDashboard();

        } catch (err: any) {

            console.log(err);
            console.log(err.response?.data);

            alert(err.response?.data.message || "Unable to assign volunteer");

        }

    };

    const assignHospital = async (incidentId: string) => {

        const hospitalId = prompt("Enter Hospital ID");

        if (!hospitalId) return;

        try {

            await api.patch(`/incidents/${incidentId}/assign-hospital`, {

                hospitalId,

            });

            loadDashboard();

        } catch (err) {

            console.log(err);

            alert("Unable to assign hospital");

        }

    };



    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [dashboardRes, incidentRes] =
                await Promise.all([

                    api.get("/incidents/dashboard"),

                    api.get("/incidents"),

                ]);

            setStats(dashboardRes.data.data);

            setIncidents(incidentRes.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    const filteredIncidents = incidents.filter((incident) => {

        const searchMatch =
            incident.title
                .toLowerCase()
                .includes(search.toLowerCase());

        const statusMatch =
            statusFilter === "All"
                ? true
                : incident.status === statusFilter;

        return searchMatch && statusMatch;

    });

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-screen">

                <RefreshCw
                    size={60}
                    className="animate-spin text-blue-600"
                />

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-100 p-8">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-5xl font-bold text-slate-800">
                        🚓 Dispatcher Dashboard
                    </h1>

                    <p className="text-slate-500 mt-2 text-lg">
                        Manage and assign emergency incidents
                    </p>

                </div>

                <button
                    onClick={loadDashboard}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
                >

                    <RefreshCw size={18} />

                    Refresh

                </button>

            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Total Incidents
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {stats.total}
                            </h2>

                        </div>

                        <AlertTriangle
                            size={40}
                            className="text-blue-600"
                        />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Reported
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {stats.reported}
                            </h2>

                        </div>

                        <Clock
                            size={40}
                            className="text-yellow-500"
                        />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Assigned
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {stats.assigned}
                            </h2>

                        </div>

                        <Users
                            size={40}
                            className="text-purple-600"
                        />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">
                                Completed
                            </p>

                            <h2 className="text-4xl font-bold mt-3">
                                {stats.completed}
                            </h2>

                        </div>

                        <CheckCircle
                            size={40}
                            className="text-green-600"
                        />

                    </div>

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

                <div className="flex flex-wrap gap-4">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search Incident..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border rounded-xl pl-12 pr-4 py-3"
                        />

                    </div>

                    <div className="relative">

                        <Filter
                            size={18}
                            className="absolute left-4 top-4 text-gray-400"
                        />

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="border rounded-xl pl-12 pr-8 py-3"
                        >

                            <option>All</option>

                            <option>Reported</option>

                            <option>Assigned</option>

                            <option>Accepted</option>

                            <option>Completed</option>

                        </select>

                    </div>

                </div>

            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">
                        Incident Management
                    </h2>

                    <span className="text-slate-500">
                        {filteredIncidents.length} Incident(s)
                    </span>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-100">

                            <tr>

                                <th className="text-left p-4">Incident</th>

                                <th className="text-left p-4">Category</th>

                                <th className="text-left p-4">Priority</th>

                                <th className="text-left p-4">Status</th>

                                <th className="text-left p-4">Volunteer</th>

                                <th className="text-left p-4">Hospital</th>

                                <th className="text-left p-4">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredIncidents.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="text-center py-12 text-slate-500"
                                    >
                                        No incidents found.
                                    </td>

                                </tr>

                            ) : (

                                filteredIncidents.map((incident) => (

                                    <tr
                                        key={incident._id}
                                        className="border-b hover:bg-slate-50 transition"
                                    >

                                        <td className="p-4">

                                            <h3 className="font-bold">
                                                {incident.title}
                                            </h3>

                                            <p className="text-sm text-slate-500">
                                                {incident.description}
                                            </p>

                                        </td>

                                        <td className="p-4">
                                            {incident.category}
                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-white text-sm

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
                                                className={`px-3 py-1 rounded-full text-white text-sm

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

                                            {incident.assignedVolunteer
                                                ? incident.assignedVolunteer.name
                                                : "-"}

                                        </td>

                                        <td className="p-4">

                                            {incident.assignedHospital
                                                ? incident.assignedHospital.name
                                                : "-"}

                                        </td>

                                        <td className="p-4">

                                            <div className="flex gap-2">

                                                <button
                                                    onClick={() => assignVolunteer(incident._id)}
                                                    className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                                                >

                                                    <Users size={16} />
                                                    Volunteer
                                                </button>

                                                <button
                                                    onClick={() => assignHospital(incident._id)}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                                                >

                                                    <Hospital size={16} />
                                                    Hospital
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

        </div>

    );

}