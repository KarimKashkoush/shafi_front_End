import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import { toast } from "react-toastify";

export default function AddResult({ addResult, setAddResult }) {
      const [files, setFiles] = useState([]);
      const [loading, setLoading] = useState(false);
      const handleFileChange = (e) => {
            setFiles(Array.from(e.target.files));
      };

      

      const handleSubmit = async (e) => {
            setLoading(true)
            e.preventDefault();
            if (!files.length) return;

            const formData = new FormData();
            files.forEach(file => formData.append("resultFiles", file));

            formData.append("type", addResult.type);
            formData.append("index", addResult.index);
            const apiUrl = import.meta.env.VITE_API_URL;
            try {
                  await fetch(`${apiUrl}/reports/${addResult.reportId}/add-result`, {
                        method: "POST",
                        body: formData
                  });
                  setLoading(false)
                  toast.success("تم تسجيل النتيجة بنجاح 🎉");
                  
            } catch (err) {
                  console.log(err)
                  setLoading(false)
            }
            setAddResult(false);
      };

      return (
            <>
                  {addResult?.open && (
                        <section className="add-resul shadow rounded-3 p-3 text-center position-fixed bg-white border border-primary z-3 top-50 start-50 translate-middle w-75">
                              <button
                                    className='btn bg-primary text-white fw-bold mb-4'
                                    onClick={() => setAddResult(false)}
                              >
                                    X
                              </button>

                              <form onSubmit={handleSubmit}>
                                    <Form.Group className="mb-3">
                                          <Form.Control
                                                type="file"
                                                accept="image/*,application/pdf"
                                                multiple
                                                onChange={handleFileChange}
                                                style={{ display: "none" }}
                                                id="customFile"
                                          />
                                          <label
                                                htmlFor="customFile"
                                                className="btn fw-bold btn-warning"
                                                style={{ cursor: "pointer" }}
                                          >
                                                اختيار الملفات أو الصور
                                          </label>
                                    </Form.Group>

                                    <div className="preview mt-3 d-flex flex-wrap justify-content-center gap-3 mb-4">
                                          {files.map((file, idx) => {
                                                const isImage = file.type.startsWith("image/");
                                                const isPDF = file.type === "application/pdf";

                                                if (isImage) {
                                                      const imageUrl = URL.createObjectURL(file);
                                                      return (
                                                            <img
                                                                  key={idx}
                                                                  src={imageUrl}
                                                                  alt={file.name}
                                                                  style={{ width: 60, height: 60, objectFit: "cover", cursor: "pointer", borderRadius: 8 }}
                                                                  onClick={() => window.open(imageUrl)}
                                                            />
                                                      );
                                                }
                                                if (isPDF) {
                                                      const pdfUrl = URL.createObjectURL(file);
                                                      return (
                                                            <div
                                                                  key={idx}
                                                                  onClick={() => window.open(pdfUrl)}
                                                                  style={{
                                                                        width: 60,
                                                                        height: 60,
                                                                        display: "flex",
                                                                        justifyContent: "center",
                                                                        alignItems: "center",
                                                                        backgroundColor: "#f44336",
                                                                        color: "white",
                                                                        fontWeight: "bold",
                                                                        borderRadius: 8,
                                                                        cursor: "pointer",
                                                                  }}
                                                            >
                                                                  PDF
                                                            </div>
                                                      );
                                                }
                                                return null;
                                          })}
                                    </div>

                                    <button
                                          className='btn bg-primary fw-bold text-white w-100 p-2'
                                          disabled={loading}
                                    >
                                          {loading ? "جارٍ الإرســال..." : "إرســــال"}
                                    </button>
                              </form>
                        </section>
                  )}
            </>
      );
}

