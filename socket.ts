import express = require('express');
import * as http from 'http';
import ws from "websocket"
const WebSocketServer = ws.server
import { createClient } from 'redis';
import { CHANNEL_TYPE } from './src/config/enums';
import { RedisConnection } from './redis';

export class SocketConnection extends RedisConnection {
    private subscriber:any = null;

    private connections = [];
    private channels = [
        CHANNEL_TYPE.PERMISSION_REFRESH,
        CHANNEL_TYPE.NOTIFICATION_REFRESH
    ]

    constructor() {
        super();
        this.connectToRedis();
    }

    private createServer() {
        const app = express();
        const httpServer = http.createServer(app);
        const websocket = new WebSocketServer({
            httpServer: httpServer,
        })
        httpServer.listen(4444);
        websocket.on("request", request=> {
            request.accept(null, request.origin);
            for(const connection of websocket.connections) {
                connection.on('error', (error) => console.error(error))
                connection.on("close", (code, description)=>console.warn(`ERR: ${code}, ${description}`))
                connection.on("message", (message: any) => {
                    console.log(`Client sent this message: ${message.utf8Data}`)
                })
            }
            this.connections = [...websocket.connections]
        })
    }

    private establishRedisConnection () {
        this.subscriber = createClient({
            socket: {
                host: 'localhost',
                port: 6379
            }
        });
        this.subscriber.connect();
        for(const channel of this.channels) {
            this.subscriber.subscribe(channel, message => {
                console.log(`Server received message in channel ${channel} msg: ${message}`);
                try {
                    this.connections.forEach(c => c.send(JSON.stringify({
                        type: channel,
                        message
                    })))  
                } catch(err) {
                    console.log("Error: " + err)
                }
            });
        }
    }

    connectToSocket() {
        this.establishRedisConnection();
        this.createServer();
    }

    public async publishToChannel(channelType: CHANNEL_TYPE, data: any) {
        try {
            await this.redisClient.publish(channelType, data)
        } catch (err) {
            console.error('Unable to publish: ', err)
        }
    }
}

const socketConnection = new SocketConnection();

export default socketConnection;
