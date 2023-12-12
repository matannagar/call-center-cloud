const redisClient = require('../config/redis');

const redisHandler = async (callData) => {
    // Check if Redis is connected
    if (!redisClient.connected) {
        console.error('Redis is not connected');
        return;
    }

    // Update Redis counters
    await updateRedisCounters(callData);

    // Update data
    await updateData(callData);
}

const updateRedisCounters = async (callData) => {
    const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    const key = `calls:${currentDate}`;

    // Example: Increment counters based on callData
    await redisClient.hincrby(key, 'totalCalls', 1);

    if (callData.type) {
        // Increment type-specific counter
        await redisClient.hincrby(key, `calls:${callData.type}`, 1);
    }
    // Add more logic to update other counters as needed

    // Set expiry time for the key (24 hours in seconds)
    await redisClient.expire(key, 24 * 60 * 60);
};

const resetData = async () => {
    // Your logic for resetting data
    console.log('Resetting Redis data...');

    // Example: Resetting counters to zero
    await client.set('total_number_of_calls', 0);
    await client.set('total_complaints', 0);
    await client.set('total_disconnects', 0);
    // ... add more counters as needed

    // Reset array for average calls per hour
    const hoursInDay = 24;
    const emptyArray = Array.from({ length: hoursInDay }, () => 0);
    await client.set('average_calls_per_hour', JSON.stringify(emptyArray));
};

// Function to update counters and averages
const updateData = async (callData) => {
    // Update total number of calls
    await client.incr('total_number_of_calls');

    // Update counters based on call topic
    switch (callData.topic) {
        case 'joining':
            // Update joining count
            await client.incr('total_joining_calls');
            break;
        case 'complaint':
            // Update complaint count
            await client.incr('total_complaints');
            break;
        case 'disconnect':
            // Update disconnect count
            await client.incr('total_disconnects');
            break;
        // Add more cases as needed
    }

    // Update average calls per hour
    const currentHour = new Date().getHours();
    const averageCallsPerHourKey = 'average_calls_per_hour';
    const averageCallsPerHour = JSON.parse(await client.get(averageCallsPerHourKey) || '[]');
    averageCallsPerHour[currentHour] += 1;
    await client.set(averageCallsPerHourKey, JSON.stringify(averageCallsPerHour));
};

// Set up a timer to reset data every 24 hours
setInterval(resetData, 24 * 60 * 60 * 1000); // Reset every 24 hours

module.exports = {
    updateRedisCounters,
    resetData,
    updateData,
    redisHandler
};
