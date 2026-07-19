import CountUp from "react-countup";
import { motion } from "framer-motion";
import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    FileWarning,
    TrendingUp,
    Users,
} from "lucide-react";

interface DashboardCardProps {
    title: string;
    value: number | string;
    color: string;
}

export default function DashboardCard({
    title,
    value,
    color,
}: DashboardCardProps) {
    const getIcon = () => {
        switch (title) {
            case "Total Incidents":
                return <Activity size={32} />;

            case "Reported":
                return <FileWarning size={32} />;

            case "Assigned":
                return <Users size={32} />;

            case "Accepted":
                return <CheckCircle2 size={32} />;

            case "In Progress":
                return <Clock3 size={32} />;

            case "Completed":
                return <AlertTriangle size={32} />;

            default:
                return <Activity size={32} />;
        }
    };

    return (
        <motion.div
            whileHover={{
                y: -8,
                scale: 1.02,
            }}
            transition={{
                duration: 0.25,
            }}
            className="
        relative
        overflow-hidden
        rounded-3xl
        bg-white
        border
        border-slate-200
        shadow-card
        p-7
      "
        >
            {/* Top Gradient Bar */}

            <div
                className={`absolute top-0 left-0 h-2 w-full ${color}`}
            />

            {/* Background Circle */}

            <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-slate-100 opacity-40"></div>

            <div className="relative flex justify-between items-start">
                <div>
                    <p className="uppercase tracking-widest text-xs text-slate-500 font-bold">
                        {title}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                        <TrendingUp size={14} />
                        Live
                    </div>

                    <h2 className="mt-6 text-5xl font-extrabold text-slate-800">
                        {typeof value === "number" ? (
                            <CountUp
                                end={value}
                                duration={1.5}
                            />
                        ) : (
                            value
                        )}
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Updated just now
                    </p>
                </div>

                <div
                    className={`
            ${color}
            w-20
            h-20
            rounded-3xl
            flex
            items-center
            justify-center
            text-white
            shadow-xl
            transition-all
            duration-300
          `}
                >
                    {getIcon()}
                </div>
            </div>

            {/* Progress */}

            <div className="mt-8">
                <div className="flex justify-between text-xs text-slate-500 mb-2">
                    <span>Progress</span>
                    <span>
                        {Math.min(Number(value) * 10, 100)}%
                    </span>
                </div>

                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{
                            width: `${Math.min(Number(value) * 10, 100)}%`,
                        }}
                        transition={{
                            duration: 1,
                        }}
                        className={`${color} h-full rounded-full`}
                    />
                </div>
            </div>
        </motion.div>
    );
}