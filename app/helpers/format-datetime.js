import { helper } from '@ember/component/helper';

export default helper(function formatDatetime([timestamp]) {
  if (!timestamp) {
    return 'N/A'; // Return a default value if the timestamp is invalid
  }

  // Handle Firestore Timestamp objects or Unix timestamps
  const date = timestamp.seconds
    ? new Date(timestamp.seconds * 1000)
    : new Date(timestamp);

  return date.toISOString().slice(0, 16); // Format for datetime-local
});
