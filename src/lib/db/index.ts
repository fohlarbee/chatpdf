import {neon} from '@neondatabase/serverless';
import {drizzle} from 'drizzle-orm/neon-http'
// neonConfig.fetchConnectionCache = true;

if (!process.env.DATABASE_URL)
    throw new Error('DatabaseUrl not found');
const sql = neon(process.env.DATABASE_URL, {
    fetchOptions: { timeout: 20000 }, // 20 seconds timeout
});

export const db = drizzle(sql);
// if (!!db) console.log('DB connected successfully!');