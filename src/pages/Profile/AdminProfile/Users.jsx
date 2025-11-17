import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatUtcDate } from "../../../utils/date";
export default function Users() {
      const [users, setUsers] = useState([]);
      const [loading, setLoading] = useState(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const token = localStorage.getItem("token");

      // 🧩 جلب كل المستخدمين
      const fetchUsers = async () => {
            try {
                  const res = await axios.get(`${apiUrl}/getUserByAdmin`, {
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

      // 🧊 تجميد أو تفعيل المستخدم
      const toggleStatus = async (id) => {
            try {
                  const res = await axios.patch(`${apiUrl}/users/toggle/${id}`, {
                        headers: {
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  const updatedUser = res.data.user;
                  setUsers((prev) =>
                        prev.map((u) => (u.id === updatedUser.id ? { ...u, status: updatedUser.status } : u))
                  );
                  alert(res.data.message);
            } catch (err) {
                  console.error("خطأ أثناء تعديل الحالة:", err);
            }
      };

      useEffect(() => {
            fetchUsers();
      }, []);

      if (loading) return <p className="text-center mt-4">جاري تحميل المستخدمين...</p>;

      return (
            <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4 text-center">كل المستخدمين</h2>

                  <table className="min-w-full border border-gray-300 rounded-xl overflow-hidden shadow-md">
                        <thead className="bg-gray-100">
                              <tr>
                                    <th className="py-2 px-4 border">#</th>
                                    <th className="py-2 px-4 border">الاسم</th>
                                    <th className="py-2 px-4 border">البريد الإلكتروني</th>
                                    <th className="py-2 px-4 border">رقم الهاتف</th>
                                    <th className="py-2 px-4 border">الدور</th>
                                    <th className="py-2 px-4 border">الحالة</th>
                                    <th className="py-2 px-4 border">آخر تعديل</th>
                                    <th className="py-2 px-4 border">الإجراء</th>
                              </tr>
                        </thead>
                        <tbody>
                              {users.length > 0 ? (
                                    users.map((user, index) => (
                                          <tr key={user.id} className="text-center border-b hover:bg-gray-50">
                                                <td className="py-2 px-4 border">{index + 1}</td>
                                                <td className="py-2 px-4 border font-medium">{user.fullName}</td>
                                                <td className="py-2 px-4 border">{user.email}</td>
                                                <td className="py-2 px-4 border">{user.phoneNumber}</td>
                                                <td className="py-2 px-4 border">{user.role}</td>
                                                <td className="py-2 px-4 border">
                                                      <span
                                                            className={`px-2 py-1 rounded text-white ${user.status ? "bg-green-500" : "bg-red-500"
                                                                  }`}
                                                      >
                                                            {user.status ? "مفعل" : "مجمد"}
                                                      </span>
                                                </td>
                                                <td className="py-2 px-4 border">
                                                      {formatUtcDate(user.lastUpdated)}
                                                </td>
                                                <td className="py-2 px-4 border">
                                                      <button
                                                            onClick={() => toggleStatus(user.id)}
                                                            className={`px-3 py-1 rounded ${user.status
                                                                  ? "bg-red-500 hover:bg-red-600"
                                                                  : "bg-green-500 hover:bg-green-600"
                                                                  } text-white`}
                                                      >
                                                            {user.status ? "تجميد" : "تفعيل"}
                                                      </button>
                                                </td>
                                          </tr>
                                    ))
                              ) : (
                                    <tr>
                                          <td colSpan="8" className="py-4 text-center">
                                                لا يوجد مستخدمين
                                          </td>
                                    </tr>
                              )}
                        </tbody>
                  </table>
            </div>
      );
}
