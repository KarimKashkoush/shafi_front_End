import { useState } from "react";
import { formatUtcDate } from "../../../utils/date";


export default function UsersTable({ users }) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const [userList, setUserList] = useState(users);
      const token = localStorage.getItem("token");
      

      const handleToggleStatus = async (userId) => {
            try {
                  const res = await fetch(`${apiUrl}/toggleUserStatus/${userId}`, {
                        method: "PUT",
                        headers: {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${token}`,
                        },
                  });
                  const data = await res.json();

                  if (res.ok) {
                        // تحديث الحالة محليًا
                        setUserList((prev) =>
                              prev.map((u) => (u.id === userId ? { ...u, status: !u.status } : u))
                        );
                        alert(data.message);
                  } else {
                        alert(data.message || "حدث خطأ");
                  }
            } catch (err) {
                  console.error(err);
                  alert("حدث خطأ أثناء تعديل الحالة");
            }
      };

      console.log(users)
      return (
            <section className="users-table">
                  <section className="table overflow-auto">
                        <table className="table table-bordered table-striped text-center align-middle"
                              style={{ width: "100%", minWidth: "1050px" }}
                        >
                              <thead className="table-dark">
                                    <tr>
                                          <th className="py-2 px-4 border align-middle text-center">#</th>
                                          <th className="py-2 px-4 border align-middle text-center">الاسم</th>
                                          <th className="py-2 px-4 border align-middle text-center">البريد الإلكتروني</th>
                                          <th className="py-2 px-4 border align-middle text-center">رقم الهاتف</th>
                                          <th className="py-2 px-4 border align-middle text-center">الدور</th>
                                          <th className="py-2 px-4 border align-middle text-center">تاريخ الإنشاء</th>
                                          <th className="py-2 px-4 border align-middle text-center">الحالة</th>
                                          <th className="py-2 px-4 border align-middle text-center">الإجراء</th>
                                    </tr>
                              </thead>
                              <tbody>
                                    {userList.length > 0 ? (
                                          userList.map((user, index) => (
                                                <tr key={user.id} className="text-center border-b hover:bg-gray-50">
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            {index + 1}
                                                      </td>
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            {user.fullName}
                                                      </td>
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            {user.email}
                                                      </td>
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            {user.phoneNumber}
                                                      </td>
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            {user.role}
                                                      </td>
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            {formatUtcDate(user.createdAt)}
                                                      </td>
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            <span
                                                                  className={`px-2 py-1 rounded text-white ${user.status === "true" ? "bg-success" : "bg-warning"}`}
                                                            >
                                                                  {user.status === "true" ? "مفعل" : "مجمد"}
                                                            </span>
                                                      </td>
                                                      <td className="py-2 px-4 border align-middle text-center">
                                                            <button
                                                                  className={` btn px-2 py-1 rounded text-white  ${user.status === "true" ? "btn-warning" : "btn-success"}`}
                                                                  onClick={() => handleToggleStatus(user.id)}
                                                            >
                                                                  {user.status === "true" ? "تجميد" : "تفعيل"}
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
                  </section>
            </section>
      )
}
