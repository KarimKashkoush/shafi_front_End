import Accordion from 'react-bootstrap/Accordion';
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { useState } from 'react';

export default function Reports({ reports }) {
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
                              {reportEntries.map(([key, report], idx) => (
                                    <Accordion.Item eventKey={idx.toString()} key={key}>
                                          <Accordion.Header>تقرير رقم {idx + 1}</Accordion.Header>
                                          <Accordion.Body>
                                                <section className="content">
                                                      <h3>التشخيص:</h3>
                                                      <p>{report.diagnosis}</p>
                                                </section>

                                                <section className="content">
                                                      <h3>صور الآشعة:</h3>
                                                      <ul className='image'>
                                                            {report.xray_images.map((image, index) => (
                                                                  <li key={index}>
                                                                        <img
                                                                              src={image}
                                                                              alt="xray"
                                                                              loading="lazy"
                                                                              onClick={() => openGallery(report.xray_images, index)}
                                                                        />
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                </section>

                                                <section className="content">
                                                      <h3>التحاليل الطبية:</h3>
                                                      <ul className='image'>
                                                            {report.lab_results.map((image, index) => (
                                                                  <li key={index}>
                                                                        <img
                                                                              src={image}
                                                                              alt="lab"
                                                                              loading="lazy"
                                                                              onClick={() => openGallery(report.lab_results, index)}
                                                                        />
                                                                  </li>
                                                            ))}
                                                      </ul>
                                                </section>

                                                <section className="content">
                                                      <h3>الأدوية:</h3>

                                                      {
                                                            report.medications.length > 0 ? (
                                                                  <table className='pharmaceutical'>
                                                                        <thead>
                                                                              <tr>
                                                                                    <th>الاسم</th>
                                                                                    <th>النوع</th>
                                                                                    <th>الميعاد</th>
                                                                                    <th>من</th>
                                                                                    <th>إلى</th>
                                                                              </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                              {report.medications.map((med, index) => (
                                                                                    <tr key={index}>
                                                                                          <td>{med.name}</td>
                                                                                          <td>{med.type}</td>
                                                                                          <td>{med.time}</td>
                                                                                          <td>{med.from}</td>
                                                                                          <td>{med.to}</td>
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
