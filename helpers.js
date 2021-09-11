const { format } = require("date-fns");
function formatDateToDB(dateObject) {
  return format(dateObject, "yyyy-MM-dd HH:mm:ss");
}

function yourRandomGenerator(rangeOfDays, startHour, hourRange) {
  let today = new Date(Date.now());
  return new Date(
    today.getYear() + 1900,
    today.getMonth(),
    today.getDate() + Math.random() * rangeOfDays,
    Math.random() * hourRange + startHour,
    Math.random() * 60
  );
}

module.exports = {
  formatDateToDB,
  yourRandomGenerator,
};
