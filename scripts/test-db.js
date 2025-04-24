import pg from 'pg';

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Successfully connected to Neon PostgreSQL!');

        const result = await client.query('SELECT 1');
        console.log('Test query successful:', result.rows);
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
    } finally {
        await client.end();
    }
}

testConnection(); 