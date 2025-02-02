import { useState, useCallback } from 'react';

enum Time {
  SECOND = 1,
  MINUTE = 60,
  HOUR = 3600,
  DAY = 86400,
  WEEK = 604800,
  SecondsToMiliseconds = 1000,
}

function relativeTime(dateString: string | null) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const secondsPast = Math.floor(
    (now.getTime() - date.getTime()) / Time.SecondsToMiliseconds,
  );

  if (secondsPast < Time.MINUTE) return `${secondsPast} seconds ago`;
  if (secondsPast < Time.HOUR)
    return `${Math.floor(secondsPast / Time.MINUTE)} minutes ago`;
  if (secondsPast <= Time.DAY)
    return `${Math.floor(secondsPast / Time.HOUR)} hours ago`;
  if (secondsPast <= Time.WEEK)
    return `${Math.floor(secondsPast / Time.DAY)} days ago`;

  const day = date.getDate();
  const month = date.getMonth(); // Months are zero indexed
  const year = date.getFullYear();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  if (year === now.getFullYear()) return `${monthNames[month]} ${day}`;
  return `${monthNames[month]} ${day}, ${year}`;
}

function useFormat() {
  const getFormatter = useCallback(() => {
    return {
      formatTime: (dateString: string) => relativeTime(dateString),
    };
  }, []);

  const [formatter] = useState(getFormatter());
  return formatter;
}

export default useFormat;
