const winston = require('winston');

class Logger {
    private readonly options = {
        console: {
            level: 'debug',
            handleExceptions: true,
            format: winston.format.simple(),
            colorize: true,
        },
    }

    public get logger(): any {
        let logger = new winston.createLogger({
            transports: [
              new winston.transports.Console(this.options.console),
            ],
            format: winston.format.json(),
            exitOnError: false,
          })
          
        logger.stream = {
            write: function(message, encoding) {
                logger.info(message);
            },
        };
        return logger;
    }
}

export default new Logger().logger;