import 'reflect-metadata';

import { DataSource } from 'typeorm';

declare global {
  // eslint-disable-next-line no-var
  var _pgConnection: DataSource | undefined;
}

const pgConnection =
  global._pgConnection ||
  new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    database: 'strutio-database',
    username: 'root',
    password: 'my-password',
    synchronize: true,
    logging: true,
    entities: ['./entities/**/*.ts'],
    migrations: [],
    subscribers: [],
  });

if (!global._pgConnection) {
  global._pgConnection = pgConnection;
}

export const getDBConnection = async (): Promise<DataSource> => {
  if (!pgConnection.isInitialized) {
    await pgConnection.initialize();
  }
  return pgConnection;
};
