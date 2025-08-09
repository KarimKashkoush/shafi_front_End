import React, { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import './style.css'
import { useForm } from "react-hook-form"
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function SearchUser() {


      const { register, handleSubmit } = useForm({
            defaultValues: {
                  searchValue: "",
            }
      });

      const [showBox, setShowBox] = useState(false)
      const [usersData, setUsersData] = useState({})
      const [foundUser, setFoundUser] = useState(null)

      useEffect(() => {
            async function fetchUsers() {
                  try {
                        const res = await axios.get("https://shafi-be8b0-default-rtdb.firebaseio.com/UsersData.json")
                        setUsersData(res.data || {})
                  } catch (err) {
                        console.error("فشل تحميل البيانات:", err)
                  }
            }

            fetchUsers()
      }, [])

      function onSubmit(data) {
            const searchTerm = data.searchValue.trim();
            if (!searchTerm) return;

            const found = Object.entries(usersData).find(([id, user]) =>
                  user?.nationalId === searchTerm || user?.phoneNumber === searchTerm
            );

            if (found) {
                  const [id, user] = found;
                  setFoundUser({ ...user, id });
            } else {
                  setFoundUser(null);
            }
      }

      return (
            <section className='search-user'>
                  <Button className='btn fw-bold' onClick={() => setShowBox(!showBox)}>
                        البحث عن مستخدم
                  </Button>

                  {showBox && (
                        <section className="search-box">
                              <Button className='btn close-box' onClick={() => setShowBox(false)}>X</Button>
                              <form onSubmit={handleSubmit(onSubmit)}>
                                    <input
                                          type="text"
                                          {...register('searchValue')}
                                          className="search-input"
                                          placeholder="أدخل الرقم القومي أو رقم الهاتف"
                                    />
                                    <Button type='submit' className="btn btn-primary search-btn fw-bold">بحث</Button>
                              </form>

                              {foundUser && (
                                    <div className="result-box mt-3 p-2 border rounded bg-light w-full">
                                          <Link to={`/UserData/${foundUser.id}`}>
                                                <strong>الاسم:</strong> {foundUser.firstName} {foundUser.fullName}
                                          </Link>
                                    </div>
                              )}
                        </section>
                  )}
            </section>
      )
}
