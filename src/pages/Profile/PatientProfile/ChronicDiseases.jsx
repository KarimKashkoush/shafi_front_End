
export default function ChronicDiseases({ reports }) {
      const chronicDiseases = Object.values(reports)
            .filter((report) => report.chronicDisease === true && report.chronicDiseaseName)
            .map((report) => report.chronicDiseaseName);
      return (
            <section className="chronic col-12 col-md-6 px-2">
                  <div className="content ">
                        <h2>الأمـــراض المزمنة</h2>
                        <ul>
                              {chronicDiseases.length > 0 ? (
                                    chronicDiseases.map((disease, idx) => <li key={idx}>{disease}</li>)
                              ) : (
                                    <li className="text-center">لا توجد أمراض مزمنة مسجلة</li>
                              )}
                        </ul>
                  </div>
            </section>
      )
}
