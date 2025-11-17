import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Lightbox from "yet-another-react-lightbox";

import "yet-another-react-lightbox/styles.css";

import { Zoom } from "yet-another-react-lightbox/plugins";

import pdfImage from '../../../assets/images/file.png';
import { useParams } from "react-router";



export default function DoctorPatientReports() {
       const { nationalId } = useParams();
      const [reports, setReports] = useState([]);
      const [loading, setLoading] = useState(true);

      const token = localStorage.getItem("token");
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


      // جلب كل التقارير
      const fetchReports = async () => {
            try {
                  setLoading(true);
                  const res = await axios.get(`${apiUrl}/doctor/patientFiles/${nationalId}`, {
                        headers: { Authorization: `Bearer ${token}` }
                  });
                  setReports(res.data.data);
            } catch (err) {
                  console.error(err);
                  toast.error("حدث خطأ أثناء جلب التقارير");
            } finally {
                  setLoading(false);
            }
      };

      useEffect(() => { fetchReports(); }, []);


      return (
            <section>
                  {loading ? <p>⏳ جاري التحميل...</p> : (
                        <table className="table table-bordered table-striped text-center" style={{ width: "100%", minWidth: "1050px" }}>
                              <thead className="table-dark" style={{ verticalAlign: "middle" }}>
                                    <tr>
                                          <th>#</th>
                                          <th>التقرير</th>
                                          <th>الإجراء التالي</th>
                                          <th>الملفات</th>
                                          <th>تاريخ الإضافة</th>
                                    </tr>
                              </thead>
                              <tbody style={{ verticalAlign: "middle" }}>
                                    {reports.map((r, idx) => (
                                          <tr key={r.id}>
                                                <td>{idx + 1}</td>
                                                <td>
                                                      {r.result ? r.result.map((res) => (
                                                            <div key={res.id}>
                                                                  {res.report}
                                                            </div>
                                                      )) : (
                                                            <span className="text-danger fw-bold">❌ لم يتم إرفاق تقرير</span>
                                                      )}
                                                </td>

                                                <td>
                                                      {r.result ? r.result.map((res) => (
                                                            <div key={res.id}>
                                                                  {res.nextAction}
                                                            </div>
                                                      )) : (
                                                            <span className="text-danger fw-bold">❌</span>
                                                      )}
                                                </td>

                                                <td>
                                                      {r.result && r.result.length > 0 ? (
                                                            <div
                                                                  style={{
                                                                        display: "flex",
                                                                        gap: "10px",
                                                                        flexWrap: "wrap",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                  }}
                                                            >
                                                                  {r.result.map((res) =>
                                                                        res.files?.map((file, i) => {
                                                                              const fileUrl = file;

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
                                                                                                      src={pdfImage} // لازم يكون عندك pdfImage معرف
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
                                                                                                            r.result.map((res) => res.files).flat(),
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
                                                                        })
                                                                  )}
                                                            </div>
                                                      ) : (
                                                            <span className="text-danger fw-bold">❌ لم يتم إرفاق ملفات / صور</span>
                                                      )}
                                                </td>



                                                <td>{new Date(r.createdAt).toLocaleString()}</td>
                                          </tr>
                                    ))}
                              </tbody>

                        </table>
                  )}

                  <h4>رفع تقرير جديد</h4>


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
                              }}
                        />
                  )}

            </section>
      );
}
