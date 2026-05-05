import * as Joi from 'joi';

export const envValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().min(16).required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  PORT: Joi.number().default(3000),
  FRONTEND_URL: Joi.string().required(),
  UPLOAD_DIR: Joi.string().default('./uploads'),

  JWT_REFRESH_SECRET: Joi.string().min(16).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
  NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),

  STORAGE_PROVIDER: Joi.string().valid('disk', 'cloudinary').default('disk'),
  CLOUDINARY_CLOUD_NAME: Joi.when('STORAGE_PROVIDER', {
    is: 'cloudinary',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  CLOUDINARY_API_KEY: Joi.when('STORAGE_PROVIDER', {
    is: 'cloudinary',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),
  CLOUDINARY_API_SECRET: Joi.when('STORAGE_PROVIDER', {
    is: 'cloudinary',
    then: Joi.string().required(),
    otherwise: Joi.string().optional(),
  }),

});
