import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    AlertTriangle,
    MapPinned,
    Hospital,
    Settings,
    LogOut,
    Shield,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Sidebar() {

    const { logout, user } = useAuth();

    const menus =
        user?.role === "Citizen"
            ? [
                {
                    title: "Dashboard",
                    icon: <LayoutDashboard size={20} />,
                    path: "/",
                },
                {
                    title: "Report Incident",
                    icon: <AlertTriangle size={20} />,
                    path: "/report",
                },
                {
                    title: "Live Map",
                    icon: <MapPinned size={20} />,
                    path: "/map",
                },
                {
                    title: "Hospitals",
                    icon: <Hospital size={20} />,
                    path: "/hospitals",
                },
                {
                    title: "Settings",
                    icon: <Settings size={20} />,
                    path: "/settings",
                },
            ]
            : user?.role === "Volunteer"
                ? [
                    {
                        title: "Dashboard",
                        icon: <LayoutDashboard size={20} />,
                        path: "/volunteer",
                    },
                    {
                        title: "Live Map",
                        icon: <MapPinned size={20} />,
                        path: "/map",
                    },
                    {
                        title: "Settings",
                        icon: <Settings size={20} />,
                        path: "/settings",
                    },
                ]
                : user?.role === "Dispatcher"
                    ? [
                        {
                            title: "Dashboard",
                            icon: <LayoutDashboard size={20} />,
                            path: "/dispatcher",
                        },
                        {
                            title: "Live Map",
                            icon: <MapPinned size={20} />,
                            path: "/map",
                        },
                        {
                            title: "Settings",
                            icon: <Settings size={20} />,
                            path: "/settings",
                        },
                    ]
                    : user?.role === "Hospital"
                        ? [
                            {
                                title: "Dashboard",
                                icon: <LayoutDashboard size={20} />,
                                path: "/hospital",
                            },
                            {
                                title: "Settings",
                                icon: <Settings size={20} />,
                                path: "/settings",
                            },
                        ]
                        : [];

    return (
        <aside className="w-72 min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-800 text-white flex flex-col shadow-2xl">

            {/* Logo */}

            <div className="px-8 py-8 border-b border-slate-700">

                <div className="flex items-center gap-4">

                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-2xl shadow-lg">

                        🚑

                    </div>

                    <div>

                        <h1 className="text-3xl font-extrabold tracking-wide">

                            ResQNet

                        </h1>

                        <p className="text-slate-400 text-sm">

                            Emergency Response Platform

                        </p>

                    </div>

                </div>

            </div>

            {/* User */}

            <div className="px-6 py-8">

                <div className="bg-slate-800 rounded-3xl p-5 shadow-xl">

                    <div className="flex items-center gap-4">

                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-2xl font-bold">

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                        <div>

                            <h2 className="font-bold text-lg">

                                {user?.name}

                            </h2>

                            <div className="flex items-center gap-2 text-cyan-300 text-sm">

                                <Shield size={15} />

                                {user?.role}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* Navigation */}

            <nav className="flex-1 px-5">

                {menus.map((menu) => (

                    <NavLink
                        key={menu.title}
                        to={menu.path}
                        className={({ isActive }) =>
                            `group flex items-center gap-4 rounded-2xl px-5 py-4 mb-3 font-medium transition-all duration-300
                            ${isActive
                                ? "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg scale-[1.02]"
                                : "hover:bg-slate-800 hover:translate-x-2"
                            }`
                        }
                    >

                        <span className="group-hover:scale-110 transition">

                            {menu.icon}

                        </span>

                        <span>

                            {menu.title}

                        </span>

                    </NavLink>

                ))}

            </nav>

            {/* Footer */}

            <div className="p-6 border-t border-slate-700">

                <button
                    onClick={logout}
                    className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 transition-all duration-300 rounded-2xl py-4 font-semibold flex justify-center items-center gap-3 shadow-lg hover:scale-[1.02]"
                >

                    <LogOut size={20} />

                    Logout

                </button>

                <p className="text-center text-xs text-slate-500 mt-5">

                    ResQNet v1.0

                </p>

            </div>

        </aside>
    );

}