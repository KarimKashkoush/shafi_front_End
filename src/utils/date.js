import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function formatUtcDateTime(value, format = "HH:mm - DD/MM/YYYY") {
      if (!value) return "—";
      const dt = dayjs.utc(value);
      return dt.isValid() ? dt.format(format) : "—";
}

export function formatUtcDate(value, format = "DD/MM/YYYY") {
      if (!value) return "—";
      const dt = dayjs.utc(value);
      return dt.isValid() ? dt.format(format) : "—";
}

export function calculateAgeUtc(birthDateString) {
      if (!birthDateString) return null;
      const birthDate = dayjs.utc(birthDateString);
      if (!birthDate.isValid()) return null;
      const now = dayjs.utc();
      return now.diff(birthDate, "year");
}


