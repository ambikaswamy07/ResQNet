import { User, Mail, Phone, Shield, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Settings() {

    const { user, logout } = useAuth();
    console.log("Current User:", user);

    return (

        <div className="min-h-screen bg-slate-100 p-10">

            <div className="max-w-4xl mx-auto">

                <h1 className="text-4xl font-bold text-slate-800 mb-2">
                    ⚙️ Settings
                </h1>

                <p className="text-slate-500 mb-8">
                    Manage your profile and account
                </p>

                <div className="bg-white rounded-3xl shadow-xl p-8">

                    <div className="flex items-center gap-5 mb-10">

                        <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-4xl font-bold">

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                        <div>

                            <h2 className="text-3xl font-bold">
                                {user?.name}
                            </h2>

                            <p className="text-slate-500">
                                {user?.role}
                            </p>

                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="border rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <User className="text-blue-600" />

                                <h3 className="font-bold">
                                    Name
                                </h3>

                            </div>

                            <p>{user?.name}</p>

                        </div>

                        <div className="border rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <Mail className="text-green-600" />

                                <h3 className="font-bold">
                                    Email
                                </h3>

                            </div>

                            <p>{user?.email}</p>

                        </div>

                        <div className="border rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <Phone className="text-orange-600" />

                                <h3 className="font-bold">
                                    Phone
                                </h3>

                            </div>

                            <p>{user?.phone || "Not Available"}</p>

                        </div>

                        <div className="border rounded-2xl p-5">

                            <div className="flex items-center gap-3 mb-3">

                                <Shield className="text-purple-600" />

                                <h3 className="font-bold">
                                    Role
                                </h3>

                            </div>

                            <p>{user?.role}</p>

                        </div>

                    </div>

                    <div className="mt-10">

                        <button
                            onClick={logout}
                            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl flex items-center gap-3"
                        >
                            <LogOut size={20} />
                            Logout
                        </button>

                    </div>

                </div>

            </div>

        </div>

    );

}