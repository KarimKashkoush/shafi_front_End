import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const DEFAULT_TZ = "Africa/Cairo";

function toDefaultTz(value) {
      if (!value) return null;
      const dt = dayjs.utc(value);
      if (!dt.isValid()) return null;
      return dt.tz(DEFAULT_TZ);
}

export function formatUtcDateTime(value, format = "HH:mm - DD/MM/YYYY") {
      const dt = toDefaultTz(value);
      return dt ? dt.format(format) : "—";
}

export function formatUtcDate(value, format = "DD/MM/YYYY") {
      const dt = toDefaultTz(value);
      return dt ? dt.format(format) : "—";
}

export function calculateAgeUtc(birthDateString) {
      const dt = toDefaultTz(birthDateString);
      if (!dt) return null;
      const now = dayjs().tz(DEFAULT_TZ);
      return now.diff(dt, "year");
}

export function formatUtcForInput(value) {
      const dt = toDefaultTz(value);
      return dt ? dt.format("YYYY-MM-DD") : "";
}


