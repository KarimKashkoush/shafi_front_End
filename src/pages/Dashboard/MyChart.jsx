import { Bar } from "react-chartjs-2";
import {
      Chart as ChartJS,
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend,
} from "chart.js";

ChartJS.register(
      BarElement,
      CategoryScale,
      LinearScale,
      Tooltip,
      Legend
);

export default function WeeklyCasesIncomeChart() {
      const data = {
            labels: [
                  "السبت",
                  "الأحد",
                  "الاثنين",
                  "الثلاثاء",
                  "الأربعاء",
                  "الخميس",
                  "الجمعة",
            ],
            datasets: [
                  {
                        label: "عدد الحالات",
                        data: [12, 8, 15, 9, 20, 14, 6],
                  },
                  {
                        label: "الدخل",
                        data: [2400, 1600, 3000, 1800, 4200, 2800, 1200],
                  },
            ],
      };

      const options = {
            responsive: true,
            scales: {
                  x: {
                        stacked: false, // جنب بعض
                  },
                  y: {
                        beginAtZero: true,
                  },
            },
      };

      return <Bar data={data} options={options} />;
}
