import React, { useEffect, useState } from "react";
import axios from "axios";
import UsersTable from "./UsersTable";
export default function Users() {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      const fetchUsers = async () => {
            try {
                  const res = await axios.get(`${apiUrl}/getAllStafByAdmin`, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  setUsers(res.data.users);
            } catch (err) {
                  console.error("خطأ أثناء جلب المستخدمين:", err);
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => {
            fetchUsers();
      }, []);

      if (loading) return <p className="text-center mt-4">جاري تحميل المستخدمين...</p>;

      return (
            <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-center">كل المستخدمين</h2>


                  <UsersTable users={users}/>
            </div>
      );
}
