import pg from 'pg';

const { Client } = pg;

const client = new Client({
    user: 'postgres',
    host: 'db.waoximlrzpskplqduodm.supabase.co',
    database: 'postgres',
    password: 'Osisamkay007!',
    port: 5432,
});

async function testConnection() {
    try {
        await client.connect();
        console.log('Successfully connected to PostgreSQL!');

        const result = await client.query('SELECT 1');
        console.log('Test query successful:', result.rows);
    } catch (error) {
        console.error('PostgreSQL connection error:', error);
    } finally {
        await client.end();
    }
}

testConnection(); 