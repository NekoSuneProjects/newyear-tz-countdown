const { DateTime } = require("luxon");

function getNewYearCountdown(timeZone) {
  const now = DateTime.now().setZone(timeZone);

  const target = DateTime.fromObject(
    {
      year: now.year + 1,
      month: 1,
      day: 1,
      hour: 0,
      minute: 0,
      second: 0
    },
    { zone: timeZone }
  );

  const diff = target.toMillis() - now.toMillis();

  if (diff <= 0) {
    return {
      timezone: timeZone,
      targetYear: target.year,
      message: "Happy New Year 🎉"
    };
  }

  const totalSeconds = Math.floor(diff / 1000);

  return {
    timezone: timeZone,
    targetYear: target.year,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60
  };
}

module.exports = { getNewYearCountdown };
