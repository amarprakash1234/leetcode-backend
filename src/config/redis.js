const { createClient } = require("redis");

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-19183.c301.ap-south-1-1.ec2.cloud.redislabs.com',
        port: 19183
    }
});

module.exports = redisClient;




