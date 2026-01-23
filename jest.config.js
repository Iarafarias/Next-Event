const baseProjectConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],

  // Global test timeout
  testTimeout: 10000,

  // Transform TypeScript (and the few JS deps we allow)
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.test.json' }],
  },

  // Transformando o Faker (ESM) para funcionar no Jest
  transformIgnorePatterns: ['node_modules/(?!(@faker-js)/)'],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = {
  ...baseProjectConfig,
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/main.ts',
    '!src/**/*Config.ts',
    '!src/infrastructure/database/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  projects: [
    {
      ...baseProjectConfig,
      displayName: 'unit',
      testMatch: [
        '<rootDir>/tests/unit/**/*.spec.ts',
        '<rootDir>/tests/application/**/*.spec.ts', // Adicionado
        '<rootDir>/tests/prestation/**/*.spec.ts'   // Adicionado
      ],
    },
    {
      ...baseProjectConfig,
      displayName: 'integration', 
      testMatch: ['<rootDir>/tests/integration/**/*.spec.ts'],
    }
  ]
};