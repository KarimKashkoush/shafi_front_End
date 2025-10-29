import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../lib/api"; // حسب مكان ملف api بتاعك
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// ✅ كده الصح – البلجن بييجي من نفس الباكدج
import { Zoom } from "yet-another-react-lightbox/plugins";
import pdfImage from '../../../assets/images/file.png';
export default function AppointmentDetails() {
      const { id } = useParams();
      const [appointment, setAppointment] = useState(null);


      const apiUrl = import.meta.env.VITE_API_URL;
      const [isOpen, setIsOpen] = useState(false);
      const [photoIndex, setPhotoIndex] = useState(0);
      const [slides, setSlides] = useState([]);

      const openGallery = (images, index) => {
            const formattedSlides = images.map((image) => ({
                  src: image.startsWith("http") ? image : `${apiUrl}${image}`,
            }));
            setSlides(formattedSlides);
            setPhotoIndex(index);
            setIsOpen(true);
      };



      useEffect(() => {
            const fetchAppointment = async () => {
                  try {
                        const res = await api.get(`/appointment/${id}`);
                        setAppointment(res.data);
                  } catch (err) {
                        console.error("Error fetching appointment:", err);
                  }
            };
            fetchAppointment();
      }, [id]);

      if (!appointment) return <p className="text-center mt-5">جاري تحميل البيانات...</p>;

      return (
            <div className="container mt-4">
                  <h3 className="mb-3 text-center">تفاصيل الحجز</h3>
                  {/* الجدول */}


                  <section className="table overflow-x-auto">
                        <table className="table table-bordered table-striped text-center" style={{ width: "100%", minWidth: "1050px" }}>
                              <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                    <tr>
                                          <th>اسم الحالة</th>
                                          <th>المطلوب</th>
                                          <th>رقم الهاتف</th>
                                          <th>الرقم القومي</th>
                                          <th>وقت التسجيل</th>
                                          <th>النتيجة</th>
                                          <th>اسم الدكتور</th>
                                    </tr>
                              </thead>
                              <tbody style={{ verticalAlign: "middle" }}>
                                    <tr key={`${appointment.id}`} >
                                          <td>{appointment.data.caseName}</td>
                                          <td>{appointment.data.testName}</td>
                                          <td>{appointment.data.phone}</td>
                                          <td>{appointment.data.nationalId || "❌ غير مسجل"}</td>

                                          <td>
                                                {appointment.data.createdAt
                                                      ? (() => {
                                                            const dateObj = new Date(new Date(appointment.data.createdAt).getTime() + 3 * 60 * 60 * 1000);

                                                            // الوقت (مثلاً 11:30)
                                                            const time = dateObj.toLocaleTimeString("ar-EN", {
                                                                  hour: "2-digit",
                                                                  minute: "2-digit",
                                                                  hour12: true,
                                                            });

                                                            // التاريخ (مثلاً 2/10/2025)
                                                            const date = dateObj.toLocaleDateString("en-GB", {
                                                                  day: "2-digit",
                                                                  month: "2-digit",
                                                                  year: "numeric",
                                                            });

                                                            return `${time} - ${date}`;
                                                      })()
                                                      : "—"}
                                          </td>

                                          <td>
                                                {appointment.data.resultFiles && appointment.data.resultFiles.length > 0 ? (
                                                      <div
                                                            style={{
                                                                  display: "flex",
                                                                  gap: "10px",
                                                                  flexWrap: "wrap",
                                                                  justifyContent: "center",
                                                                  alignItems: "center",
                                                            }}
                                                      >
                                                            {appointment.data.resultFiles.map((file, i) => {
                                                                  const fileUrl = file?.url || file;

                                                                  if (fileUrl?.toLowerCase().endsWith(".pdf")) {
                                                                        return (
                                                                              <a
                                                                                    key={i}
                                                                                    href={fileUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    title={`نتيجة ${i + 1}`}
                                                                              >
                                                                                    <img
                                                                                          src={pdfImage}
                                                                                          alt="PDF"
                                                                                          style={{ width: "40px", height: "40px", cursor: "pointer" }}
                                                                                    />
                                                                              </a>
                                                                        );
                                                                  } else {
                                                                        return (
                                                                              <img
                                                                                    key={i}
                                                                                    src={fileUrl}
                                                                                    alt={`نتيجة ${i + 1}`}
                                                                                    loading="lazy"
                                                                                    onClick={() =>
                                                                                          openGallery(
                                                                                                appointment.data.resultFiles.map((f) => f?.url || f),
                                                                                                i
                                                                                          )
                                                                                    }
                                                                                    style={{
                                                                                          width: "50px",
                                                                                          height: "50px",
                                                                                          borderRadius: "5px",
                                                                                          cursor: "pointer",
                                                                                          objectFit: "cover",
                                                                                    }}
                                                                              />
                                                                        );
                                                                  }
                                                            })}

                                                      </div>
                                                ) : (
                                                      <span className="text-danger fw-bold">❌ لم يتم إرفاق نتيجة</span>
                                                )}

                                          </td>

                                          <td>{appointment.data.doctorName || "—"}</td>
                                    </tr>
                              </tbody>
                        </table>
                  </section>

                  {isOpen && (
                        <Lightbox
                              open={isOpen}
                              close={() => setIsOpen(false)}
                              slides={slides}
                              index={photoIndex}
                              on={{ view: ({ index }) => setPhotoIndex(index) }}
                              plugins={[Zoom]} // ✅ تفعيل البلجن
                              zoom={{
                                    maxZoomPixelRatio: 3, // أقصى تكبير للصورة (3x)
                                    zoomInMultiplier: 1.3, // سرعة التكبير
                                    doubleTapDelay: 300, // دبل كليك للتكبير
                                    wheelZoom: true 
                              }}
                        />
                  )}
            </div>
      );
}
