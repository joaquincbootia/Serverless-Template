import Joi from 'joi';

export const usersSchema = Joi.object({
	firstName: Joi.string().max(100).required(),
	lastName: Joi.string().max(100).required(),
	email: Joi.string().email().max(150).required(),
	password: Joi.string().min(8).max(255).required(),
	role: Joi.string().valid('user', 'admin').optional()
});
