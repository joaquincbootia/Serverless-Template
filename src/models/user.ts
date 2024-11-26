import { Pool } from 'pg';
import { getDatabaseConnection } from '../db';
import logger from '../errors/logger';
import { InternalServerError } from '../errors/CustomError';

export class User {
	declare id: string;
	declare firstName: string;
	declare lastName: string;
	declare email: string;
	declare password: string;
	declare role: string;
	declare createdAt: string;
	declare updatedAt: string;
}

export const insertUser = async (user: Partial<User>): Promise<User> => {
	const pool: Pool = await getDatabaseConnection();
	console.log('POOL::', pool);

	try {
		const insertQuery = `
            INSERT INTO users (
                first_name, last_name, email, password, role, created_at, updated_at
            ) VALUES (
                $1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
            ) RETURNING id, first_name as "firstName", last_name as "lastName", email, role, created_at as "createdAt", updated_at as "updatedAt";
        `;

		const result = await pool.query(insertQuery, [user.firstName, user.lastName, user.email, user.password, user.role || 'user']);

		logger.info(`User inserted successfully: ${result.rows[0].email}`);
		return result.rows[0] as User;
	} catch (error) {
		logger.error('Error inserting user:', error);
		throw new InternalServerError('Failed to insert user');
	}
};
