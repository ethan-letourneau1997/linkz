interface getTimeSinceNowProps {
  originalTime: string;
  short?: boolean | null;
}

export function getTimeSinceNow({ originalTime, short }: getTimeSinceNowProps) {
  const timestamp = new Date(originalTime).getTime();
  const currentTime = new Date().getTime();
  const timeDifference = currentTime - timestamp;

  // Calculate the time units
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  // short form
  if (originalTime) {
    if (short) {
      if (days > 0) {
        return `${days}d ago`;
      } else if (hours > 0) {
        return `${hours}h ago`;
      } else if (minutes > 0) {
        return `${minutes}m ago`;
      } else {
        return `${seconds}s ago`;
      }
    } else {
      // Return the time difference in an appropriate format
      if (days > 0) {
        return `${days} day${days > 1 ? "s" : ""} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else if (minutes > 0) {
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else {
        return `${seconds} second${seconds !== 1 ? "s" : ""} ago`;
      }
    }
  } else {
    return null;
  }
}
