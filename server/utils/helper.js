function getTimeUntilMidnight() {
    const now = new Date();
    const midnight = new Date(now);

    // Set the time to midnight
    midnight.setHours(24, 0, 0, 0);

    // Calculate the time difference between now and midnight
    const timeUntilMidnight = midnight - now;

    // Convert the time difference to seconds
    const secondsUntilMidnight = Math.floor(timeUntilMidnight / 1000);

    return secondsUntilMidnight;
}

module.exports = { getTimeUntilMidnight };
