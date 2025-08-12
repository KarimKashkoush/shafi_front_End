import { useEffect, useState } from "react";

export default function Pharmaceutical({ reports }) {
      const [currentMeds, setCurrentMeds] = useState([]);

      useEffect(() => {
            const today = new Date();

            const meds = Object.values(reports).flatMap((report) =>
                  report.medications?.filter((med) => {
                        const start = new Date(med.startDate);
                        const end = new Date(med.endDate);
                        return today >= start && today <= end;
                  }) || []
            );

            setCurrentMeds(meds);
      }, [reports]);


      return (
            <section className="pharmaceutical col-12 col-md-6 px-2">
                  <section className="content">
                        <h2>الأدويـــة الحالية</h2>
                        <ul>
                              {currentMeds.length > 0 ? (
                                    currentMeds.map((med, idx) => (
                                          <li key={idx}>
                                                <strong>{med.name}</strong> - {med.times}
                                          </li>
                                    ))
                              ) : (
                                    <li className="text-center">لا توجد أدوية حالياً</li>
                              )}
                        </ul>

                  </section>
            </section>
      );
}
