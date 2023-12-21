require('dotenv').config();
const socketIO = require('socket.io');

let io;

function initializeSocket(server) {
    io = socketIO(server, {
        cors: {
            origin: [process.env.SOCKET_ORIGIN || 'http://localhost:3000']
        }
    });
    return io;
}

function getIO() {
    if (!io) {
        throw new Error('Socket.IO not initialized');
    }
    return io;
}

module.exports = {
    initializeSocket,
    getIO,
};
