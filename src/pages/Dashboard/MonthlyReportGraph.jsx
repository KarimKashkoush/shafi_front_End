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

const getCurrentMonthLabels = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth(); // 0 = يناير
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      const labels = [];
      for (let i = 1; i <= daysInMonth; i++) {
            labels.push(`${i}/${month + 1}/${year}`); // اليوم/الشهر/السنة
      }
      return labels;
};

const labels = getCurrentMonthLabels();

const options = {
      responsive: true,
      scales: {
            y: { beginAtZero: true },
      },
};

export default function MonthlyReportGraph({ cases }) {
      return (
            <div style={{ maxWidth: '90%', margin: 'auto' }}>
                  <h4 style={{ textAlign: 'center'}}>عدد حالات الشهر الحالي</h4>
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
