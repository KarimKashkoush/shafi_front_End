import { useContext, useState } from 'react';
import { Button, Form, Row, Col } from 'react-bootstrap';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import "./style.css"
import { useParams } from 'react-router';
import axios from "axios";
import { AuthContext } from '../../context/Auth.Context';
import { toast } from "react-toastify";
const schema = z.object({
      reportText: z.string().optional(),
      chronicDisease: z.string().optional(),
      chronicDiseaseName: z.string().optional(),
      medications: z.array(z.object({
            name: z.string().optional(),
            startDate: z.string().optional(),
            endDate: z.string().optional(),
            times: z.string().optional()
      })),
      radiology: z.array(z.object({
            name: z.string().optional(),
            notes: z.string().optional()
      })),
      labTests: z.array(z.object({
            name: z.string().optional(),
            notes: z.string().optional()
      }))
});

export default function AddReport() {
      const { user } = useContext(AuthContext)
      const { id } = useParams();
      const [openNewReport, setOpenNewReport] = useState(false);
      const { register, handleSubmit, control, watch, formState: { errors } } = useForm({
            resolver: zodResolver(schema),
            defaultValues: {
                  reportText: "",
                  chronicDisease: "",
                  chronicDiseaseName: "",
                  medications: [{ name: "", startDate: "", endDate: "", times: "" }],
                  radiology: [{ name: "", notes: "" }],
                  labTests: [{ name: "", notes: "" }]
            }
      });


      const chronicDiseaseValue = watch("chronicDisease");

      const { fields: medFields, append: addMedication } = useFieldArray({ control, name: "medications" });
      const { fields: radFields, append: addRadiology } = useFieldArray({ control, name: "radiology" });
      const { fields: labFields, append: addLabTest } = useFieldArray({ control, name: "labTests" });

      const onSubmit = async (data) => {
            const finalData = {
                  ...data,
                  userId: id,
                  createdAt: new Date().toISOString()
            };

            try {
                  const apiUrl = import.meta.env.VITE_API_URL;
                  const response = await axios.post(
                        `${apiUrl}/addReport`,
                        finalData
                  );

                  if (response.data.message == "success") {
                        toast.success("تم إنشاء التقرير بنجاح 🎉");
                  }

            } catch (error) {
                  console.error("❌ حصل خطأ أثناء إرسال التقرير:", error);
            }
      }

      return (
            <section className="add-report py-2">
                  {(user?.role === 'clinic' || user?.role === 'doctor') &&
                        <Button className='btn fw-bold' onClick={() => { setOpenNewReport(!openNewReport) }}>
                              إضافة تقرير طبي جديد
                        </Button>
                  }

                  {openNewReport &&
                        <Form className='border p-2 rounded shadow mt-2' onSubmit={handleSubmit(onSubmit)}>
                              <Button className='px-3 fw-bold fs-5' onClick={() => { setOpenNewReport(!openNewReport) }}>X</Button>
                              <h4 className='fw-bold text-center py-3 form-header'><span>إضافة</span> تقرير طبي جديد</h4>

                              {/* التقرير الطبي */}
                              <Row className="mb-4 border p-2 rounded">
                                    <h4 className='text-end fw-bold'>التقرير الطبي</h4>
                                    <textarea className="form-control" placeholder="التقرير الطبي" {...register("reportText")} />
                                    {errors.reportText && <p className="text-danger">صيغة التقرير غير صحيحة</p>}
                              </Row>

                              {/* سؤال عن مرض مزمن */}
                              <Row className="mb-4 border p-2 rounded">
                                    <h4 className='text-end fw-bold'>هل يعاني من مرض مزمن؟</h4>
                                    <Col md={12}>
                                          <select className="form-control" {...register("chronicDisease")}>
                                                <option value="">اختر</option>
                                                <option value="yes">نعم</option>
                                                <option value="no">لا</option>
                                          </select>
                                    </Col>
                              </Row>

                              {/* إدخال اسم المرض إذا نعم */}
                              {chronicDiseaseValue === "yes" && (
                                    <Row className="mb-4 border p-2 rounded">
                                          <h4 className='text-end fw-bold'>اسم المرض أو العرض الظاهر</h4>
                                          <Col md={12}>
                                                <input type="text" placeholder="اسم المرض" className="form-control" {...register("chronicDiseaseName")} />
                                          </Col>
                                    </Row>
                              )}

                              {/* الأدوية */}
                              <Row className='mb-4 border p-2 rounded'>
                                    <h4 className='text-end fw-bold'>وصف الأدوية</h4>
                                    {medFields.map((item, index) => (
                                          <Row className="mb-3" key={item.id}>
                                                <Col md={3} className='p-1'>
                                                      <input type="text" placeholder="اسم الدواء" className="form-control" {...register(`medications.${index}.name`)} />
                                                </Col>
                                                <Col md={3} className='p-1'>
                                                      <input type="date" className="form-control" {...register(`medications.${index}.startDate`)} />
                                                </Col>
                                                <Col md={3} className='p-1'>
                                                      <input type="date" className="form-control" {...register(`medications.${index}.endDate`)} />
                                                </Col>
                                                <Col md={3} className='p-1'>
                                                      <input type="text" placeholder="أوقات الدواء" className="form-control" {...register(`medications.${index}.times`)} />
                                                </Col>
                                          </Row>
                                    ))}
                                    <Button type="button" className='bg-warning border-0' onClick={() => addMedication({ name: "", startDate: "", endDate: "", times: "" })}>
                                          إضافة دواء آخر
                                    </Button>
                              </Row>

                              {/* الأشعة */}
                              <Row className='mb-4 border p-2 rounded'>
                                    <h4 className='text-end fw-bold'>الأشعة</h4>
                                    {radFields.map((item, index) => (
                                          <Row className="mb-3" key={item.id}>
                                                <Col md={6} className='p-1'>
                                                      <input type="text" placeholder="اسم الأشعة" className="form-control" {...register(`radiology.${index}.name`)} />
                                                </Col>
                                                <Col md={6} className='p-1'>
                                                      <input type="text" placeholder="ملاحظات" className="form-control" {...register(`radiology.${index}.notes`)} />
                                                </Col>
                                          </Row>
                                    ))}
                                    <Button type="button" className='bg-warning border-0' onClick={() => addRadiology({ name: "", date: "", notes: "" })}>
                                          إضافة أشعة أخرى
                                    </Button>
                              </Row>

                              {/* التحاليل */}
                              <Row className='mb-4 border p-2 rounded'>
                                    <h4 className='text-end fw-bold'>التحاليل</h4>
                                    {labFields.map((item, index) => (
                                          <Row className="mb-3" key={item.id}>
                                                <Col md={6} className='p-1'>
                                                      <input type="text" placeholder="اسم التحليل" className="form-control" {...register(`labTests.${index}.name`)} />
                                                </Col>
                                                <Col md={6} className='p-1'>
                                                      <input type="text" placeholder="ملاحظات" className="form-control" {...register(`labTests.${index}.notes`)} />
                                                </Col>
                                          </Row>
                                    ))}
                                    <Button type="button" className='bg-warning border-0' onClick={() => addLabTest({ name: "", date: "", notes: "" })}>
                                          إضافة تحليل آخر
                                    </Button>
                              </Row>

                              <Row>
                                    <Button type="submit" className='p-2 shadow fw-bold'>تسجيل التقرير</Button>
                              </Row>
                        </Form>
                  }
            </section>
      );
}
