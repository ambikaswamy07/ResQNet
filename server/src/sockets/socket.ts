import { Server } from "socket.io";

let io: Server;

export const initializeSocket = (socketServer: Server) => {
    io = socketServer;

    io.on("connection", (socket) => {

        console.log(`🟢 Client Connected: ${socket.id}`);

        socket.on("disconnect", () => {

            console.log(`🔴 Client Disconnected: ${socket.id}`);

        });

    });
};

export const getIO = () => {

    if (!io) {
        throw new Error("Socket.IO has not been initialized.");
    }

    return io;
};

// ==========================
// Incident Events
// ==========================

export const emitIncidentCreated = (incident: any) => {
    getIO().emit("incidentCreated", incident);
};

export const emitIncidentUpdated = (incident: any) => {
    getIO().emit("incidentUpdated", incident);
};

export const emitIncidentDeleted = (incidentId: string) => {
    getIO().emit("incidentDeleted", {
        incidentId,
    });
};

export const emitVolunteerAssigned = (incident: any) => {
    getIO().emit("volunteerAssigned", incident);
};

export const emitHospitalAssigned = (incident: any) => {
    getIO().emit("hospitalAssigned", incident);
};

export const emitIncidentCompleted = (incident: any) => {
    getIO().emit("incidentCompleted", incident);
};