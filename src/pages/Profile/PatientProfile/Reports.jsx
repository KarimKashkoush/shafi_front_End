import Accordion from 'react-bootstrap/Accordion';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/Auth.Context';
import AddResult from '../../../components/AddResult/AddResult';

export default function Reports({ reports }) {
      const apiUrl = import.meta.env.VITE_API_URL;
      const { user } = useContext(AuthContext)
      const userType = user?.role
      const [isOpen, setIsOpen] = useState(false);
      const [photoIndex, setPhotoIndex] = useState(0);
      const [slides, setSlides] = useState([]);

      const openGallery = (images, index) => {
            const formattedSlides = images.map((image) => ({
                  src: image.startsWith("http") ? image : `${apiUrl}${image}`
            })); setSlides(formattedSlides);
            setPhotoIndex(index);
            setIsOpen(true);
      };

      const reportEntries = Object.entries(reports || {});
      const [addResult, setAddResult] = useState(false)

      return (
            <>
                  <AddResult addResult={addResult} setAddResult={setAddResult} />
                  <section className="reports">
                        <section className="section-header">
                              <h2 className="section-title"><span> التـــ</span>قارير الطبية </h2>
                        </section>

                        <Accordion defaultActiveKey="0" flush>

                              {reportEntries.length > 0 ? (
                                    reportEntries
                                          .slice()
                                          .reverse()
                                          .map(([key, report], idx) => (
                                                <Accordion.Item eventKey={idx.toString()} key={key}>
                                                      <Accordion.Item eventKey={idx.toString()} key={key}>
                                                            <Accordion.Header>تقرير رقم {reportEntries.length - idx} - {new Date(report.createdAt).toLocaleString("ar-EG", {
                                                                  dateStyle: "full",
                                                                  timeStyle: "short"
                                                            })}</Accordion.Header>
                                                            <Accordion.Body>
                                                                  <section className="content">
                                                                        <h3>التشخيص:</h3>
                                                                        <p>{report.reportText}</p>
                                                                  </section>

                                                                  <section className="content">
                                                                        <h3>الآشعة:</h3>
                                                                        {report.radiology.length > 0 ? (
                                                                              <table className='pharmaceutical'>
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
                                                                                                      <td>{item.name}</td>
                                                                                                      <td>{item.notes !== "" ? item.notes : 'لا يوجد'}</td>
                                                                                                      <td className='d-flex flex-wrap g-1'>
                                                                                                            {item.result ? (
                                                                                                                  (() => {
                                                                                                                        const resultArray = Array.isArray(item.result) ? item.result : [item.result];
                                                                                                                        return (
                                                                                                                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                                                                                    {resultArray.map((fileSrc, index) => {
                                                                                                                                          const fullPath = `${apiUrl}${fileSrc}`;
                                                                                                                                          if (fileSrc.toLowerCase().endsWith(".pdf")) {
                                                                                                                                                return (
                                                                                                                                                      <a
                                                                                                                                                            key={index}
                                                                                                                                                            href={fullPath}
                                                                                                                                                            target="_blank"
                                                                                                                                                            rel="noopener noreferrer"
                                                                                                                                                            style={{
                                                                                                                                                                  display: "inline-block",
                                                                                                                                                                  padding: "5px",
                                                                                                                                                                  border: "1px solid #ccc",
                                                                                                                                                                  borderRadius: "4px",
                                                                                                                                                                  textDecoration: "none",
                                                                                                                                                                  color: "#000",
                                                                                                                                                                  fontWeight: "bold"
                                                                                                                                                            }}
                                                                                                                                                      >
                                                                                                                                                            📄 عرض PDF
                                                                                                                                                      </a>
                                                                                                                                                );
                                                                                                                                          } else {
                                                                                                                                                return (
                                                                                                                                                      <img
                                                                                                                                                            key={index}
                                                                                                                                                            src={fullPath}
                                                                                                                                                            alt={`result-${index}`}
                                                                                                                                                            loading="lazy"
                                                                                                                                                            onClick={() => openGallery(resultArray, index)}
                                                                                                                                                            style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                                                                                                                                      />
                                                                                                                                                );
                                                                                                                                          }
                                                                                                                                    })}
                                                                                                                              </div>
                                                                                                                        );
                                                                                                                  })()
                                                                                                            ) : ["patient", "doctor", "pharmacist", "clinical", undefined].includes(userType) ? (
                                                                                                                  <p>لم يتم اضافة نتيجة حتى الآن</p>
                                                                                                            ) : ["lab", "radiology"].includes(userType) ? (
                                                                                                                  <button
                                                                                                                        className='btn m-auto'
                                                                                                                        onClick={() => setAddResult({ open: true, reportId: report.id, type: "radiology", index })}
                                                                                                                  >
                                                                                                                        إضافة نتيجة
                                                                                                                  </button>) : null}
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
                                                                        {report.labTests.length > 0 ? (
                                                                              <table className='pharmaceutical'>
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
                                                                                                      <td>{item.name}</td>
                                                                                                      <td>{item.notes !== "" ? item.notes : 'لا يوجد'}</td>
                                                                                                      <td>
                                                                                                            {item.result ? (
                                                                                                                  (() => {
                                                                                                                        const resultArray = Array.isArray(item.result) ? item.result : [item.result];
                                                                                                                        return (
                                                                                                                              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                                                                                                                                    {resultArray.map((fileSrc, index) => {
                                                                                                                                          const fullPath = `${apiUrl}${fileSrc}`;
                                                                                                                                          if (fileSrc.toLowerCase().endsWith(".pdf")) {
                                                                                                                                                return (
                                                                                                                                                      <a
                                                                                                                                                            key={index}
                                                                                                                                                            href={fullPath}
                                                                                                                                                            target="_blank"
                                                                                                                                                            rel="noopener noreferrer"
                                                                                                                                                            style={{
                                                                                                                                                                  display: "inline-block",
                                                                                                                                                                  padding: "5px",
                                                                                                                                                                  border: "1px solid #ccc",
                                                                                                                                                                  borderRadius: "4px",
                                                                                                                                                                  textDecoration: "none",
                                                                                                                                                                  color: "#000",
                                                                                                                                                                  fontWeight: "bold"
                                                                                                                                                            }}
                                                                                                                                                      >
                                                                                                                                                            📄 عرض PDF
                                                                                                                                                      </a>
                                                                                                                                                );
                                                                                                                                          } else {
                                                                                                                                                return (
                                                                                                                                                      <img
                                                                                                                                                            key={index}
                                                                                                                                                            src={fullPath}
                                                                                                                                                            alt={`result-${index}`}
                                                                                                                                                            loading="lazy"
                                                                                                                                                            onClick={() => openGallery(resultArray, index)}
                                                                                                                                                            style={{ width: "50px", height: "50px", cursor: "pointer" }}
                                                                                                                                                      />
                                                                                                                                                );
                                                                                                                                          }
                                                                                                                                    })}
                                                                                                                              </div>
                                                                                                                        );
                                                                                                                  })()
                                                                                                            ) : ["patient", "doctor", "pharmacist", "clinical", undefined].includes(userType) ? (
                                                                                                                  <p>لم يتم اضافة نتيجة حتى الآن</p>
                                                                                                            ) : ["lab", "radiology"].includes(userType) ? (
                                                                                                                  <button
                                                                                                                        className='btn m-auto'
                                                                                                                        onClick={() => setAddResult({ open: true, reportId: report.id, type: "labTests", index })}
                                                                                                                  >
                                                                                                                        إضافة نتيجة
                                                                                                                  </button>) : null}
                                                                                                      </td>
                                                                                                </tr>
                                                                                          ))}
                                                                                    </tbody>
                                                                              </table>
                                                                        ) : (
                                                                              <p>لا توجد تحاليل مذكورة في هذا التقرير.</p>
                                                                        )}
                                                                  </section>


                                                                  <section className="content">
                                                                        <h3>الأدوية:</h3>

                                                                        {
                                                                              report.medications.length > 0 ? (
                                                                                    <table className='pharmaceutical'>
                                                                                          <thead>
                                                                                                <tr>
                                                                                                      <th>الاسم</th>
                                                                                                      <th>الميعاد</th>
                                                                                                      <th>من</th>
                                                                                                      <th>إلى</th>
                                                                                                </tr>
                                                                                          </thead>
                                                                                          <tbody>
                                                                                                {report.medications.map((med, index) => (
                                                                                                      <tr key={index}>
                                                                                                            <td>{med.name}</td>
                                                                                                            <td>{med.times}</td>
                                                                                                            <td>{med.startDate}</td>
                                                                                                            <td>{med.endDate}</td>
                                                                                                      </tr>
                                                                                                ))}
                                                                                          </tbody>
                                                                                    </table>
                                                                              ) : (
                                                                                    <p>لا توجد أدوية مذكورة في هذا التقرير.</p>
                                                                              )
                                                                        }
                                                                  </section>
                                                            </Accordion.Body>
                                                      </Accordion.Item>                                                </Accordion.Item>
                                          ))
                              ) : (
                                    <h2 className="text-center my-4">لا يوجد تقارير طبية</h2>
                              )}

                        </Accordion>
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
