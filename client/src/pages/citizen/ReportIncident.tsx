import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function ReportIncident() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "Accident",
        priority: "Medium",
        latitude: "",
        longitude: "",
    });

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const getCurrentLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setForm((prev) => ({
                    ...prev,
                    latitude: position.coords.latitude.toString(),
                    longitude: position.coords.longitude.toString(),
                }));
            },
            () => {
                alert("Unable to fetch current location.");
            }
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/incidents", {
                title: form.title,
                description: form.description,
                category: form.category,
                priority: form.priority,
                latitude: Number(form.latitude),
                longitude: Number(form.longitude),
                reportedBy: user?._id,
            });

            alert("✅ Incident Reported Successfully");

            setForm({
                title: "",
                description: "",
                category: "Accident",
                priority: "Medium",
                latitude: "",
                longitude: "",
            });

            navigate("/");
        } catch (error: any) {
            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Failed to report incident."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center p-8">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-8">

                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                    🚨 Report Incident
                </h1>

                <p className="text-gray-500 mb-8">
                    Fill in the details below to report an emergency.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <input
                        type="text"
                        name="title"
                        placeholder="Incident Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        style={{
                            color: "#000",
                            backgroundColor: "#fff",
                            caretColor: "#000",
                        }}
                        className="w-full border border-gray-300 rounded-xl px-4 py-4"
                    />

                    <textarea
                        rows={5}
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        required
                        style={{
                            color: "#000",
                            backgroundColor: "#fff",
                            caretColor: "#000",
                        }}
                        className="w-full border border-gray-300 rounded-xl px-4 py-4 resize-none"
                    />

                    <div className="grid grid-cols-2 gap-5">

                        <select
                            name="category"
                            value={form.category}
                            onChange={handleChange}
                            style={{
                                color: "#000",
                                backgroundColor: "#fff",
                            }}
                            className="border border-gray-300 rounded-xl px-4 py-4"
                        >
                            <option>Accident</option>
                            <option>Medical</option>
                            <option>Fire</option>
                            <option>Flood</option>
                            <option>Earthquake</option>
                        </select>

                        <select
                            name="priority"
                            value={form.priority}
                            onChange={handleChange}
                            style={{
                                color: "#000",
                                backgroundColor: "#fff",
                            }}
                            className="border border-gray-300 rounded-xl px-4 py-4"
                        >
                            <option>Low</option>
                            <option>Medium</option>
                            <option>High</option>
                            <option>Critical</option>
                        </select>

                    </div>

                    <div className="grid grid-cols-2 gap-5">

                        <input
                            type="number"
                            step="any"
                            name="latitude"
                            placeholder="Latitude"
                            value={form.latitude}
                            onChange={handleChange}
                            required
                            style={{
                                color: "#000",
                                backgroundColor: "#fff",
                                caretColor: "#000",
                            }}
                            className="border border-gray-300 rounded-xl px-4 py-4"
                        />

                        <input
                            type="number"
                            step="any"
                            name="longitude"
                            placeholder="Longitude"
                            value={form.longitude}
                            onChange={handleChange}
                            required
                            style={{
                                color: "#000",
                                backgroundColor: "#fff",
                                caretColor: "#000",
                            }}
                            className="border border-gray-300 rounded-xl px-4 py-4"
                        />

                    </div>

                    <button
                        type="button"
                        onClick={getCurrentLocation}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl"
                    >
                        📍 Use Current Location
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl text-lg font-semibold"
                    >
                        {loading ? "Submitting..." : "🚨 Submit Incident"}
                    </button>

                </form>

            </div>
        </div>
    );
}