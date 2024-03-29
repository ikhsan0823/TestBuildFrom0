const { Users } = require('../models/users.js');

module.exports = (io) => {
    io.on('connection', (socket) => {
        socket.on('login', async (username) => {
            const user = await Users.findOneAndUpdate({ username }, { online: true });
            const onlineQuery = Users.find({ online: true });
            const onlineUsers = await onlineQuery.countDocuments();
            if (user && user.online) {
                io.emit('userStatus', { username, online: true });
                io.emit('updateUserCount', onlineUsers);
            }
        });

        socket.on('chat', (data) => {
            io.emit('chat', { message: data.message, username: data.username });
        });

        socket.on('logout', async (username) => {
            const user = await Users.findByIdAndUpdate({ username }, { online: false }, { new: true});
            const onlineQuery = Users.find({ online: true });
            const onlineUsers = await onlineQuery.countDocuments();
            if (user && user.online) {
                io.emit('userStatus', { username, online: false });
                io.emit('updateUserCount', onlineUsers);
            }
        });

        socket.on('disconnect', async () => {
            try {
                const username = socket.handshake.query.username;
                const user = await Users.findOneAndUpdate({ username }, {online: false }, { new: true });
                if (user && user.online) {
                    io.emit('userStatus', { username, online: false });
                    io.emit('updateUserCount', onlineUsers);
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
}