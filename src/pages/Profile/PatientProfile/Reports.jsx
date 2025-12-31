import Accordion from 'react-bootstrap/Accordion';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/Auth.Context';
import AddResult from '../../../components/AddResult/AddResult';
import pdfImage from '../../../assets/images/file.png';
import { formatUtcDateTime } from "../../../utils/date";

export default function Reports({ reports, results }) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const { user } = useContext(AuthContext);
      const userType = user?.role;
      const [isOpen, setIsOpen] = useState(false);
      const [photoIndex, setPhotoIndex] = useState(0);
      const [slides, setSlides] = useState([]);
      const [addResult, setAddResult] = useState(false);
      const [activeTab, setActiveTab] = useState("reports"); // 👈 tab الحالية

      const openGallery = (images, index) => {
            const formattedSlides = images.map((image) => ({
                  src: image.startsWith("http") ? image : `${apiUrl}${image}`,
            }));
            setSlides(formattedSlides);
            setPhotoIndex(index);
            setIsOpen(true);
      };

      const reportEntries = Object.entries(reports || {});

      console.log(reports)

      return (
            <>
                  <AddResult addResult={addResult} setAddResult={setAddResult} />

                  <section className="reports">
                        <section className="section-header">
                              <h2 className="section-title"><span> التـــ</span>قارير الطبية </h2>
                        </section>

                        {/* 🔘 الأزرار اللي بتبدل بين التقارير والنتائج */}
                        <div className="d-flex justify-content-center gap-3 mb-4">
                              <button
                                    className={`btn ${activeTab === "reports" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setActiveTab("reports")}
                              >
                                    التقارير
                              </button>
                              <button
                                    className={`btn ${activeTab === "results" ? "btn-primary" : "btn-outline-primary"}`}
                                    onClick={() => setActiveTab("results")}
                              >
                                    التحاليل والأشعة
                              </button>
                        </div>

                        {/* ✅ لو التب النشط "التقارير" */}
                        {activeTab === "reports" ? (
                              <Accordion defaultActiveKey="0" flush>
                                    {reportEntries.length > 0 ? (
                                          reportEntries?.map(([key, report], idx) => (
                                                <Accordion.Item eventKey={idx.toString()} key={key}>
                                                      <Accordion.Header>
                                                            تقرير رقم {idx + 1} -{" "}
                                                            {formatUtcDateTime(report.createdAt, "HH:mm - DD/MM/YYYY")}
                                                      </Accordion.Header>

                                                      <Accordion.Body>
                                                            <section className="content">
                                                                  <h3>التشخيص:</h3>
                                                                  <p>{report.reportText || report.report}</p>
                                                            </section>

                                                            <section className="content">
                                                                  <h3>أمراض مزمنة:</h3>
                                                                  <p>{report.chronicDiseaseName || "لا يوجد"}</p>
                                                            </section>

                                                            <section className="content">
                                                                  <h3>الآشعة:</h3>
                                                                  {Array.isArray(report.radiology) && report.radiology.length > 0 ? (
                                                                        <table className="pharmaceutical">
                                                                              <thead>
                                                                                    <tr>
                                                                                          <th>اسم الآشعة</th>
                                                                                          <th>ملاحظات</th>
                                                                                          <th>النتيجة</th>
                                                                                    </tr>
                                                                              </thead>
                                                                              <tbody>
                                                                                    {report.radiology.map((item, index) => (
                                                                                          <tr key={index}>
                                                                                                <td>{item.name || "لا يوجد"}</td>
                                                                                                <td>{item.notes !== "" ? item.notes : "لا يوجد"}</td>
                                                                                                <td className="d-flex flex-wrap gap-1 align-items-center justify-content-center">
                                                                                                      {item.result ? (
                                                                                                            (() => {
                                                                                                                  const resultArray = Array.isArray(item.result)
                                                                                                                        ? item.result
                                                                                                                        : [item.result];
                                                                                                                  return (
                                                                                                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                                                                                                                              {resultArray.map((fileSrc, index) => {
                                                                                                                                    const resultUrl = fileSrc.url;
                                                                                                                                    if (resultUrl?.toLowerCase().endsWith(".pdf")) {
                                                                                                                                          return (
                                                                                                                                                <a
                                                                                                                                                      key={index}
                                                                                                                                                      href={resultUrl}
                                                                                                                                                      target="_blank"
                                                                                                                                                      rel="noopener noreferrer"
                                                                                                                                                >
                                                                                                                                                      <img src={pdfImage} alt="" style={{ width: "40px", height: "40px", cursor: "pointer" }} />
                                                                                                                                                </a>
                                                                                                                                          );
                                                                                                                                    } else {
                                                                                                                                          return (
                                                                                                                                                <img
                                                                                                                                                      key={index}
                                                                                                                                                      src={resultUrl}
                                                                                                                                                      alt={`result`}
                                                                                                                                                      loading="lazy"
                                                                                                                                                      onClick={() => openGallery([resultUrl], index)}
                                                                                                                                                      style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                                                                                                                                />
                                                                                                                                          );
                                                                                                                                    }
                                                                                                                              })}
                                                                                                                        </div>
                                                                                                                  );
                                                                                                            })()
                                                                                                      ) : ["patient", "doctor", "pharmacist", "clinical", "medicalCenter", undefined].includes(userType) ? (
                                                                                                            <p>لم يتم اضافة نتيجة حتى الآن</p>
                                                                                                      ) : ["lab", "radiology"].includes(userType) ? (
                                                                                                            <button
                                                                                                                  className="btn m-auto"
                                                                                                                  onClick={() =>
                                                                                                                        setAddResult({
                                                                                                                              open: true,
                                                                                                                              reportId: report.id,
                                                                                                                              type: "radiology",
                                                                                                                              index,
                                                                                                                        })
                                                                                                                  }
                                                                                                            >
                                                                                                                  إضافة نتيجة
                                                                                                            </button>
                                                                                                      ) : null}
                                                                                                </td>
                                                                                          </tr>
                                                                                    ))}
                                                                              </tbody>
                                                                        </table>
                                                                  ) : (
                                                                        <p>لا توجد آشعة مذكورة في هذا التقرير.</p>
                                                                  )}
                                                            </section>

                                                            <section className="content">
                                                                  <h3>التحاليل:</h3>
                                                                  {Array.isArray(report.labTests) && report.labTests.length > 0 ? (

                                                                        <table className="pharmaceutical">
                                                                              <thead>
                                                                                    <tr>
                                                                                          <th>اسم التحليل</th>
                                                                                          <th>ملاحظات</th>
                                                                                          <th>النتيجة</th>
                                                                                    </tr>
                                                                              </thead>
                                                                              <tbody>
                                                                                    {report.labTests.map((item, index) => (
                                                                                          <tr key={index}>
                                                                                                <td>{item.name || "لا يوجد"}</td>
                                                                                                <td>{item.notes !== "" ? item.notes : "لا يوجد"}</td>
                                                                                                <td className="d-flex flex-wrap gap-1 align-items-center justify-content-center">
                                                                                                      {item.result ? (
                                                                                                            (() => {
                                                                                                                  const resultArray = Array.isArray(item.result)
                                                                                                                        ? item.result
                                                                                                                        : [item.result];
                                                                                                                  return (
                                                                                                                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", justifyContent: "center" }}>
                                                                                                                              {resultArray.map((fileSrc, index) => {
                                                                                                                                    const resultUrl = fileSrc.url;
                                                                                                                                    if (resultUrl?.toLowerCase().endsWith(".pdf")) {
                                                                                                                                          return (
                                                                                                                                                <a
                                                                                                                                                      key={index}
                                                                                                                                                      href={resultUrl}
                                                                                                                                                      target="_blank"
                                                                                                                                                      rel="noopener noreferrer"
                                                                                                                                                >
                                                                                                                                                      <img src={pdfImage} alt="" style={{ width: "40px", height: "40px", cursor: "pointer" }} />
                                                                                                                                                </a>
                                                                                                                                          );
                                                                                                                                    } else {
                                                                                                                                          return (
                                                                                                                                                <img
                                                                                                                                                      key={index}
                                                                                                                                                      src={resultUrl}
                                                                                                                                                      alt={`result`}
                                                                                                                                                      loading="lazy"
                                                                                                                                                      onClick={() => openGallery([resultUrl], index)}
                                                                                                                                                      style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                                                                                                                                />
                                                                                                                                          );
                                                                                                                                    }
                                                                                                                              })}
                                                                                                                        </div>
                                                                                                                  );
                                                                                                            })()
                                                                                                      ) : ["patient", "doctor", "pharmacist", "clinical", "medicalCenter", undefined].includes(userType) ? (
                                                                                                            <p>لم يتم اضافة نتيجة حتى الآن</p>
                                                                                                      ) : ["lab", "radiology"].includes(userType) ? (
                                                                                                            <button
                                                                                                                  className="btn m-auto"
                                                                                                                  onClick={() =>
                                                                                                                        setAddResult({
                                                                                                                              open: true,
                                                                                                                              reportId: report.id,
                                                                                                                              type: "labTests",
                                                                                                                              index,
                                                                                                                        })
                                                                                                                  }
                                                                                                            >
                                                                                                                  إضافة نتيجة
                                                                                                            </button>
                                                                                                      ) : null}
                                                                                                </td>
                                                                                          </tr>
                                                                                    ))}
                                                                              </tbody>
                                                                        </table>
                                                                  ) : (
                                                                        <p>لا توجد تحاليل مذكورة في هذا التقرير.</p>
                                                                  )}
                                                            </section>
                                                      </Accordion.Body>
                                                </Accordion.Item>
                                          ))
                                    ) : (
                                          <h2 className="text-center my-4">لا يوجد تقارير طبية</h2>
                                    )}
                              </Accordion>
                        ) : (
                              // ✅ لو التب النشط "التحاليل والأشعة"
                              <div className="results-section container my-4">
                                    {results?.length > 0 ? (
                                          <div className="row g-3 justify-content-center">
                                                {results.map((res, i) => (
                                                      <div
                                                            key={i}
                                                            className="col-12 col-sm-6 col-lg-4"
                                                      >
                                                            <div className="p-3 m-2 border rounded-4 shadow-sm text-center bg-light h-100">
                                                                  <p><strong>اسم الحالة:</strong> {res.caseName || "غير محدد"}</p>
                                                                  <p><strong>رقم الهاتف:</strong> {res.phone || "غير متوفر"}</p>
                                                                  <p><strong>الرقم القومي:</strong> {res.nationalId || "غير متوفر"}</p>
                                                                  <p><strong>نوع التحليل / الأشعة:</strong> {res.testName || "غير محدد"}</p>
                                                                  <p>
                                                                        <strong>تاريخ الإنشاء:</strong>{" "}
                                                                        {formatUtcDateTime(res.createdAt, "HH:mm - DD/MM/YYYY")}
                                                                  </p>

                                                                  {/* ✅ الملفات */}
                                                                  <div className="d-flex flex-wrap justify-content-center gap-3 mt-3">
                                                                        {Array.isArray(res.files) && res.files.length > 0 ? (
                                                                              res.files.map((fileUrl, index) => {
                                                                                    const isPdf = fileUrl.toLowerCase().endsWith(".pdf");
                                                                                    return isPdf ? (
                                                                                          <a
                                                                                                key={index}
                                                                                                href={fileUrl}
                                                                                                target="_blank"
                                                                                                rel="noopener noreferrer"
                                                                                          >
                                                                                                <img
                                                                                                      src={pdfImage}
                                                                                                      alt="PDF"
                                                                                                      style={{
                                                                                                            width: "50px",
                                                                                                            height: "50px",
                                                                                                            cursor: "pointer",
                                                                                                            transition: "transform 0.2s",
                                                                                                      }}
                                                                                                      onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
                                                                                                      onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                                                                                                />
                                                                                          </a>
                                                                                    ) : (
                                                                                          <img
                                                                                                key={index}
                                                                                                src={fileUrl}
                                                                                                alt={`result-${index}`}
                                                                                                loading="lazy"
                                                                                                onClick={() => openGallery([fileUrl], index)}
                                                                                                style={{
                                                                                                      width: "90px",
                                                                                                      height: "90px",
                                                                                                      objectFit: "cover",
                                                                                                      borderRadius: "10px",
                                                                                                      cursor: "pointer",
                                                                                                      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                                                                                                      transition: "transform 0.2s",
                                                                                                }}
                                                                                                onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
                                                                                                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
                                                                                          />
                                                                                    );
                                                                              })
                                                                        ) : (
                                                                              <p>لا توجد ملفات مرفقة</p>
                                                                        )}
                                                                  </div>
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    ) : (
                                          <h4 className="text-center text-muted">لا توجد نتائج تحاليل أو أشعة</h4>
                                    )}
                              </div>
                        )}
                  </section>

                  {isOpen && (
                        <Lightbox
                              open={isOpen}
                              close={() => setIsOpen(false)}
                              slides={slides}
                              index={photoIndex}
                              on={{ view: ({ index }) => setPhotoIndex(index) }}
                        />
                  )}
            </>
      );
}
