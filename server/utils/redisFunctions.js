const redisClient = require('../config/redis');
const { getTimeUntilMidnight } = require('../utils/helper.js');

const redisHandler = async (callData) => {

    await updateData(callData);
}

// Function to update counters and averages
const updateData = async (callData) => {
    if (!callData) {

        console.error('Call data is missing');
        return;
    };
    console.log('processing call data into redis')
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

        // Create a unique key for each day and topic
        const key = `calls:${currentDate}`;
        // Increment the total_calls counter
        await redisClient.HINCRBY(key, 'total_calls', 1);

        // Increment topic-specific counters
        if (callData.topic) {
            await redisClient.HINCRBY(key, `total_${callData.topic}_calls`, 1);
        }

        // If the key doesn't exist, set its expiration time
        await redisClient.EXPIRE(key, getTimeUntilMidnight());
    } catch (error) {
        console.log(`Error with updating Redis DB`, error)
    }
};

module.exports = {
    updateData,
    redisHandler
};
