export const timestampToMs = (timestamp: string) =>
  timestamp
    .split(":")
    .reverse()
    .map(parseFloat)
    .reduce((acc, cur, i) => acc + cur * Math.pow(60, i) * 1000, 0);

export const formatMilliseconds = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(seconds)}`;
  } else {
    return `${minutes}:${padZero(seconds)}`;
  }
};

const padZero = (num: number): string => {
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
};

export const pathnameSplit = (pathname: string) => pathname.slice(1).split("/");

export const getTimestampByMs = (timestamps, timestamp_ms) => {
  return timestamps.reduce((prev, current) => {
    if (current.timestamp_ms <= timestamp_ms && current.timestamp_ms > prev.timestamp_ms) {
      return current;
    }
    return prev;
  }, timestamps[0]);
};
