import 'reflect-metadata';
import { initializeDatabase, DBDataSource } from '@/database';
import { runSeed } from '@/seed';

beforeAll(async () => {
  await initializeDatabase();
  await runSeed();
});

afterAll(async () => {
  if (DBDataSource.isInitialized) {
    await DBDataSource.destroy();
  }
});

beforeEach(() => {
  jest.clearAllMocks();
});

global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
