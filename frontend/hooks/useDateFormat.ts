import { useCalendars } from "expo-localization";

export function useDateFormat(options?: Intl.DateTimeFormatOptions) {
  const calendar = useCalendars()[0];

  return new Intl.DateTimeFormat("en", {
    ...options,
    calendar: calendar.calendar ?? options?.calendar,
    hour12:
      calendar.uses24hourClock !== null
        ? calendar.uses24hourClock
        : options?.hour12,
    timeZone: calendar.timeZone ?? undefined,
  });
}
