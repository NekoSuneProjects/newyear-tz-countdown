/**
 * Automatically calculates New Year countdown for any IANA timezone
 * Works every year without updates
 *
 * @param {string} timeZone - e.g. "America/New_York"
 */
function getNewYearCountdown(timeZone) {
  if (!timeZone) {
    throw new Error("Timezone is required (e.g. America/New_York)");
  }

  const now = new Date();

  // Get current year in the given timezone
  const yearFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric"
  });

  const currentYearInTZ = Number(yearFormatter.format(now));

  // Always target NEXT year automatically
  const targetYear = currentYearInTZ + 1;

  // Create New Year date in target timezone
  const newYearInTZ = new Date(
    `${targetYear}-01-01T00:00:00`
  );

  // Convert New Year time from target timezone to UTC Date
  const newYearUTC = new Date(
    newYearInTZ.toLocaleString("en-US", { timeZone })
  );

  const diffMs = newYearUTC - now;

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
