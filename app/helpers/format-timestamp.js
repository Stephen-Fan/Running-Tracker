import { helper } from '@ember/component/helper';

export default helper(function formatTimestamp([timestamp]) {
  if (!timestamp) return 'N/A';

  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);
  return date.toLocaleString(); // Formats to local date and time
});
