import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.getItem("token");
// appointments.js
export const getAppointments = async (userId, medicalCenterId) => {
      const res = await axios.get(`${apiUrl}/appointments`, {
            headers: {
                  Authorization: `Bearer ${token}`,
            },
      });


      const filtered = res.data.data.filter(
            appt => appt.userId === userId || appt.userId === medicalCenterId
      );

      return filtered;
};

export const getAppointmentsForDashboard = async (medicalCenterId) => {
      const res = await axios.get(`${apiUrl}/getAppointmentsForDashboard/${medicalCenterId}`, {
            headers: {
                  Authorization: `Bearer ${token}`,
            },
      });

      return res.data.data;
};

export const getPaymentsByMedicalCenter = async (medicalCenterId) => {
      const res = await axios.get(`${apiUrl}/getPaymentsByMedicalCenter/${medicalCenterId}`, {
            headers: {
                  Authorization: `Bearer ${token}`,
            },
      });

      return res.data.payments;
};
