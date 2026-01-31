import 'dotenv/config';

const config = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'lfcs_user',
      password: process.env.DB_PASSWORD || 'lfcs_password',
      database: process.env.DB_NAME || 'lfcs_platform'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: '../db/seeds'
    }
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      directory: '../db/migrations',
      tableName: 'knex_migrations'
    },
    seeds: {
      directory: '../db/seeds'
    }
  }
};

export default config;
