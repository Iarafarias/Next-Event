module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/tests'], 
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  
  // Garantindo que o ts-jest processe JS vindo do node_modules quando necessário
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { useESM: true }],
  },

  // Transformando o Faker v8 de ESM para CJS
  transformIgnorePatterns: [
    'node_modules/(?!(@faker-js)/)'
  ],

  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};