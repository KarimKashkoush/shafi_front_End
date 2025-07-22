import { useEffect, useState } from "react";

export default function Pharmaceutical({ reports }) {
      const [currentMeds, setCurrentMeds] = useState([]);

      useEffect(() => {
            const today = new Date();
            const meds = [];

            Object.values(reports).forEach((report) => {
                  report.medications?.forEach((med) => {
                        if (med.from && med.to) {
                              const fromParts = med.from.split("/");
                              const toParts = med.to.split("/");
                              const fromDate = new Date(`${fromParts[2]}-${fromParts[1]}-${fromParts[0]}`);
                              const toDate = new Date(`${toParts[2]}-${toParts[1]}-${toParts[0]}`);

                              if (today >= fromDate && today <= toDate) {
                                    if (med.name) meds.push(med.name);
                              }
                        }
                  });
            });

            setCurrentMeds(meds);
      }, [reports]);

      return (
            <section className="pharmaceutical col-12 col-md-6 px-2">
                  <section className="content">
                        <h2>الأدويـــة الحالية</h2>
                        <ul>
                              {currentMeds.length > 0 ? (
                                    currentMeds.map((name, index) => <li key={index}>{name}</li>)
                              ) : (
                                    <li>لا يوجد أدوية حالياً</li>
                              )}
                        </ul>
                  </section>
            </section>
      );
}
