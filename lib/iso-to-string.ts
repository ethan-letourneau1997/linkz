export function isoToString(isoString: string): string {
  const date = new Date(isoString);

  const isCurrentDay = date.toDateString() === new Date().toDateString();

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric", // 12-hour numeric representation of the hour
    minute: "numeric", // Numeric representation of the minutes
    hour12: true, // Whether to use 12-hour time (true) or 24-hour time (false)
  };

  if (isCurrentDay) {
    // If it's the current day, show only the time
    const formattedTime = date.toLocaleString(undefined, timeOptions);
    return formattedTime;
  } else {
    // Otherwise, show the full date and time
    const dateTimeOptions: Intl.DateTimeFormatOptions = {
      ...timeOptions,
      month: "2-digit", // 2-digit numeric representation of the month
      day: "2-digit", // 2-digit numeric representation of the day
      year: "2-digit", // 2-digit numeric representation of the year
    };

    const formattedDate = date.toLocaleString(undefined, dateTimeOptions);
    return formattedDate;
  }
}
