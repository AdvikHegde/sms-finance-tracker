// The objective of this file will be to normalize/stamdardize the data that will be extracted from the parsing function

export function normalizeDate(dateStr) {
  // Input: "08/05/25" → DD/MM/YY
  const [dd, mm, yy] = dateStr.split("/");

  const year = 2000 + parseInt(yy);
  const month = parseInt(mm) - 1; // JS months start from 0
  const day = parseInt(dd);

  const dateObj = new Date(year, month, day);

  const dayName = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  return {
    date: dateObj,
    day: dayName,
    month: month + 1,
    year
  };
}

// This function will work on the input as follows :
// "08/05/25" →
// {
//   date: 2025-05-08T00:00:00,
//   day: "Thursday",
//   month: 5,
//   year: 2025
// }
