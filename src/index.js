function getTimeZoneOffsetMinutes(timeZone, date) {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  const parts = Object.fromEntries(
    dtf.formatToParts(date).map(p => [p.type, p.value])
  );

  const asUTC = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second)
  );

  return (asUTC - date.getTime()) / 60000;
}

/**
 * Accurate New Year countdown for any IANA timezone
 */
function getNewYearCountdown(timeZone) {
  if (!timeZone) {
    throw new Error("Timezone is required (e.g. Europe/London)");
  }

  const now = new Date();

  // Current year in target timezone
  const currentYear = Number(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric"
    }).format(now)
  );

  const targetYear = currentYear + 1;

  // Jan 1 midnight UTC
  const jan1UTC = new Date(Date.UTC(targetYear, 0, 1, 0, 0, 0));

  // Offset of timezone at that moment
  const offsetMinutes = getTimeZoneOffsetMinutes(timeZone, jan1UTC);

  // True New Year moment in UTC
  const newYearUTC = jan1UTC.getTime() - offsetMinutes * 60_000;

  const diffMs = newYearUTC - now.getTime();

  if (diffMs <= 0) {
    return {
      timezone: timeZone,
      targetYear,
      message: "Happy New Year 🎉"
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);

  return {
    timezone: timeZone,
    targetYear,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalMilliseconds: diffMs
  };
}

module.exports = { getNewYearCountdown };
