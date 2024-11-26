import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const pool = new Pool({
	user: process.env.PG_USER || 'postgres',
	password: process.env.PG_PASSWORD,
	host: process.env.PG_HOST || 'localhost',
	port: Number(process.env.PG_PORT) || 5432,
	database: process.env.PG_DATABASE
});

let isInitialized = false;

const initializeDatabase = async (): Promise<void> => {
	console.log('POOL:', pool);
	const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            first_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role VARCHAR(50) DEFAULT 'user',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

	try {
		console.log('POOL:', pool);
		await pool.query(createUsersTableQuery);
		console.log('Users table created or already exists.');

		isInitialized = true;
	} catch (error) {
		console.error('Error initializing database:', error);
		throw error;
	}
};

export const getDatabaseConnection = async (): Promise<Pool> => {
	if (!isInitialized) {
		await initializeDatabase();
	}
	return pool;
};

process.on('beforeExit', async () => {
	try {
		await pool.end();
		console.log('Database connection pool has been closed.');
	} catch (error) {
		console.error('Error closing database connection pool:', error);
	}
});
