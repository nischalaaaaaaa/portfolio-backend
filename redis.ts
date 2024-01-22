import { createClient, RedisClientType, RedisFunctions, RedisScripts, RedisModules } from 'redis';
import logger from './src/config/logger';

const redisResult= 'OK';

class RedisConnection {
    private redisClient: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
    constructor () { }

    public async connectToRedis() {
        try {
            const client = await createClient({url: 'redis://redis:6379'});
            client.on('error', err => logger.error(err));
            client.on('connect', () => {
                logger.info('Redis connected')
                this.redisClient = client;
            })
            await client.connect();
        } catch (error) {
            logger.error(`Error while connecting: ${error}`);
        }
        
    }  
    
    public async setKeyWithExpiry(key: string, expirySeconds: number, value: string) {
        try {    
            if(!this.redisClient)  {
                logger.info(`Connection with redis was ended and reconnecting again`);
                this.connectToRedis();
            }
            if(this.redisClient) {
                const result = await this.redisClient.setEx(key, expirySeconds, value);
                return result == redisResult ? true : false;
            }
        } catch(error) {
            throw Error('something went wrong while setting value :'+ error);
        }
    }

    public async setkey(key: string, value: string) {
        try {
            if(!this.redisClient)  {
                logger.info(`Connection with redis was ended and reconnecting again`);
                this.connectToRedis();
            }

            if(this.redisClient) {
                const result = await this.redisClient.set(key, value);
                return result == redisResult ? true : false;
            }
        } catch(error) {
            throw Error('something went wrong while setting value :'+ error);
        }
    }

    public async getKeyValue(key: string) {
        try {
            if(!this.redisClient) {
                logger.info(`Connection with redis was ended and reconnecting again`);
                this.connectToRedis();
            }

            if(this.redisClient) {
                return await this.redisClient.get(key);
            }
        } catch(error) {
            throw Error('something went wrong while getting value :'+ error);
        }
    }

    public async setKeyList(key: string, value: string){
        try {
            if(!this.redisClient) {
                logger.info(`Connection with redis was ended and reconnecting again`);
                this.connectToRedis();
            }

            if(this.redisClient) {
                return await this.redisClient.LPUSH(key, value);
            }
        } catch(error) {
            throw Error('something went wrong while getting value :'+ error);
        }
    }

    public async clearKeyList(key: string) {
        try {
            if(!this.redisClient) {
                logger.info(`Connection with redis was ended and reconnecting again`);
                this.connectToRedis();
            }

            if(this.redisClient) {
                let length = await this.redisClient.lLen(key);
                while(length--){
                     await this.redisClient.LPOP(key);
                }
                return
            }
        } catch(error) {
            throw Error('something went wrong while getting value :'+ error);
        }
    }
    
    public async getKeyList(key: string) {
        try {
            if(!this.redisClient) {
                logger.info(`Connection with redis was ended and reconnecting again`);
                this.connectToRedis();
            }

            if(this.redisClient) {
                return await this.redisClient.lRange(key,0,-1);
            }
        } catch(error) {
            throw Error('something went wrong while getting value :'+ error);
        }
    }


}

const redisConnection = new RedisConnection();

export default redisConnection;