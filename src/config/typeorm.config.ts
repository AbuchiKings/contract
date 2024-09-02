import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

import 'reflect-metadata';

import { config as dotenvConfig } from 'dotenv';

// DO NOT CHANGE THE SNAKE NAMING STRATEGY IMPORT TO AN ALIAS
import { SnakeNamingStrategy } from '../shared/snake-naming-strategy';

// We don't have access to the @nestjs/config module when running the
// migrations, so we need to load the environment variables manually.
dotenvConfig();

export const dataSource = {
  database: process.env.POSTGRES_DB,
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  autoLoadEntities: true,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  type: process.env.DATABASE_TYPE as any,
  logging: process.env.DATABASE_LOGGING === 'true',
  migrationsTransactionMode: 'each',
  entities: ['dist/**/*.entity.{js,ts}'],
  namingStrategy: new SnakeNamingStrategy(),
  migrationsRun: process.env.NODE_ENV === 'test',
  dropSchema: process.env.NODE_ENV === 'test',
  migrationsTableName: 'migrations',
  migrations: ['dist/migrations/**/*{.ts,.js}'],
  // Needed for typeorm-extension
  //seeds: ['dist/database/seeds/**/*.seed.{js,ts}'],
  //seeds: ['dist/database/seeds/permission/**/*.seed.{js,ts}'],
} satisfies TypeOrmModuleOptions & SeederOptions;
export default registerAs('typeorm', () => dataSource);
export const connectionSource = new DataSource(dataSource as DataSourceOptions);
