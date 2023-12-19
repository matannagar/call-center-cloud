const redisClient = require('../config/redis');
const { getTimeUntilMidnight } = require('../utils/helper.js');
const { getIO } = require('../config/socket');
const Call = require('../models/Call.js');
const socket = getIO();
const uuidv4 = require('uuid').v4;

socket.on('connection', async (socket) => {
    console.log('A client is connected to socket');
    // You can handle more socket events here if needed
    const callData = await getUpdatedData()
    socket.emit('callData', callData); // Send the current data to the client

});

const updatedData = {
    totalCalls: 0,
    complaints: 0,
    joining: 0,
    service: 0,
    disconnects: 0,
}

// Function to get updated data from Redis
const getUpdatedData = async () => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set the time to midnight

        // Create a unique key for each day
        const key = `calls:${currentDate}`;

        // Get data from Redis
        const totalCalls = await redisClient.HGET(key, 'total_calls') || "0";
        const complaints = await redisClient.HGET(key, 'total_complaint_calls') || "0";
        const joining = await redisClient.HGET(key, 'total_joining_calls') || "0";
        const service = await redisClient.HGET(key, 'total_service_calls') || "0";
        const disconnects = await redisClient.HGET(key, 'total_disconnecting_calls') || "0";
        const callsPerHour = await redisClient.HGET(key, 'calls_per_hour') || JSON.stringify(new Array(24).fill(0));
        return {
            totalCalls,
            complaints,
            joining,
            service,
            disconnects,
            callsPerHour
        };
    } catch (error) {
        console.log(`Error with getting data from Redis`, error);
        return updatedData; // Return the current data in case of an error
    }
};

const redisHandler = async (callData) => {
    const newCall = new Call({
        id: uuidv4(),
        firstName: callData.first_name,
        lastName: callData.last_name,
        age: callData.age,
        gender: callData.gender,
        city: callData.city,
        products: callData.products,
        topic: callData.topic,
        callStartTime: callData.call_start_time,
    });

    newCall.save()
        .then(() => {
            console.log('User created successfully');
        })
        .catch((error) => {
            console.error('Error creating user:', error);
        });
    await updateData(callData);
    const newData = await getUpdatedData();
    socket.emit('callData', newData);
}

// Function to update counters and averages
const updateData = async (callData) => {
    if (!callData) {
        console.error('Call data is missing');
        return;
    };
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0); // Set the time to midnight
        // Create a unique key for each day and topic
        const key = `calls:${currentDate}`;
        // Get call hour
        const callHour = new Date(callData.call_start_time).getHours();
        const callsPerHourArray = await redisClient.HGET(key, "calls_per_hour") || JSON.stringify(new Array(24).fill(0));
        const parsedArray = JSON.parse(callsPerHourArray);
        parsedArray[callHour] += 1;
        await redisClient.HSET(key, "calls_per_hour", JSON.stringify(parsedArray));

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
