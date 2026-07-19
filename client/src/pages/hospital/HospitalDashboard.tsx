import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    Building2,
    BedDouble,
    RefreshCw,
    Activity,
    Search,
    MapPin,
    HeartPulse,
} from "lucide-react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

interface Hospital {
    _id: string;
    name: string;
    hospitalName: string;
    hospitalAddress: string;
    phone: string;
    totalBeds: number;
    availableBeds: number;
}

export default function HospitalDashboard() {

    const [loading, setLoading] = useState(true);

    const [stats, setStats] = useState({
        hospitals: 0,
        totalBeds: 0,
        availableBeds: 0,
        assignedIncidents: 0,
    });

    const [hospitals, setHospitals] = useState<Hospital[]>([]);

    const [search, setSearch] = useState("");

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {

        try {

            setLoading(true);

            const [dashboardRes, hospitalRes] =
                await Promise.all([
                    api.get("/hospitals/dashboard"),
                    api.get("/hospitals"),
                ]);

            setStats(dashboardRes.data.data);

            setHospitals(hospitalRes.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    const filteredHospitals =
        hospitals.filter((hospital) => {

            return (
                hospital.hospitalName
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||

                hospital.name
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );

        });

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-screen">

                <RefreshCw
                    className="animate-spin text-blue-600"
                    size={60}
                />

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-100 p-8">

            <div className="bg-gradient-to-r from-red-600 via-pink-600 to-purple-700 rounded-3xl shadow-2xl p-10 text-white mb-10">

                <div className="flex flex-col lg:flex-row justify-between items-center">

                    <div>

                        <h1 className="text-5xl font-extrabold">
                            🏥 Hospital Command Center
                        </h1>

                        <p className="mt-4 text-lg text-pink-100 max-w-2xl">
                            Manage hospital resources, monitor bed availability,
                            coordinate emergency admissions, and support rescue operations
                            efficiently.
                        </p>

                        <button
                            onClick={loadDashboard}
                            className="mt-8 bg-white text-red-700 hover:bg-slate-100 px-6 py-3 rounded-xl font-semibold"
                        >
                            🔄 Refresh Dashboard
                        </button>

                    </div>

                    <div className="mt-10 lg:mt-0">

                        <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 text-center">

                            <HeartPulse
                                size={70}
                                className="mx-auto mb-4"
                            />

                            <h2 className="text-2xl font-bold">
                                Emergency Center
                            </h2>

                            <p className="text-xl mt-3">
                                {stats.availableBeds} Beds Available
                            </p>

                        </div>

                    </div>

                </div>

            </div>

            <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-10">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">

                                Hospitals

                            </p>

                            <h2 className="text-4xl font-bold mt-3">

                                {stats.hospitals}

                            </h2>

                        </div>

                        <Building2
                            size={42}
                            className="text-blue-600"
                        />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">

                                Total Beds

                            </p>

                            <h2 className="text-4xl font-bold mt-3">

                                {stats.totalBeds}

                            </h2>

                        </div>

                        <BedDouble
                            size={42}
                            className="text-indigo-600"
                        />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">

                                Available Beds

                            </p>

                            <h2 className="text-4xl font-bold mt-3 text-green-600">

                                {stats.availableBeds}

                            </h2>

                        </div>

                        <Activity
                            size={42}
                            className="text-green-600"
                        />

                    </div>

                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <div className="flex justify-between">

                        <div>

                            <p className="text-slate-500">

                                Assigned Cases

                            </p>

                            <h2 className="text-4xl font-bold mt-3 text-red-600">

                                {stats.assignedIncidents}

                            </h2>

                        </div>

                        <HeartPulse
                            size={42}
                            className="text-red-600"
                        />

                    </div>

                </div>

            </div>
            {/* ================= QUICK ACTIONS ================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 mb-10">

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
                >
                    <HeartPulse size={42} />

                    <h2 className="text-2xl font-bold mt-5">
                        Emergency Cases
                    </h2>

                    <p className="mt-3 opacity-90">
                        Monitor incoming emergency patients.
                    </p>

                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
                >
                    <BedDouble size={42} />

                    <h2 className="text-2xl font-bold mt-5">
                        Bed Management
                    </h2>

                    <p className="mt-3 opacity-90">
                        Track available beds across hospitals.
                    </p>

                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.03 }}
                    onClick={loadDashboard}
                    className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl p-8 text-white shadow-xl cursor-pointer"
                >
                    <RefreshCw size={42} />

                    <h2 className="text-2xl font-bold mt-5">
                        Refresh Data
                    </h2>

                    <p className="mt-3 opacity-90">
                        Reload hospital statistics instantly.
                    </p>

                </motion.div>

            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">

                <div className="relative">

                    <Search
                        size={18}
                        className="absolute left-4 top-4 text-gray-400"
                    />

                    <input

                        type="text"

                        placeholder="Search Hospital..."

                        value={search}

                        onChange={(e) => setSearch(e.target.value)}

                        className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-3 bg-white text-black"

                    />

                </div>

            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold text-slate-800">
                        Hospital Directory
                    </h2>

                    <span className="text-slate-500">
                        {filteredHospitals.length} Hospital(s)
                    </span>

                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-slate-100">

                            <tr>

                                <th className="text-left p-4">Hospital</th>

                                <th className="text-left p-4">Address</th>

                                <th className="text-left p-4">Phone</th>

                                <th className="text-left p-4">Total Beds</th>

                                <th className="text-left p-4">Available</th>

                                <th className="text-left p-4">Status</th>

                                <th className="text-left p-4">Action</th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredHospitals.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan={7}
                                        className="text-center py-10 text-slate-500"
                                    >
                                        No Hospitals Found
                                    </td>

                                </tr>

                            ) : (

                                filteredHospitals.map((hospital) => (

                                    <tr
                                        key={hospital._id}
                                        className="border-b hover:bg-slate-50 transition"
                                    >

                                        <td className="p-4">

                                            <div>

                                                <h3 className="font-bold">

                                                    {hospital.hospitalName || hospital.name}

                                                </h3>

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            <div className="flex items-center gap-2">

                                                <MapPin
                                                    size={16}
                                                    className="text-red-500"
                                                />

                                                {hospital.hospitalAddress || "-"}

                                            </div>

                                        </td>

                                        <td className="p-4">

                                            {hospital.phone}

                                        </td>

                                        <td className="p-4">

                                            {hospital.totalBeds}

                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${hospital.availableBeds > 10
                                                    ? "bg-green-600"
                                                    : hospital.availableBeds > 5
                                                        ? "bg-yellow-500"
                                                        : "bg-red-600"
                                                    }`}
                                            >
                                                {hospital.availableBeds}
                                            </span>

                                        </td>

                                        <td className="p-4">

                                            <span
                                                className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${hospital.availableBeds > 0
                                                    ? "bg-green-600"
                                                    : "bg-red-600"
                                                    }`}
                                            >
                                                {hospital.availableBeds > 0
                                                    ? "Available"
                                                    : "Full"}
                                            </span>

                                        </td>

                                        <td className="p-4">

                                            <button
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
                                            >
                                                Update Beds
                                            </button>

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