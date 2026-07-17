import { useEffect, useState } from "react";
import api from "../../api/axios";
import socket from "../../socket/socket";

import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import {
    AlertTriangle,
    RefreshCw,
    MapPin,
    Ambulance,
    Hospital
} from "lucide-react";

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface Incident {

    _id: string;

    title: string;

    category: string;

    priority: string;

    status: string;

    location: {
        coordinates: number[];
    };

}

interface Volunteer {

    _id: string;

    name: string;

    location: {
        coordinates: number[];
    };

}

interface HospitalModel {

    _id: string;

    hospitalName: string;

    availableBeds: number;

    location: {
        coordinates: number[];
    };

}

function ChangeView({
    center
}: { center: [number, number] }) {

    const map = useMap();

    useEffect(() => {

        map.setView(center, 13);

    }, [center]);

    return null;

}

export default function LiveMap() {

    const [loading, setLoading] = useState(true);

    const [incidents, setIncidents] = useState<Incident[]>([]);

    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

    const [hospitals, setHospitals] = useState<HospitalModel[]>([]);

    const [position, setPosition] = useState<[number, number]>([
        12.9716,
        77.5946
    ]);

    useEffect(() => {

        loadData();

        getCurrentLocation();

        socket.on("incidentCreated", () => {

            console.log("🚨 New Incident");

            loadData();

        });

        socket.on("incidentUpdated", () => {

            console.log("🟡 Incident Updated");

            loadData();

        });

        socket.on("incidentDeleted", () => {

            console.log("❌ Incident Deleted");

            loadData();

        });

        socket.on("volunteerAssigned", () => {

            console.log("🚑 Volunteer Assigned");

            loadData();

        });

        socket.on("hospitalAssigned", () => {

            console.log("🏥 Hospital Assigned");

            loadData();

        });

        socket.on("incidentCompleted", () => {

            console.log("✅ Incident Completed");

            loadData();

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

    const loadData = async () => {

        try {

            setLoading(true);

            const [
                incidentRes,
                volunteerRes,
                hospitalRes
            ] = await Promise.all([

                api.get("/incidents"),

                api.get("/dispatcher/available-volunteers"),

                api.get("/hospitals")

            ]);

            setIncidents(
                incidentRes.data.data
            );

            setVolunteers(
                volunteerRes.data.data
            );

            setHospitals(
                hospitalRes.data.data
            );

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }

    };

    const getCurrentLocation = () => {

        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(

            (pos) => {

                setPosition([
                    pos.coords.latitude,
                    pos.coords.longitude
                ]);

            }

        );

    };

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

        <div className="min-h-screen bg-slate-100">

            <div className="bg-white shadow-lg p-6 flex justify-between items-center">

                <div>

                    <h1 className="text-4xl font-bold">

                        🗺 Live Emergency Map

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Real-Time Incident Monitoring

                    </p>

                </div>

                <button

                    onClick={loadData}

                    className="bg-blue-600 text-white px-6 py-3 rounded-xl"

                >

                    Refresh

                </button>

            </div>

            <div
                className="h-[85vh] w-full"
            >

                <MapContainer

                    center={position}

                    zoom={13}

                    className="h-full w-full"

                >

                    <ChangeView
                        center={position}
                    />

                    <TileLayer

                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                    />

                    <Circle

                        center={position}

                        radius={120}

                        pathOptions={{
                            color: "blue"
                        }}

                    />

                    <Marker position={position}>

                        <Popup>

                            📍 You are here

                        </Popup>

                    </Marker>
                    {/* ================= INCIDENTS ================= */}

                    {incidents.map((incident) => {

                        const latitude = incident.location.coordinates[1];
                        const longitude = incident.location.coordinates[0];

                        return (

                            <Marker
                                key={incident._id}
                                position={[latitude, longitude]}
                            >

                                <Popup>

                                    <div className="w-60">

                                        <div className="flex items-center gap-2 mb-3">

                                            <AlertTriangle
                                                size={20}
                                                className="text-red-600"
                                            />

                                            <h3 className="font-bold text-lg">
                                                {incident.title}
                                            </h3>

                                        </div>

                                        <p className="mb-2">
                                            <b>Category :</b> {incident.category}
                                        </p>

                                        <p className="mb-2">
                                            <b>Priority :</b>
                                            <span
                                                className={`ml-2 px-2 py-1 rounded text-white text-sm

${incident.priority === "Critical"
                                                        ? "bg-red-700"
                                                        : incident.priority === "High"
                                                            ? "bg-red-500"
                                                            : incident.priority === "Medium"
                                                                ? "bg-yellow-500"
                                                                : "bg-green-600"}

`}
                                            >
                                                {incident.priority}
                                            </span>
                                        </p>

                                        <p>

                                            <b>Status :</b>

                                            <span
                                                className="ml-2 text-blue-600 font-semibold"
                                            >
                                                {incident.status}
                                            </span>

                                        </p>

                                    </div>

                                </Popup>

                            </Marker>

                        );

                    })}

                    {/* ================= VOLUNTEERS ================= */}

                    {volunteers.map((volunteer) => {

                        const latitude =
                            volunteer.location.coordinates[1];

                        const longitude =
                            volunteer.location.coordinates[0];

                        return (

                            <Marker

                                key={volunteer._id}

                                position={[
                                    latitude,
                                    longitude
                                ]}

                            >

                                <Popup>

                                    <div className="w-56">

                                        <div className="flex items-center gap-2 mb-3">

                                            <Ambulance
                                                size={20}
                                                className="text-green-600"
                                            />

                                            <h3 className="font-bold">

                                                {volunteer.name}

                                            </h3>

                                        </div>

                                        <p className="text-green-600 font-semibold">

                                            Available Volunteer

                                        </p>

                                    </div>

                                </Popup>

                            </Marker>

                        );

                    })}

                    {/* ================= HOSPITALS ================= */}

                    {hospitals.map((hospital) => {

                        const latitude =
                            hospital.location.coordinates[1];

                        const longitude =
                            hospital.location.coordinates[0];

                        return (

                            <Marker

                                key={hospital._id}

                                position={[
                                    latitude,
                                    longitude
                                ]}

                            >

                                <Popup>

                                    <div className="w-60">

                                        <div className="flex items-center gap-2 mb-3">

                                            <Hospital
                                                size={20}
                                                className="text-blue-600"
                                            />

                                            <h3 className="font-bold">

                                                {hospital.hospitalName}

                                            </h3>

                                        </div>

                                        <p>

                                            🛏 Available Beds :

                                            <b className="text-green-600">

                                                {" "}
                                                {hospital.availableBeds}

                                            </b>

                                        </p>

                                    </div>

                                </Popup>

                            </Marker>

                        );

                    })}

                </MapContainer>

            </div>

            <div className="bg-white shadow-lg p-6 flex flex-wrap gap-8 justify-center">

                <div className="flex items-center gap-3">

                    <MapPin className="text-blue-600" />

                    <span>Your Location</span>

                </div>

                <div className="flex items-center gap-3">

                    <AlertTriangle className="text-red-600" />

                    <span>Incident</span>

                </div>

                <div className="flex items-center gap-3">

                    <Ambulance className="text-green-600" />

                    <span>Volunteer</span>

                </div>

                <div className="flex items-center gap-3">

                    <Hospital className="text-indigo-600" />

                    <span>Hospital</span>

                </div>

            </div>

        </div>

    );

}