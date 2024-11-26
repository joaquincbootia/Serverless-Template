import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
require('dotenv').config();
import { ValidationError } from '../errors/ValidationError';
import { CustomError } from '../errors/CustomError';
import logger from '../errors/logger';
import { usersSchema } from '../validations/usersValidation';
import { insertUser, User } from '../models/user';

export const UserSignup: APIGatewayProxyHandler = async (event) => {
	try {
		const user: User = JSON.parse(event.body || '{}');

		const { error } = usersSchema.validate(user);
		if (error) {
			logger.warn(`Validation failed: ${error.details[0].message}`);
			throw new ValidationError(error.details[0].message);
		}

		const newUserEntry = await insertUser(user);

		logger.info(`User added successfully`);

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({ user: newUserEntry })
		};
	} catch (error) {
		logger.error('Error adding user', { error });

		const statusCode = error instanceof CustomError ? error.statusCode : 500;
		const message = error instanceof CustomError ? error.message : 'Internal server error';

		return {
			statusCode,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Credentials': true
			},
			body: JSON.stringify({ message })
		};
	}
};
