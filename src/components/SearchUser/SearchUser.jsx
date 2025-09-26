import React, { useState } from 'react'
import { Button } from 'react-bootstrap'
import './style.css'
import { useForm } from "react-hook-form"
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SearchUser() {
      const { register, handleSubmit, reset } = useForm({
            defaultValues: {
                  searchValue: "",
            }
      });

      const [showBox, setShowBox] = useState(false)
      const [foundUser, setFoundUser] = useState(null)
      const [loading, setLoading] = useState(false)
      const [notFound, setNotFound] = useState(false)

      async function onSubmit(data) {
            const searchTerm = data.searchValue.trim();
            if (!searchTerm) return;

            setLoading(true);
            setNotFound(false);
            setFoundUser(null);

            try {
                  const apiUrl = import.meta.env.VITE_API_URL;
                  const res = await axios.get(`${apiUrl}/allUsers`);

                  const users = res.data.users || [];
                  const found = users.find(user =>
                        user.nationalId === searchTerm || user.phoneNumber === searchTerm
                  );

                  if (found) {
                        setFoundUser(found);
                  } else {
                        setNotFound(true);
                  }
            } catch (err) {
                  console.error("فشل البحث:", err);
                  setNotFound(true);
            } finally {
                  setLoading(false);
            }
      }

      function handleCloseBox() {
            setShowBox(false);
            setFoundUser(null);
            setNotFound(false);
            reset({ searchValue: "" }); // إفراغ الـ input
      }

      return (
            <section className='search-user'>
                  <Button className='btn fw-bold' onClick={() => setShowBox(!showBox)}>
                        البحث عن مستخدم
                  </Button>

                  {showBox && (
                        <section className="search-box">
                              <Button className='btn close-box' onClick={handleCloseBox}>X</Button>

                              <form onSubmit={handleSubmit(onSubmit)}>
                                    <input
                                          type="text"
                                          {...register('searchValue')}
                                          className="search-input"
                                          placeholder="أدخل الرقم القومي أو رقم الهاتف"
                                    />
                                    <Button type='submit' className="btn btn-primary search-btn fw-bold">
                                          {loading ? "جارٍ البحث..." : "بحث"}
                                    </Button>
                              </form>

                              {foundUser && (
                                    <div className="result-box mt-3 p-2 border rounded bg-light w-full">
                                          <Link to={`/UserData/${foundUser.id}`}>
                                                <strong>الاسم:</strong> {foundUser.firstName} {foundUser.fullName}
                                          </Link>
                                    </div>
                              )}

                              {notFound && !loading && (
                                    <p className="text-danger mt-2">لا يوجد مستخدم بهذه البيانات</p>
                              )}
                        </section>
                  )}
            </section>
      )
}
