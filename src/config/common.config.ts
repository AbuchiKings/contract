import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  // Always default to production, so the strictest settings are used by default
  env: process.env.NODE_ENV || 'production',
  port: parseInt(process.env.APP_PORT, 10) || 4000,
}));
