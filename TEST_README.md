# FlashCardz Testing Guide

This document outlines how to run tests for the FlashCardz application.

## Prerequisites

- Node.js v14+ and npm
- All dependencies installed (`npm run install:all`)

## Test Types

The project includes the following types of tests:

1. **Backend Unit Tests**: Tests for server-side logic using Jest
2. **Frontend Unit Tests**: Tests for Angular components using Karma/Jasmine
3. **E2E Tests**: End-to-end tests using Cypress

## Running Tests

### Backend Tests

```bash
# Run all backend tests
npm run test:server

# Run tests in watch mode
cd server && npm run test:watch

# Run tests with coverage
cd server && npm run test:coverage
```

### Frontend Tests

```bash
# Run all frontend tests
npm run test:client

# Run tests directly
cd client && npm test
```

### E2E Tests

```bash
# Run E2E tests in headless mode
npm run test:e2e

# Open Cypress test runner
cd client && npm run e2e
```

### Run All Tests

```bash
# Run all tests (backend, frontend, and E2E)
npm run test:all
```

## Test Structure

### Backend Tests

- Located in `server/src/__tests__`
- Follow Jest naming convention: `*.test.ts`

### Frontend Tests

- Located alongside the components they test
- Follow Angular's `.spec.ts` convention

### E2E Tests

- Located in `client/cypress/e2e`
- Use the `.cy.ts` file extension

## Writing Tests

### Backend Tests

```typescript
// Example backend test
import request from 'supertest';
import app from '../app'; // Import your Express app

describe('API Endpoint', () => {
  it('should return expected data', async () => {
    const response = await request(app).get('/api/endpoint');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
  });
});
```

### Frontend Unit Tests

```typescript
// Example Angular component test
describe('ComponentName', () => {
  let component: ComponentName;
  let fixture: ComponentFixture<ComponentName>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComponentName]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComponentName);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

### E2E Tests

```typescript
// Example Cypress E2E test
describe('Feature', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should perform expected action', () => {
    cy.get('[data-test=element]').click();
    cy.url().should('include', '/expected-route');
  });
});
```

## Continuous Integration

Tests are automatically run on pull requests and merges to the main branch using CI/CD pipelines.

## Best Practices

1. **Test Isolation**: Each test should run independently
2. **Descriptive Names**: Use clear, descriptive test names
3. **Test Coverage**: Aim for high test coverage, especially for critical paths
4. **Mocking**: Use mocks for external dependencies
5. **Regular Updates**: Keep tests updated as code changes 