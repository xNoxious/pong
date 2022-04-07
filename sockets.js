let readyPlayerCount = 0;

function listen(io) {
    io.on('connection', (socket) => {
        console.log('a user connected', socket.id);
        let room;

        socket.on('ready', () => {
            room = 'room' + Math.floor(readyPlayerCount / 2);
            socket.join(room);

            console.log(`Player ${socket.id} in room ${room} is ready: `);

            readyPlayerCount++;

            if (readyPlayerCount % 2 === 0) {
                // set second player as referee (thus pass socket.id)
                io.in(room).emit('startGame', socket.id);
            }
        });

        // io.emit sends event to all clients (even the sender).
        // socket.broadcast.emit sends event to all except client that sent it.

        socket.on('paddleMove', (paddleData) => {
            socket.to(room).emit('paddleMove', paddleData);
        });

        socket.on('ballMove', (ballData) => {
            socket.to(room).emit('ballMove', ballData);
        });

        socket.on('disconnect', (reason) => {
            console.log(`Client ${socket.id} disconnected: ${reason}`);
            socket.leave(room);
        });
    });
}

module.exports = {
    listen
}