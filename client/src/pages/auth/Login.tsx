import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);

            const res = await api.post("/auth/login", form);

            login(res.data.accessToken, res.data.user);

            alert("Login Successful");

            switch (res.data.user.role) {
                case "Citizen":
                    navigate("/");
                    break;

                case "Volunteer":
                    navigate("/volunteer");
                    break;

                case "Dispatcher":
                    navigate("/dispatcher");
                    break;

                case "Hospital":
                    navigate("/hospital");
                    break;

                default:
                    navigate("/login");
            }
        } catch (err: any) {
            alert(err.response?.data?.message || "Login Failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex justify-center items-center">

            <form
                onSubmit={handleLogin}
                className="bg-slate-900 p-8 rounded-xl w-[400px] space-y-5"
            >

                <h1 className="text-3xl font-bold text-white text-center">
                    ResQNet Login
                </h1>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full p-3 rounded bg-slate-800 text-white"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-3 rounded"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

        </div>
    );
}