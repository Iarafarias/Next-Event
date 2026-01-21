/// <reference types="jest" />

import { PrismaClient } from '@prisma/client';
import { beforeEach, jest, beforeAll, afterAll} from '@jest/globals';


// Global setup for Jest tests
declare global {
  var __PRISMA__: PrismaClient;
}

beforeAll(async () => {
  // Initialize test database connection
  global.__PRISMA__ = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_TEST_URL || process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/nextevent_test"
      }
    }
  });
  
  // Connect to database
  await global.__PRISMA__.$connect();
});

afterAll(async () => {
  // Clean up database connection
  await global.__PRISMA__.$disconnect();
});

beforeEach(async () => {
  // Clean database before each test (optional - can be per test)
  // Uncomment below for database cleanup between tests
  /*
  await global.__PRISMA__.$transaction([
    global.__PRISMA__.formAcompanhamento.deleteMany(),
    global.__PRISMA__.avaliacaoTutoria.deleteMany(),
    global.__PRISMA__.alocarTutorAluno.deleteMany(),
    global.__PRISMA__.aluno.deleteMany(),
    global.__PRISMA__.curso.deleteMany(),
    global.__PRISMA__.usuario.deleteMany(),
  ]);
  */
});

// Mock console methods during tests to reduce noise
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};