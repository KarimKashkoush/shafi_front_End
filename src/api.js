import api from "./lib/api";

// appointments.js

export const getAppointments = async (userId, medicalCenterId) => {
      const res = await api.get(`/appointments`);

      const filtered = res.data.data.filter(
            (appt) => appt.userId === userId || appt.userId === medicalCenterId
      );

      return filtered;
};

export const getAppointmentsForDashboard = async (medicalCenterId) => {
      const res = await api.get(`/getAppointmentsForDashboard/${medicalCenterId}`);
      return res.data.data;
};

export const getPaymentsByMedicalCenter = async (medicalCenterId) => {
      const res = await api.get(`/getPaymentsByMedicalCenter/${medicalCenterId}`);
      return res.data.payments;
};

export const getWalletPaymentRows = async (
      medicalCenterId,
      start,
      end,
      doctorId = "all"
) => {
      const res = await api.get(`/wallet-payments/${medicalCenterId}`, {
            params: { start, end, doctorId },
      });

      return res.data.rows;
};

export const createCashout = async ({ amount, reason }) => {
      const res = await api.post(`/cashouts`, { amount, reason });
      return res.data.row;
};

export const getCashouts = async (start, end) => {
      const res = await api.get(`/cashouts`, {
            params: { start, end },
      });

      return res.data.rows;
};

export const deleteCashout = async (id) => {
      await api.delete(`/cashouts/${id}`);
};
