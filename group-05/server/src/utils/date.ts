export const JAKARTA_TIME_ZONE = "Asia/Jakarta";
const DATE_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  timeZone: JAKARTA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  timeZone: JAKARTA_TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false
});

export type DateRange = {
  start: Date;
  end: Date;
};

export const formatJakartaDate = (date: Date) => DATE_FORMATTER.format(date);

export const formatJakartaTime = (date: Date) => TIME_FORMATTER.format(date);

export const normalizeDateInput = (value: string | Date) => {
  if (value instanceof Date) {
    return formatJakartaDate(value);
  }
  return value.slice(0, 10);
};

const parseDateParts = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  if (year === undefined || month === undefined || day === undefined) {
    throw new Error(`Invalid date: ${date}`);
  }
  return { year, month, day };
};

const parseTimeParts = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  if (hour === undefined || minute === undefined) {
    throw new Error(`Invalid time: ${time}`);
  }
  return { hour, minute };
};

export const addDaysToDateString = (date: string, days: number) => {
  const { year, month, day } = parseDateParts(date);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
};

export const dateStringDayOfWeek = (date: string) => {
  const { year, month, day } = parseDateParts(date);
  return new Date(Date.UTC(year, month - 1, day)).getUTCDay();
};

export const enumerateDates = (start: string, end: string) => {
  const dates: string[] = [];
  for (let cursor = start; cursor <= end; cursor = addDaysToDateString(cursor, 1)) {
    dates.push(cursor);
  }
  return dates;
};

export const jakartaDateTimeToUtc = (date: string, time: string) => {
  const { year, month, day } = parseDateParts(date);
  const { hour, minute } = parseTimeParts(time);
  return new Date(Date.UTC(year, month - 1, day, hour - 7, minute, 0, 0));
};

export const minutesFromTime = (time: string) => {
  const { hour, minute } = parseTimeParts(time);
  return hour * 60 + minute;
};

export const timeFromMinutes = (minutes: number) => {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;
  return `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
};

export const rangesOverlap = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
  aStart < bEnd && aEnd > bStart;

export const parseDateRange = (start?: string, end?: string): DateRange => {
  const today = formatJakartaDate(new Date());
  const startDate = start || today;
  const endDate = end || addDaysToDateString(startDate, 30);
  return {
    start: jakartaDateTimeToUtc(startDate, "00:00"),
    end: jakartaDateTimeToUtc(endDate, "23:59")
  };
};

export const toIsoMinute = (date: Date) => date.toISOString().replace(/\.\d{3}Z$/, ":00.000Z");
