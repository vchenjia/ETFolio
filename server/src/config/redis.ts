import { Redis } from 'ioredis';

let client: Redis | undefined;

export function getRedis(): Redis {
    if (!client) {
        const redisUrl = process.env.REDIS_URL;
        if (!redisUrl) {
            throw new Error('REDIS_URL is not defined in environment variables');
        }
        client = new Redis(redisUrl);
        client.on('connect', () =>
            console.log('Redis connected'));
        client.on('error', (err) =>
            console.error('Redis connection error:', err));
    }
    return client;
}