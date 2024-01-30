
import * as express from 'express';
import { Server } from '@overnightjs/core';
import logger from './config/logger';
import { Db } from './config/db';
import jwt_decode from 'jwt-decode';
import { Types } from 'mongoose';
import { User } from './models/user.model';
import sendResponse from './middlewares/send-response';
import constants from './config/constants';
import * as publicControllers from './controllers/public-controllers'
import { CODES } from './config/enums';
import redisConnection from '../redis';

const morgan = require('morgan')
const { expressjwt: jwt } = require("express-jwt");

class App extends Server {

    jwtEscapeUrls = [
        '/api/sai-akhil', 
        /^\/api\/auth\/.*/
    ];

    constructor() {
        super();
        this.corsPolicy();
        this.middleWare();
        Db.connect().then(() => {
            console.log('DB Connected');
        });
        this.initializeServer();
        this.startQueues();
    }

    initializeServer() {
        this.loadControllers();
        if (process.env.NODE_APP_INSTANCE == undefined) {
            //schedulecrons
        }
        if(process.env.NODE_APP_INSTANCE == '0') {
            //schedulecrons
        }
        this.listenToNodeCrashEvents();
    }

    startQueues() {

    }

    private corsPolicy() {
        express.Router()
        this.app.use((req, res, next) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, user, authorization");
            next();
        });
    }

    private middleWare() {
        this.app.enable('trust proxy');
        this.app.use(express.json({ limit: '1024mb' }));
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.static(constants.PUBLIC_ASSETS_PATH));

        if (process.env.NODE_ENV && process.env.NODE_ENV !== 'local') {
            this.app.use(morgan('combined', { logger }));
        } else {
            this.app.use(morgan('dev', { logger }));
        }
        this.app.use(jwt({ 
            secret: constants.jwtSecret,
            algorithms: ["HS256"],
        }).unless({
            path: this.jwtEscapeUrls
        }));
        this.app.use((err, req, res, next) => {
            if (err.status === 401) {
                sendResponse(res, false, '', null, false, CODES.TOKEN_EXPIRED);
            } else {
                res.status(err.status || 500);
                res.json({
                    errors: {
                        message: err.message,
                        error: {},
                    },
                });
            }

        });
        this.app.use(async (req, res, next) => {
            if (req.headers.authorization){
                const userData = jwt_decode(req.headers.authorization);
                if (userData) {
                    const userId = new Types.ObjectId((userData as any).user);
                    const userDoc = await User.findById(userId);
                    if (userDoc?.active) {
                        next();
                    } else {
                        return sendResponse(res, false, 'User Inactive', null, false, CODES.REFRESH_TOKEN_EXPIRED);
                    }
                }
            } else {
                next();
            }
        });
    }

    private loadControllers() {
        const controllerInstances = [];
        const allControllers = [
            { name: 'Public', controller: publicControllers },
        ]
        for(const { name, controller } of allControllers) {
            for (const controllerName of Object.keys(controller)) {
                const controllerClass = (controller as any)[controllerName];
                if (typeof controllerClass === 'function') {
                    controllerInstances.push(new controllerClass());
                }
            }
            console.log(`Loaded - ${name} Controller!`);
        }
        super.addControllers(controllerInstances, null);
    }

    exitHandler = (options, exitCode) => {
        if (options.cleanup) logger.info('clean');
        if (exitCode || exitCode === 0) logger.info(exitCode);
        if (options.exit) process.exit();
    }

    listenToNodeCrashEvents() {
        function exitRouter(options, exitCode) {
            if (options.exit) process.exit();
        }

        const others = [`SIGINT`, `uncaughtException`, `SIGTERM`]
        others.forEach((eventType: any) => {
            process.on(eventType, exitRouter.bind(null, { exit: true }));
        })

        function exitHandler(exitCode) {
            //only sync code should be written here
        }
        process.on('exit', exitHandler)
    }

    public async start() {
        this.app.listen(constants.port, () => {
            logger.info("Server ready at port: " + constants.port);
        })
        await redisConnection.connectToRedis()
    }
}

export default App;