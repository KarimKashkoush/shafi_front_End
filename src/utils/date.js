import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// تحويل الوقت من UTC → توقيت جهاز المستخدم
function toLocalTz(value) {
      if (!value) return null;
      const dt = dayjs.utc(value); // الوقت المخزن في DB UTC
      if (!dt.isValid()) return null;
      const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone; // توقيت الجهاز
      return dt.tz(userTz);
}

// عرض التاريخ والوقت بنظام 12 ساعة
export function formatUtcDateTime(value, format = "hh:mm A - DD/MM/YYYY") {
  const dt = toLocalTz(value);
  if (!dt) return "—";
  return dt.format(format); // بدون إضافة ساعتين
}

// عرض التاريخ فقط
export function formatUtcDate(value, format = "DD/MM/YYYY") {
      const dt = toLocalTz(value);
      return dt ? dt.format(format) : "—";
}

// حساب العمر
export function calculateAgeUtc(birthDateString) {
      const dt = toLocalTz(birthDateString);
      if (!dt) return null;
      const now = dayjs().tz(Intl.DateTimeFormat().resolvedOptions().timeZone);
      return now.diff(dt, "year");
}

// تنسيق للتواريخ في input (input type="date")
export function formatUtcForInput(value) {
      const dt = toLocalTz(value);
      return dt ? dt.format("YYYY-MM-DD") : "";
}

// تنسيق للتواريخ والوقت للـ input type="datetime-local"
export function formatUtcForDateTimeInput(value) {
      const dt = toLocalTz(value);
      return dt ? dt.format("YYYY-MM-DDTHH:mm") : "";
}
