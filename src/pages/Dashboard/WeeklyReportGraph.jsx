import { Bar } from "react-chartjs-2";
import {
      Chart as ChartJS,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const labels = [
      "السبت",
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
];

const options = {
      responsive: true,
      scales: {
            y: { beginAtZero: true },
      },
};

export default function WeeklyReportGraph({ cases }) {
      return (
            <div style={{ maxWidth: '90%', margin: 'auto' }}>
                  <h4 style={{ textAlign: "center" }}>عدد حالات الأسبوع الحالي</h4>
                  <Bar
                        data={{
                              labels,
                              datasets: [
                                    {     
                                          label: "عدد الحالات",     
                                          data: cases || [],     
                                          backgroundColor: "#0d6efd",     
                                    },
                              ],
                        }}
                        options={options}
                  />
            </div>
      );
}
