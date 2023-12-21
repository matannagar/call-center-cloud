const { getTimeUntilMidnight, generateCallEntity } = require('../utils/helper.js');
const { getIO } = require('../config/socket');
const { updatedData } = require('../data/data');
const socket = getIO();
const redisClient = require('../config/redis');

socket.on('connection', async (socket) => {
    console.log('A client is connected to socket');
    const callData = await getUpdatedData()
    socket.emit('callData', callData);
});

const getUpdatedData = async () => {
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const key = `calls:${currentDate}`;

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
        return updatedData;
    }
};

let redisHandlerCounter = 0;
const redisHandlerThreshold = 10;

const redisHandler = async (callData) => {
    await generateCallEntity(callData);
    await updateData(callData);
    const newData = await getUpdatedData();
    redisHandlerCounter++;
    if (redisHandlerCounter >= redisHandlerThreshold) {
        socket.emit('callData', newData);
        redisHandlerCounter = 0;
    }
}

const updateData = async (callData) => {
    if (!callData) {
        console.error('Call data is missing');
        return;
    };
    try {
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        const key = `calls:${currentDate}`;

        const callHour = new Date(callData.call_start_time).getHours();
        const callsPerHourArray = await redisClient.HGET(key, "calls_per_hour") || JSON.stringify(new Array(24).fill(0));
        const parsedArray = JSON.parse(callsPerHourArray);
        parsedArray[callHour] += 1;
        await redisClient.HSET(key, "calls_per_hour", JSON.stringify(parsedArray));

        await redisClient.HINCRBY(key, 'total_calls', 1);

        if (callData.topic) {
            await redisClient.HINCRBY(key, `total_${callData.topic}_calls`, 1);
        }

        await redisClient.EXPIRE(key, getTimeUntilMidnight());
    } catch (error) {
        console.log(`Error with updating Redis DB`, error)
    }
};

module.exports = {
    updateData,
    redisHandler
};
