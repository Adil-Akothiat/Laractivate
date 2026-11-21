import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relative time plugin
dayjs.extend(relativeTime);

/**
 * Converts an ISO date string to a human-readable relative time (e.g., "5 minutes ago", "2 weeks ago")
*/
export const formatRelativeTime = (dateString: string): string => {
  if (!dateString) return '';
  return dayjs(dateString).fromNow();
};

/**
 * Optional: Formats to absolute date if it's older than a certain threshold
 */
export const formatAbsoluteOrRelative = (dateString: string): string => {
  const date = dayjs(dateString);
  const now = dayjs();
  
  // If more than 7 days ago, show normal date (e.g., "Nov 6, 2026"), otherwise show relative
  if (now.diff(date, 'day') > 7) {
    return date.format('MMM D, YYYY');
  }
  
  return date.fromNow();
};