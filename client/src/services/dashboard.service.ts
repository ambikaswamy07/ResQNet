import api from "../api/axios";

export const getDashboardStats = async () => {
    const res = await api.get("/incidents/dashboard");
    return res.data.data;
};

export const getRecentIncidents = async () => {
    const res = await api.get("/incidents");
    return res.data.data;
};