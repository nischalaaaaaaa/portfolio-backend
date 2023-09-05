class Config {

    //general
    private readonly port = process.env.PORT || 3000;
    private readonly socketPort = process.env.socketPort || 4444;
  
    //security
    private readonly jwtSecret = process.env.jwtSecret || 'jwt-secret';
    private readonly tokenExpireTime = process.env.tokenExpireTime || '5h';
    private readonly saltRounds = process.env.saltRounds || 2;
  
    private readonly refreshJwtSecret = process.env.refreshJwtSecret || 'jwt-refresh-secret';
    private readonly refreshTokenExpireTime = process.env.refreshTokenExpireTime || '1d';
  
    //db
    private readonly dbprotocol = process.env.dbprotocol || 'mongodb';
    private readonly dbhost = process.env.dbhost || 'localhost';
    private readonly dbusername = process.env.dbusername || '';
    private readonly dbpassword = process.env.dbpassword || '';
    private readonly dbname = process.env.dbname || 'sai-akhil';
    private readonly dbsource = process.env.dbsource || 'admin';
  
    private readonly REDIS_PORT = process.env.REDIS_PORT || 6379;
  
    private readonly REDIS_PASSWORD = process.env.REDIS_PASSWORD || '';
    private readonly REDIS_HOST = process.env.REDIS_HOST || 'localhost';

    private readonly PUBLIC_ASSETS_PATH = process.env.PUBLIC_ASSETS_PATH + '/public'
  
    public get config(): any {
      return this;
    }
  
    private readonly S3_DEFAULT_PUBLIC_BUCKET = process.env.S3_DEFAULT_PUBLIC_BUCKET || '';
    private readonly S3_DEFAULT_PRIVATE_BUCKET = process.env.S3_DEFAULT_PRIVATE_BUCKET || '';
}
export default new Config().config;
  