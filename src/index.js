/**
 * Automatically calculates New Year countdown for any IANA timezone
 * Works every year without updates
 *
 * @param {string} timeZone - e.g. "America/New_York"
 */
function getNewYearCountdown(timeZone) {
  if (!timeZone) {
    throw new Error("Timezone is required (e.g. Europe/London)");
  }

  const now = new Date();

  // Get current year in target timezone
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric"
  }).formatToParts(now);

  const currentYear = Number(
    parts.find(p => p.type === "year").value
  );

  const targetYear = currentYear + 1;

  // Create Jan 1st midnight IN TARGET TIMEZONE (correctly)
  const newYearParts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).formatToParts(
    new Date(`${targetYear}-01-01T00:00:00Z`)
  );

  const map = Object.fromEntries(
    newYearParts.map(p => [p.type, p.value])
  );

  const newYearUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second)
  );

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
