import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import {
    Building2,
    Phone,
    MapPin,
    BedDouble,
    Search,
    CheckCircle,
    XCircle,
} from "lucide-react";

interface Hospital {
    _id: string;
    hospitalName: string;
    hospitalAddress: string;
    phone: string;
    availableBeds: number;
    totalBeds: number;
}

export default function Hospitals() {

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [hospitals, setHospitals] = useState<Hospital[]>([]);

    const loadHospitals = async () => {

        try {

            const res = await api.get("/hospitals");

            setHospitals(res.data.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadHospitals();

    }, []);

    const filteredHospitals = useMemo(() => {

        return hospitals.filter((hospital) =>
            (hospital.hospitalName || (hospital as any).name)
                .toLowerCase()
                .includes(search.toLowerCase())
        );

    }, [search, hospitals]);

    const totalBeds = hospitals.reduce(
        (sum, hospital) => sum + hospital.availableBeds,
        0
    );

    const fullHospitals = hospitals.filter(
        (hospital) => hospital.availableBeds === 0
    ).length;

    if (loading) {

        return (

            <div className="flex items-center justify-center h-screen text-2xl font-bold">

                Loading Hospitals...

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-100 p-10">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-5xl font-bold text-slate-800">

                        🏥 Nearby Hospitals

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Emergency hospital availability

                    </p>

                </div>

            </div>

            <div className="relative mb-8">

                <Search
                    className="absolute left-4 top-4 text-gray-400"
                    size={20}
                />

                <input
                    type="text"
                    placeholder="Search Hospital..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white rounded-xl pl-12 pr-5 py-4 shadow"
                />

            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">

                <div className="bg-white rounded-2xl shadow-lg p-6">

                    <h3 className="text-slate-500">

                        Total Hospitals

                    </h3>

                    <h1 className="text-5xl font-bold mt-3">

                        {hospitals.length}

                    </h1>

                </div>

                <div className="bg-green-600 rounded-2xl shadow-lg p-6 text-white">

                    <h3>

                        Available Beds

                    </h3>

                    <h1 className="text-5xl font-bold mt-3">

                        {totalBeds}

                    </h1>

                </div>

                <div className="bg-red-600 rounded-2xl shadow-lg p-6 text-white">

                    <h3>

                        Full Hospitals

                    </h3>

                    <h1 className="text-5xl font-bold mt-3">

                        {fullHospitals}

                    </h1>

                </div>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {filteredHospitals.map((hospital) => (

                    <div
                        key={hospital._id}
                        className="bg-white rounded-3xl shadow-xl p-6 hover:scale-105 transition-all duration-300"
                    >

                        <div className="flex justify-between">

                            <Building2
                                className="text-blue-600"
                                size={40}
                            />

                            {hospital.availableBeds > 0 ? (

                                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full flex items-center gap-2">

                                    <CheckCircle size={16} />

                                    Available

                                </span>

                            ) : (

                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full flex items-center gap-2">

                                    <XCircle size={16} />

                                    Full

                                </span>

                            )}

                        </div>

                        <h2 className="text-2xl font-bold mt-5">
                            {hospital.hospitalName || (hospital as any).name}
                        </h2>

                        <div className="mt-6 space-y-4">

                            <p className="flex gap-3">

                                <MapPin className="text-red-500" />

                                {hospital.hospitalAddress || "Address not available"}

                            </p>

                            <p className="flex gap-3">

                                <Phone className="text-blue-500" />

                                {hospital.phone || "Phone not available"}

                            </p>

                            <p className="flex gap-3">

                                <BedDouble className="text-green-600" />

                                {hospital.availableBeds} / {hospital.totalBeds} Beds

                            </p>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}