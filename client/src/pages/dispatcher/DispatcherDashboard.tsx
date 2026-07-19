// src/pages/dispatcher/DispatcherDashboard.tsx

import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import socket from "../../socket/socket";

import {
    AlertTriangle,
    Activity,
    RefreshCw,
    Search,
    Filter,
    Users,
    Hospital,
    CheckCircle,
    Clock,
    ShieldCheck,
    TrendingUp,
    Siren,
    MapPin,
} from "lucide-react";

import CountUp from "react-countup";
import { motion } from "framer-motion";

import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";
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
const COLORS = [
    "#2563eb",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
];
export default function DispatcherDashboard() {

    const { user } = useAuth();

    const [loading, setLoading] = useState(true);

    const [incidents, setIncidents] = useState<Incident[]>([]);

    const [search, setSearch] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [stats, setStats] = useState({
        total: 0,
        reported: 0,
        assigned: 0,
        accepted: 0,
        progress: 0,
        completed: 0
    });
    const [showVolunteerModal, setShowVolunteerModal] = useState(false);

    const [showHospitalModal, setShowHospitalModal] = useState(false);

    const [selectedIncident, setSelectedIncident] = useState("");

    const [volunteerId, setVolunteerId] = useState("");

    const [hospitalId, setHospitalId] = useState("");

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [dashboardRes, incidentRes] = await Promise.all([

                api.get("/incidents/dashboard"),

                api.get("/incidents")

            ]);

            setStats(dashboardRes.data.data);

            setIncidents(incidentRes.data.data);

        }

        catch (err) {

            console.log(err);

        }

        finally {

            setLoading(false);

        }

    };
    useEffect(() => {

        loadDashboard();

        socket.on("incidentCreated", loadDashboard);

        socket.on("incidentUpdated", loadDashboard);

        socket.on("incidentDeleted", loadDashboard);

        socket.on("volunteerAssigned", loadDashboard);

        socket.on("hospitalAssigned", loadDashboard);

        socket.on("incidentCompleted", loadDashboard);

        return () => {

            socket.off("incidentCreated", loadDashboard);

            socket.off("incidentUpdated", loadDashboard);

            socket.off("incidentDeleted", loadDashboard);

            socket.off("volunteerAssigned", loadDashboard);

            socket.off("hospitalAssigned", loadDashboard);

            socket.off("incidentCompleted", loadDashboard);

        };

    }, []);
    const assignVolunteer = async () => {

        if (!volunteerId) return;

        try {

            await api.patch(
                `/incidents/${selectedIncident}/assign-volunteer`,
                {
                    volunteerId,
                    dispatcherId: user?._id,
                }
            );

            setVolunteerId("");
            setShowVolunteerModal(false);

            loadDashboard();

        } catch (err: any) {

            alert(
                err.response?.data?.message ||
                "Unable to assign volunteer"
            );

        }

    };

    const assignHospital = async () => {

        if (!hospitalId) return;

        try {

            await api.patch(
                `/incidents/${selectedIncident}/assign-hospital`,
                {
                    hospitalId,
                }
            );

            setHospitalId("");
            setShowHospitalModal(false);

            loadDashboard();

        } catch (err: any) {

            alert(
                err.response?.data?.message ||
                "Unable to assign hospital"
            );

        }

    };
    const filteredIncidents = useMemo(() => {

        return incidents.filter((incident) => {

            const searchMatch = incident.title
                .toLowerCase()
                .includes(search.toLowerCase());

            const statusMatch =

                statusFilter === "All"

                    ? true

                    : incident.status === statusFilter;

            return searchMatch && statusMatch;

        });

    }, [incidents, search, statusFilter]);
    if (loading) {

        return (

            <div className="min-h-screen flex justify-center items-center bg-slate-100">

                <RefreshCw
                    size={70}
                    className="animate-spin text-blue-600"
                />

            </div>

        );


    }
    const pieData = [
        { name: "Reported", value: stats.reported },
        { name: "Assigned", value: stats.assigned },
        { name: "Accepted", value: stats.accepted },
        { name: "Completed", value: stats.completed },
    ];

    const trendData = [
        { day: "Mon", incidents: 5 },
        { day: "Tue", incidents: 8 },
        { day: "Wed", incidents: 4 },
        { day: "Thu", incidents: 10 },
        { day: "Fri", incidents: stats.total },
    ];

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 p-8">

            <div className="max-w-7xl mx-auto">

                {/* ================= HERO ================= */}

                <motion.div

                    initial={{ opacity: 0, y: -40 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: .6 }}

                    className="rounded-[30px] overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-500 shadow-2xl mb-10"

                >

                    <div className="p-10 flex flex-col lg:flex-row justify-between">

                        <div>

                            <div className="flex items-center gap-3 mb-5">

                                <div className="bg-white/20 p-4 rounded-2xl">

                                    <Siren size={34} className="text-white" />

                                </div>

                                <div>

                                    <p className="uppercase tracking-[5px] text-blue-100 text-sm">

                                        Emergency Operations Center

                                    </p>

                                    <h1 className="text-5xl font-black text-white mt-2">

                                        Dispatcher Dashboard

                                    </h1>

                                </div>

                            </div>

                            <p className="text-blue-100 text-lg max-w-2xl leading-8">

                                Monitor emergency incidents, assign volunteers,
                                coordinate hospitals and track rescue operations
                                in real time.

                            </p>

                        </div>

                        <div className="mt-10 lg:mt-0 flex flex-col items-end">

                            <div className="bg-white/20 backdrop-blur-xl rounded-3xl px-8 py-6">

                                <div className="flex items-center gap-3">

                                    <ShieldCheck className="text-green-300" />

                                    <div>

                                        <p className="text-blue-100">

                                            System Status

                                        </p>

                                        <h2 className="text-3xl font-black text-white">

                                            ONLINE

                                        </h2>

                                    </div>

                                </div>

                            </div>

                            <button

                                onClick={loadDashboard}

                                className="mt-6 bg-white hover:scale-105 transition px-8 py-4 rounded-2xl font-bold text-blue-700 flex items-center gap-3"

                            >

                                <RefreshCw size={20} />

                                Refresh Dashboard

                            </button>

                        </div>

                    </div>

                </motion.div>

                {/* ================= KPI ================= */}

                <div className="grid xl:grid-cols-4 md:grid-cols-2 gap-7 mb-10">

                    {[
                        {
                            title: "Total Incidents",
                            value: stats.total,
                            icon: <AlertTriangle size={34} />,
                            color: "from-blue-600 to-cyan-500"
                        },
                        {
                            title: "Reported",
                            value: stats.reported,
                            icon: <Clock size={34} />,
                            color: "from-yellow-500 to-orange-500"
                        },
                        {
                            title: "Assigned",
                            value: stats.assigned,
                            icon: <Users size={34} />,
                            color: "from-purple-600 to-indigo-500"
                        },
                        {
                            title: "Completed",
                            value: stats.completed,
                            icon: <CheckCircle size={34} />,
                            color: "from-green-600 to-emerald-500"
                        }
                    ].map((item) => (

                        <motion.div

                            key={item.title}

                            whileHover={{ y: -8 }}

                            className="bg-white rounded-3xl shadow-xl overflow-hidden"

                        >

                            <div className={`h-2 bg-gradient-to-r ${item.color}`} />

                            <div className="p-7">

                                <div className="flex justify-between">

                                    <div>

                                        <p className="text-slate-500 font-semibold">

                                            {item.title}

                                        </p>

                                        <h2 className="text-5xl font-black mt-5">

                                            <CountUp end={item.value} duration={1.5} />

                                        </h2>

                                        <div className="flex items-center gap-2 mt-5 text-green-600">

                                            <Activity size={16} />

                                            Live

                                        </div>

                                    </div>

                                    <div className={`w-20 h-20 rounded-3xl bg-gradient-to-r ${item.color} text-white flex items-center justify-center`}>

                                        {item.icon}

                                    </div>

                                </div>

                            </div>

                        </motion.div>

                    ))}

                </div>
                {/* ===================== ANALYTICS ===================== */}

                <div className="grid xl:grid-cols-3 gap-8 mb-10">

                    {/* Line Chart */}

                    <motion.div

                        initial={{ opacity: 0, y: 30 }}

                        whileInView={{ opacity: 1, y: 0 }}

                        viewport={{ once: true }}

                        className="xl:col-span-2 bg-white rounded-3xl shadow-xl p-8"

                    >

                        <div className="flex justify-between items-center mb-8">

                            <div>

                                <h2 className="text-2xl font-bold">

                                    Incident Trend

                                </h2>

                                <p className="text-slate-500 mt-1">

                                    Weekly emergency reports

                                </p>

                            </div>

                            <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-xl font-semibold">

                                Live Analytics

                            </div>

                        </div>

                        <ResponsiveContainer width="100%" height={320}>

                            <LineChart data={trendData}>

                                <CartesianGrid strokeDasharray="4 4" />

                                <XAxis dataKey="day" />

                                <YAxis />

                                <Tooltip />

                                <Line

                                    type="monotone"

                                    dataKey="incidents"

                                    stroke="#2563eb"

                                    strokeWidth={4}

                                    dot={{ r: 6 }}

                                />

                            </LineChart>

                        </ResponsiveContainer>

                    </motion.div>

                    {/* Pie Chart */}

                    <motion.div

                        initial={{ opacity: 0, y: 30 }}

                        whileInView={{ opacity: 1, y: 0 }}

                        viewport={{ once: true }}

                        className="bg-white rounded-3xl shadow-xl p-8"

                    >

                        <h2 className="text-2xl font-bold">

                            Incident Status

                        </h2>

                        <p className="text-slate-500 mt-1 mb-6">

                            Current distribution

                        </p>

                        <ResponsiveContainer width="100%" height={300}>

                            <PieChart>

                                <Pie

                                    data={pieData}

                                    cx="50%"

                                    cy="50%"

                                    outerRadius={100}

                                    dataKey="value"

                                    label

                                >

                                    {

                                        pieData.map((entry, index) => (

                                            <Cell

                                                key={index}

                                                fill={COLORS[index % COLORS.length]}

                                            />

                                        ))

                                    }

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                        <div className="mt-6 space-y-3">

                            {

                                pieData.map((item, index) => (

                                    <div

                                        key={item.name}

                                        className="flex justify-between items-center"

                                    >

                                        <div className="flex items-center gap-3">

                                            <div

                                                className="w-4 h-4 rounded-full"

                                                style={{

                                                    background: COLORS[index]

                                                }}

                                            />

                                            <span className="font-medium">

                                                {item.name}

                                            </span>

                                        </div>

                                        <span className="font-bold">

                                            {item.value}

                                        </span>

                                    </div>

                                ))

                            }

                        </div>

                    </motion.div>

                </div>
                {/* ================= SEARCH & FILTER ================= */}

                <motion.div

                    initial={{ opacity: 0, y: 30 }}

                    animate={{ opacity: 1, y: 0 }}

                    transition={{ duration: .6 }}

                    className="bg-white rounded-3xl shadow-xl p-7 mb-10"

                >

                    <div className="flex flex-col lg:flex-row gap-6">

                        {/* Search */}

                        <div className="relative flex-1">

                            <Search

                                size={22}

                                className="absolute left-5 top-4 text-slate-400"

                            />

                            <input

                                type="text"

                                placeholder="Search incident title..."

                                value={search}

                                onChange={(e) => setSearch(e.target.value)}

                                className="w-full rounded-2xl border-2 border-slate-200 pl-14 pr-5 py-4 text-lg outline-none focus:border-blue-500 transition"

                            />

                        </div>

                        {/* Filter */}

                        <div className="relative w-full lg:w-72">

                            <Filter

                                size={22}

                                className="absolute left-5 top-4 text-slate-400"

                            />

                            <select

                                value={statusFilter}

                                onChange={(e) => setStatusFilter(e.target.value)}

                                className="w-full rounded-2xl border-2 border-slate-200 pl-14 pr-5 py-4 text-lg outline-none focus:border-blue-500 transition"

                            >

                                <option value="All">All Status</option>

                                <option value="Reported">Reported</option>

                                <option value="Assigned">Assigned</option>

                                <option value="Accepted">Accepted</option>

                                <option value="Completed">Completed</option>

                            </select>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-4 gap-5 mt-8">

                        <div className="rounded-2xl bg-blue-50 p-5">

                            <p className="text-slate-500">

                                Total Incidents

                            </p>

                            <h2 className="text-4xl font-black mt-2 text-blue-700">

                                {stats.total}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-yellow-50 p-5">

                            <p className="text-slate-500">

                                Reported

                            </p>

                            <h2 className="text-4xl font-black mt-2 text-yellow-600">

                                {stats.reported}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-purple-50 p-5">

                            <p className="text-slate-500">

                                Assigned

                            </p>

                            <h2 className="text-4xl font-black mt-2 text-purple-700">

                                {stats.assigned}

                            </h2>

                        </div>

                        <div className="rounded-2xl bg-green-50 p-5">

                            <p className="text-slate-500">

                                Completed

                            </p>

                            <h2 className="text-4xl font-black mt-2 text-green-700">

                                {stats.completed}

                            </h2>

                        </div>

                    </div>

                </motion.div>

                {/* ================= INCIDENT HEADER ================= */}

                <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">

                    <div className="flex flex-col lg:flex-row justify-between items-center gap-5">

                        <div>

                            <h2 className="text-3xl font-black text-slate-800">

                                Emergency Incident Management

                            </h2>

                            <p className="text-slate-500 mt-2">

                                Monitor every emergency request and assign volunteers or hospitals instantly.

                            </p>

                        </div>

                        <div className="flex gap-4">

                            <div className="bg-blue-100 text-blue-700 px-6 py-3 rounded-2xl font-bold">

                                {filteredIncidents.length} Incidents

                            </div>

                            <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-bold">

                                Live Updates

                            </div>

                        </div>

                    </div>

                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: .5 }}
                    className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10"
                >

                    <div className="overflow-x-auto">

                        <table className="w-full">

                            <thead className="bg-gradient-to-r from-slate-800 to-slate-700 text-white">

                                <tr>

                                    <th className="text-left px-6 py-5">Incident</th>

                                    <th className="text-left px-6 py-5">Category</th>

                                    <th className="text-left px-6 py-5">Priority</th>

                                    <th className="text-left px-6 py-5">Status</th>

                                    <th className="text-left px-6 py-5">Volunteer</th>

                                    <th className="text-left px-6 py-5">Hospital</th>

                                    <th className="text-center px-6 py-5">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    filteredIncidents.length === 0 ?

                                        (

                                            <tr>

                                                <td
                                                    colSpan={7}
                                                    className="text-center py-20 text-slate-500 text-xl"
                                                >

                                                    No Incidents Found

                                                </td>

                                            </tr>

                                        )

                                        :

                                        filteredIncidents.map((incident, index) => (

                                            <motion.tr

                                                key={incident._id}

                                                initial={{ opacity: 0, y: 15 }}

                                                animate={{ opacity: 1, y: 0 }}

                                                transition={{ delay: index * 0.05 }}

                                                className="border-b hover:bg-blue-50 transition"

                                            >

                                                <td className="px-6 py-6">

                                                    <div className="flex items-start gap-4">

                                                        <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">

                                                            <AlertTriangle
                                                                size={26}
                                                                className="text-blue-700"
                                                            />

                                                        </div>

                                                        <div>

                                                            <h3 className="font-bold text-lg">

                                                                {incident.title}

                                                            </h3>

                                                            <p className="text-slate-500 mt-2 max-w-sm">

                                                                {incident.description}

                                                            </p>

                                                            <p className="text-sm text-slate-400 mt-3 flex items-center gap-2">

                                                                <MapPin size={14} />

                                                                {new Date(
                                                                    incident.createdAt
                                                                ).toLocaleString()}

                                                            </p>

                                                        </div>

                                                    </div>

                                                </td>

                                                <td className="px-6">

                                                    <span className="px-4 py-2 rounded-xl bg-slate-100 font-semibold">

                                                        {incident.category}

                                                    </span>

                                                </td>

                                                <td className="px-6">

                                                    {

                                                        incident.priority === "Critical" ?

                                                            (

                                                                <span className="bg-red-600 text-white px-4 py-2 rounded-full font-bold">

                                                                    Critical

                                                                </span>

                                                            )

                                                            :

                                                            incident.priority === "High" ?

                                                                (

                                                                    <span className="bg-orange-500 text-white px-4 py-2 rounded-full font-bold">

                                                                        High

                                                                    </span>

                                                                )

                                                                :

                                                                incident.priority === "Medium" ?

                                                                    (

                                                                        <span className="bg-yellow-400 text-black px-4 py-2 rounded-full font-bold">

                                                                            Medium

                                                                        </span>

                                                                    )

                                                                    :

                                                                    (

                                                                        <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">

                                                                            Low

                                                                        </span>

                                                                    )

                                                    }

                                                </td>

                                                <td className="px-6">

                                                    {

                                                        incident.status === "Completed" ?

                                                            (

                                                                <span className="bg-green-600 text-white px-4 py-2 rounded-full">

                                                                    Completed

                                                                </span>

                                                            )

                                                            :

                                                            incident.status === "Accepted" ?

                                                                (

                                                                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full">

                                                                        Accepted

                                                                    </span>

                                                                )

                                                                :

                                                                incident.status === "Assigned" ?

                                                                    (

                                                                        <span className="bg-purple-600 text-white px-4 py-2 rounded-full">

                                                                            Assigned

                                                                        </span>

                                                                    )

                                                                    :

                                                                    (

                                                                        <span className="bg-slate-500 text-white px-4 py-2 rounded-full">

                                                                            Reported

                                                                        </span>

                                                                    )

                                                    }

                                                </td>

                                                <td className="px-6">

                                                    {

                                                        incident.assignedVolunteer ?

                                                            (

                                                                <div className="flex items-center gap-3">

                                                                    <div className="w-11 h-11 rounded-full bg-purple-100 flex items-center justify-center">

                                                                        <Users
                                                                            size={18}
                                                                            className="text-purple-700"
                                                                        />

                                                                    </div>

                                                                    <span className="font-semibold">

                                                                        {incident.assignedVolunteer.name}

                                                                    </span>

                                                                </div>

                                                            )

                                                            :

                                                            <span className="text-slate-400">

                                                                Not Assigned

                                                            </span>

                                                    }

                                                </td>

                                                <td className="px-6">

                                                    {

                                                        incident.assignedHospital ?

                                                            (

                                                                <div className="flex items-center gap-3">

                                                                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center">

                                                                        <Hospital
                                                                            size={18}
                                                                            className="text-blue-700"
                                                                        />

                                                                    </div>

                                                                    <span className="font-semibold">

                                                                        {incident.assignedHospital.name}

                                                                    </span>

                                                                </div>

                                                            )

                                                            :

                                                            <span className="text-slate-400">

                                                                Not Assigned

                                                            </span>

                                                    }

                                                </td>

                                                <td className="px-6">

                                                    <div className="flex flex-col gap-3">

                                                        <button

                                                            onClick={() => {
                                                                setSelectedIncident(incident._id);
                                                                setShowVolunteerModal(true);
                                                            }}

                                                            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl font-semibold transition"

                                                        >

                                                            Assign Volunteer

                                                        </button>

                                                        <button

                                                            onClick={() => {
                                                                setSelectedIncident(incident._id);
                                                                setShowHospitalModal(true);
                                                            }}

                                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold transition"

                                                        >

                                                            Assign Hospital

                                                        </button>

                                                    </div>

                                                </td>

                                            </motion.tr>

                                        ))

                                }

                            </tbody>

                        </table>

                    </div>

                </motion.div>

            </div>





            {/* ================= Volunteer Modal ================= */}

            {
                showVolunteerModal && (

                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">

                            <h2 className="text-3xl font-bold mb-6">
                                Assign Volunteer
                            </h2>

                            <input
                                type="text"
                                placeholder="Volunteer ID"
                                value={volunteerId}
                                onChange={(e) => setVolunteerId(e.target.value)}
                                className="w-full border rounded-xl p-4 mb-6"
                            />

                            <div className="flex justify-end gap-4">

                                <button
                                    onClick={() => setShowVolunteerModal(false)}
                                    className="px-6 py-3 rounded-xl bg-gray-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={assignVolunteer}
                                    className="px-6 py-3 rounded-xl bg-purple-600 text-white"
                                >
                                    Assign
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

            {/* ================= Hospital Modal ================= */}

            {
                showHospitalModal && (

                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

                        <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">

                            <h2 className="text-3xl font-bold mb-6">
                                Assign Hospital
                            </h2>

                            <input
                                type="text"
                                placeholder="Hospital ID"
                                value={hospitalId}
                                onChange={(e) => setHospitalId(e.target.value)}
                                className="w-full border rounded-xl p-4 mb-6"
                            />

                            <div className="flex justify-end gap-4">

                                <button
                                    onClick={() => setShowHospitalModal(false)}
                                    className="px-6 py-3 rounded-xl bg-gray-200"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={assignHospital}
                                    className="px-6 py-3 rounded-xl bg-blue-600 text-white"
                                >
                                    Assign
                                </button>

                            </div>

                        </div>

                    </div>

                )
            }

        </div >

    );

}