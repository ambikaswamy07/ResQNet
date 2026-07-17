import {
    Bell,
    UserCircle2,
    ShieldCheck,
    CalendarDays,
    Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const { user } = useAuth();

    const today = new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-200 shadow-sm">

            <div className="flex items-center justify-between px-10 py-5">

                {/* Left Section */}

                <div>

                    <h1 className="text-4xl font-extrabold text-slate-800">

                        🚑 ResQNet Dashboard

                    </h1>

                    <div className="flex items-center gap-3 mt-2 text-slate-500">

                        <CalendarDays size={18} />

                        <span>{today}</span>

                    </div>

                </div>

                {/* Right Section */}

                <div className="flex items-center gap-6">

                    {/* Search */}

                    <div className="hidden lg:flex items-center bg-slate-100 rounded-2xl px-4 py-3 w-72">

                        <Search
                            size={20}
                            className="text-slate-500"
                        />

                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-transparent outline-none border-none ml-3 w-full text-slate-700 placeholder:text-slate-400"
                        />

                    </div>

                    {/* Notification */}

                    <button className="relative w-12 h-12 rounded-2xl bg-slate-100 hover:bg-blue-600 hover:text-white transition-all duration-300 flex items-center justify-center">

                        <Bell size={22} />

                        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">

                            3

                        </span>

                    </button>

                    {/* Profile */}

                    <div className="flex items-center gap-4 bg-slate-100 rounded-2xl px-5 py-3 shadow-sm hover:shadow-lg transition-all">

                        <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">

                            {user?.name?.charAt(0).toUpperCase()}

                        </div>

                        <div>

                            <h2 className="font-bold text-slate-800 text-lg">

                                {user?.name}

                            </h2>

                            <div className="flex items-center gap-2 text-sm text-blue-600">

                                <ShieldCheck size={16} />

                                {user?.role}

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}