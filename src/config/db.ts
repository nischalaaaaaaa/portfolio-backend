import * as mongoose from 'mongoose';
import config from './constants';
import logger from './logger';

export class Db {

    public static connect() {
        let dbUrl = 'mongodb://' + config.dbhost + '/' + config.dbname;
        if (config.dbusername && config.dbpassword && config.dbsource) {
            dbUrl = 'mongodb://' + config.dbusername + ':' +
                config.dbpassword + '@' + config.dbhost +
                '/' + config.dbname + '?authSource=' + config.dbsource
        }

        if(process.env.NODE_ENV == 'prod') {
            dbUrl = process.env.dbUrl
        }

        console.log(process.env.NODE_ENV)

        return new Promise(async resolve => {
            try {
                mongoose.set('strictQuery', true);
                await mongoose.connect(dbUrl);
                resolve(1);
            } catch (err) {
                logger.debug('Error while db connection ' + JSON.stringify(err));
            }

        });
    }
}