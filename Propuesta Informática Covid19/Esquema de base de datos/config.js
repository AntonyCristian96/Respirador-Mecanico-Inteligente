exports.databaseConfig = {
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    timezone: process.env.DATABASE_TIMEZONE,
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    dialect: process.env.DATABASE_DIALECT,
    benchmark: true,
    pool: {
        acquire: parseInt(process.env.DATABASE_ACQUIRE_TIME),
        max: parseInt(process.env.DATABASE_MAX_CONNECTION),
        min: parseInt(process.env.DATABASE_MIN_CONNECTION),
        idle: parseInt(process.env.DATABASE_IDLE_TIME),
        evict: parseInt(process.env.DATABASE_EVICT_TIME)
    }
};