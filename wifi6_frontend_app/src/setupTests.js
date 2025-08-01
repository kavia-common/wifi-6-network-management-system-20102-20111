import '@testing-library/jest-dom';

// Setup MSW worker for all tests (API "fetch" mocked)
import { worker } from './mocks/browser';

beforeAll(() => worker.start({ onUnhandledRequest: 'warn' }));
afterEach(() => worker.resetHandlers());
afterAll(() => worker.stop());
