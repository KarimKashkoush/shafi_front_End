import Accordion from 'react-bootstrap/Accordion';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useContext, useState } from 'react';
import { AuthContext } from '../../../context/Auth.Context';

export default function Reports({ reports }) {
      const { user } = useContext(AuthContext)
      const userType = user?.UserData?.role
      const [isOpen, setIsOpen] = useState(false);
      const [photoIndex, setPhotoIndex] = useState(0);
      const [slides, setSlides] = useState([]);

      const openGallery = (images, index) => {
            const formattedSlides = images.map((image) => ({ src: image }));
            setSlides(formattedSlides);
            setPhotoIndex(index);
            setIsOpen(true);
      };

      const reportEntries = Object.entries(reports || {});


      return (
            <>
                  <section className="reports">
                        <section className="section-header">
                              <h2 className="section-title"><span> التـــ</span>قارير الطبية </h2>
                        </section>

                        <Accordion defaultActiveKey="0" flush>
                              {reportEntries
                                    .reverse().map(([key, report], idx) => (
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
                                                                                          <td>
                                                                                                {item.result ? (
                                                                                                      <img
                                                                                                            src={item.result}
                                                                                                            alt="xray result"
                                                                                                            loading="lazy"
                                                                                                            onClick={() => openGallery([item.result], 0)}
                                                                                                            style={{ maxWidth: "150px", cursor: "pointer" }}
                                                                                                      />
                                                                                                ) : ["patient", "doctor", "pharmacist", "clinical"].includes(userType) ? (
                                                                                                      <p>لم يتم اضافة نتيجة حتى الآن</p>
                                                                                                ) : ["lab", "radiology"].includes(userType) ? (
                                                                                                      <button className='btn m-auto'>إضافة نتيجة</button>
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
                                                                                                      <img
                                                                                                            src={item.result}
                                                                                                            alt="lab result"
                                                                                                            loading="lazy"
                                                                                                            onClick={() => openGallery([item.result], 0)}
                                                                                                            style={{ maxWidth: "150px", cursor: "pointer" }}
                                                                                                      />
                                                                                                ) : ["patient", "doctor", "pharmacy", "clinical"].includes(userType) ? (
                                                                                                      <p>لم يتم اضافة نتيجة حتى الآن</p>
                                                                                                ) : ["lab", "radiology"].includes(userType) ? (
                                                                                                      <button className='btn m-auto'>إضافة نتيجة</button>
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
                                          </Accordion.Item>
                                    ))}
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
