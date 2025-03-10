export const formatTimestamp = (timestamp: string | number | Date | null) => {
  // If timestamp is undefined or null, return a placeholder
  if (!timestamp) {
    return '--';
  }

  try {
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    // Get the current date for comparison
    const now = new Date();
    const diffInMilliseconds = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    // If less than a minute ago
    if (diffInSeconds < 60) {
      return 'Just now';
    }

    // If less than an hour ago
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    }

    // If less than 24 hours ago
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }

    // If less than 7 days ago
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }

    // For older dates, return the full date
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error formatting date';
  }
};

export const calculateTimeLeft = (createdAt: number, duration: number): string => {
  try {
    // Convert createdAt to milliseconds if it's in seconds (less than year 2100)
    const createdAtMs = createdAt < 10000000000 ? createdAt * 1000 : createdAt;
    const endTime = createdAtMs + (duration * 60 * 60 * 1000); // Convert hours to milliseconds
    const now = Date.now();
    const timeLeft = endTime - now;
    if (timeLeft <= 0) {
      return 'Ended';
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  } catch (error) {
    console.error('Error calculating time left:', { createdAt, duration, error });
    return '--';
  }
};