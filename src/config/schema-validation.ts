import * as Joi from 'joi';

export default {
  envFilePath: [
    '.local.env',
    '.development.env',
    '.env',
  ],
  cache: true,
  isGlobal: true,
  validationSchema: Joi.object({
    // common
    NODE_ENV: Joi.string().valid('local', 'development', 'production'),
    APP_PORT: Joi.number().integer().required(),

    // typeorm
    POSTGRES_DB: Joi.string().required(),
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().integer().default(5432),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    DATABASE_TYPE: Joi.string().required(),
    DATABASE_LOGGING: Joi.boolean().default(false),
    DATABASE_SYNC: Joi.boolean().when('NODE_ENV', {
      is: Joi.string().equal('development'),
      then: Joi.boolean().default(true),
      otherwise: Joi.boolean().default(false),
    }),
    validationOptions: {
      allowUnknown: true,
      abortEarly: true,
    },
  })
};
