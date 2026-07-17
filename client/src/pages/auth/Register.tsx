import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "Citizen",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            await api.post("/auth/register", form);

            alert("Registration Successful");

            navigate("/login");
        } catch (err: any) {
            alert(err.response?.data?.message || "Registration Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center">
            <form
                onSubmit={handleRegister}
                className="bg-slate-900 p-8 rounded-xl w-[420px] space-y-4"
            >
                <h1 className="text-3xl font-bold text-center text-white">
                    Create Account
                </h1>

                <input
                    name="name"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                >
                    <option>Citizen</option>
                    <option>Volunteer</option>
                    <option>Dispatcher</option>
                    <option>Hospital</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 p-3 rounded text-white"
                >
                    {loading ? "Creating..." : "Register"}
                </button>
            </form>
        </div>
    );
}