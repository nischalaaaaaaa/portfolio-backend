import express = require('express');
import * as http from 'http';
import { Server } from 'socket.io';
const { createClient } = require("redis");
const { createAdapter } = require("@socket.io/redis-adapter");
import logger from './src/config/logger';
import redisConnection from './redis';

class IoSocket {

    private io;

    constructor() {
        redisConnection
        setTimeout(()=>this.connectToSocket(), 2000)
    }

    connectToSocket() {
        let app = express();
        let httpServer = http.createServer(app);
        this.io = new Server(httpServer);

        const pubClient = createClient({ url: "redis://localhost:6379" });
        const subClient = pubClient.duplicate();

        this.io.adapter(createAdapter(pubClient, subClient));
        this.io.listen(4444);
        this.io.use((socket, next) => {
            const hostAddress = 'http://' + socket.handshake.headers.host.split(":").shift() + ":" + 3000;
            console.log(hostAddress)
            next();
        });

        this.io.on('connection', (socket) => {
            logger.info(this.io.engine.clientsCount + ' sockets connected');
            if (socket?.userId) {
                socket.join(socket?.userId);//each user has a room and all logins will be in the same room with userId
                logger.info(`Socket==>___${socket?.userId} has joined___`);
            }
            // config.io.emit('tx', 'msg');
            socket.on('disconnect', () => {
                if (socket?.userId) {
                    socket.leave(socket?.userId);
                    logger.info(`...${socket?.userId} has left...`)
                }
                logger.info(this.io.engine.clientsCount + " sockets connected'");
            });

        });
    }

    public getSocketInstance() {
        return this.io;
    }

    public emitData(eventName, data) {
        this.io.emit(eventName, data);
    }

    public emitToRooms = (rooms: string[], event, data: any) => {
        for (let i = 0; i < rooms?.length; i++) {
            this.io.to(rooms[i]).emit(event, data);
        }
    }
}

const socket = new IoSocket();

export default socket;