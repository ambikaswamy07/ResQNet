import {
    Activity,
    AlertTriangle,
    CheckCircle2,
    Clock3,
    FileWarning,
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
                return <Activity size={30} />;

            case "Reported":
                return <FileWarning size={30} />;

            case "Assigned":
                return <Users size={30} />;

            case "Accepted":
                return <CheckCircle2 size={30} />;

            case "In Progress":
                return <Clock3 size={30} />;

            case "Completed":
                return <AlertTriangle size={30} />;

            default:
                return <Activity size={30} />;
        }
    };

    return (

        <div
            className="
            relative
            overflow-hidden
            rounded-3xl
            bg-white
            shadow-lg
            hover:shadow-2xl
            hover:-translate-y-2
            transition-all
            duration-300
            border
            border-slate-200
            p-7
        "
        >

            {/* Top Color Bar */}

            <div
                className={`absolute top-0 left-0 h-2 w-full ${color}`}
            />

            <div className="flex justify-between items-center">

                <div>

                    <p className="uppercase tracking-wider text-sm text-slate-500 font-semibold">

                        {title}

                    </p>

                    <h2 className="text-5xl font-extrabold mt-5 text-slate-800">

                        {value}

                    </h2>

                </div>

                <div
                    className={`${color}
                    w-20
                    h-20
                    rounded-3xl
                    flex
                    items-center
                    justify-center
                    text-white
                    shadow-xl`}
                >

                    {getIcon()}

                </div>

            </div>

            <div className="mt-6">

                <div className="w-full h-2 rounded-full bg-slate-100">

                    <div
                        className={`${color} h-2 rounded-full`}
                        style={{
                            width: `${Math.min(
                                Number(value) * 10,
                                100
                            )}%`,
                        }}
                    />

                </div>

            </div>

        </div>

    );
}