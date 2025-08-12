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
                        const apiUrl = import.meta.env.VITE_API_URL;
                        const res = await axios.get(`${apiUrl}/allUsers`);
                        setUsersData(res.data.users);
                  } catch (err) {
                        console.error("فشل تحميل البيانات:", err);
                  }
            }
            fetchUsers();
      }, []);

      function onSubmit(data) {
            const searchTerm = data.searchValue.trim();
            if (!searchTerm) return;

            const found = usersData.find(user =>
                  user.nationalId === searchTerm || user.phone_number === searchTerm
            );

            if (found) {
                  setFoundUser(found);
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

                              {foundUser ? (
                                    <div className="result-box mt-3 p-2 border rounded bg-light w-full">
                                          <Link to={`/UserData/${foundUser.id}`}>
                                                <strong>الاسم:</strong> {foundUser.first_name} {foundUser.full_name}
                                          </Link>
                                    </div>
                              ) :
                                    (<p>لا يوجد مستخدم </p>)
                              }
                        </section>
                  )}
            </section>
      )
}
