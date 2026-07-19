import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CitizenDashboard from "../pages/citizen/CitizenDashboard";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import MainLayout from "../layouts/MainLayout";

import ReportIncident from "../pages/citizen/ReportIncident";
import VolunteerDashboard from "../pages/volunteer/VolunteerDashboard";
import DispatcherDashboard from "../pages/dispatcher/DispatcherDashboard";
import HospitalDashboard from "../pages/hospital/HospitalDashboard";

import LiveMap from "../components/maps/LiveMap";
import Settings from "../pages/Settings";

import { useAuth } from "../context/AuthContext";
import Hospitals from "../pages/citizen/Hospitals";
import RoleProtectedRoute from "./RoleProtectedRoute";
function ProtectedRoute({
    children,
}: {
    children: React.ReactElement;
}) {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>

            <Routes>

                {/* ================= Authentication ================= */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ================= Citizen Dashboard ================= */}

                <Route
                    path="/"
                    element={
                        <RoleProtectedRoute allowedRoles={["Citizen"]}>
                            <CitizenDashboard />
                        </RoleProtectedRoute>
                    }
                />

                {/* ================= Report Incident ================= */}

                <Route
                    path="/report"
                    element={
                        <RoleProtectedRoute allowedRoles={["Citizen"]}>
                            <ReportIncident />
                        </RoleProtectedRoute>
                    }
                />

                {/* ================= Volunteer Dashboard ================= */}

                <Route
                    path="/volunteer"
                    element={
                        <RoleProtectedRoute allowedRoles={["Volunteer"]}>
                            <VolunteerDashboard />
                        </RoleProtectedRoute>
                    }
                />

                {/* ================= Dispatcher Dashboard ================= */}

                <Route
                    path="/dispatcher"
                    element={
                        <RoleProtectedRoute allowedRoles={["Dispatcher"]}>
                            <DispatcherDashboard />
                        </RoleProtectedRoute>
                    }
                />

                {/* ================= Hospital Dashboard ================= */}

                <Route
                    path="/hospital"
                    element={
                        <RoleProtectedRoute allowedRoles={["Hospital"]}>
                            <HospitalDashboard />
                        </RoleProtectedRoute>
                    }
                />

                {/* ================= Live Map ================= */}

                <Route
                    path="/map"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "Citizen",
                                "Volunteer",
                                "Dispatcher",
                                "Hospital",
                            ]}
                        >
                            <LiveMap />
                        </RoleProtectedRoute>
                    }
                />
                <Route
                    path="/hospitals"
                    element={
                        <RoleProtectedRoute allowedRoles={["Citizen"]}>
                            <Hospitals />
                        </RoleProtectedRoute>
                    }
                />


                {/* ================= Settings ================= */}

                <Route
                    path="/settings"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "Citizen",
                                "Volunteer",
                                "Dispatcher",
                                "Hospital",
                            ]}
                        >
                            <Settings />
                        </RoleProtectedRoute>
                    }
                />

                {/* ================= Default ================= */}

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>
    );
}