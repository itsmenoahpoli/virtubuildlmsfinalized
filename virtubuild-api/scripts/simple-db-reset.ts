import { Client } from 'pg';
import { SETTINGS } from "@/configs";

async function simpleDbReset() {
    console.log('🔄 Starting simple database reset...');

    const client = new Client({
        host: SETTINGS.APP_DB_HOST,
        port: Number(SETTINGS.APP_DB_PORT),
        user: SETTINGS.APP_DB_USERNAME,
        password: SETTINGS.APP_DB_PASSWORD,
        database: 'postgres', // Connect to default postgres database to drop/recreate
    });

    try {
        await client.connect();
        console.log('✅ Connected to PostgreSQL');

        // Terminate existing connections to the target database
        await client.query(`
            SELECT pg_terminate_backend(pid)
            FROM pg_stat_activity
            WHERE datname = $1 AND pid <> pg_backend_pid()
        `, [SETTINGS.APP_DB_DATABASE]);

        // Drop the database if it exists
        console.log('🗑️ Dropping database...');
        await client.query(`DROP DATABASE IF EXISTS "${SETTINGS.APP_DB_DATABASE}";`);

        // Create the database
        console.log('🏗️ Creating database...');
        await client.query(`CREATE DATABASE "${SETTINGS.APP_DB_DATABASE}";`);

        console.log('✅ Database reset completed successfully!');
        
    } catch (error) {
        console.error('❌ Error during database reset:', error);
        process.exit(1);
    } finally {
        await client.end();
    }
}

// Run the script
simpleDbReset();
