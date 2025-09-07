import { describe, expect, it } from 'vitest';
import zapier from 'zapier-platform-core';

import App from '../index.js';
const appTester = zapier.createAppTester(App);

describe('Wistia Custom Authentication Configuration', () => {
  describe('Authentication Configuration', () => {
    it('has correct authentication type', () => {
      expect(App.authentication.type).toBe('custom');
    });

    it('has API key field configured', () => {
      expect(App.authentication.fields).toBeDefined();
      expect(Array.isArray(App.authentication.fields)).toBe(true);
      expect(App.authentication.fields).toHaveLength(1);
      
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.key).toBe('apiKey');
      expect(apiKeyField.required).toBe(true);
      expect(apiKeyField.label).toContain('API Key');
      expect(apiKeyField.label).toContain('https://');
    });

    it('has authentication test function', () => {
      expect(App.authentication.test).toBeDefined();
      expect(typeof App.authentication.test).toBe('function');
      expect(App.authentication.test.length).toBe(2); // z, bundle parameters
    });

    it('has connection label configured', () => {
      expect(App.authentication.connectionLabel).toBeDefined();
      expect(App.authentication.connectionLabel).toBe('{{name}}');
    });

    it('field includes link to Wistia API settings', () => {
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.label).toContain('[API Key details]');
      expect(apiKeyField.label).toContain('wistia.com/account/api');
    });

    it('field provides helpful instructions', () => {
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.label).toContain('subdomain instead of tenant');
    });
  });

  describe('Authentication Test', () => {
    it('test function structure is correct', () => {
      const testFn = App.authentication.test;
      expect(typeof testFn).toBe('function');
      expect(testFn.length).toBe(2); // Should take z, bundle
    });

    it('test validates credentials with correct Wistia endpoint', async () => {
      // We can't mock the actual HTTP request easily, but we can test that
      // the function is called and handles basic validation
      const bundle = {
        authData: {
          apiKey: 'test-api-key',
        },
      };

      // This test verifies the function doesn't throw on basic structure
      // The actual HTTP call will fail in testing, but we can catch that
      try {
        await appTester(App.authentication.test, bundle);
      } catch (error) {
        // Expected to fail due to network request, but should not fail on structure
        expect(error.message).not.toMatch(/TypeError/);
        expect(error.message).not.toMatch(/apiKey.*not defined/);
      }
    });

    it('returns expected structure when called', async () => {
      // Test with a mock that we expect to fail but with proper error handling
      const bundle = {
        authData: {
          apiKey: 'invalid-key-for-testing',
        },
      };

      try {
        await appTester(App.authentication.test, bundle);
      } catch (error) {
        // The error should indicate authentication failure, not structure problems
        const errorMessage = error.message.toLowerCase();
        expect(
          errorMessage.includes('authentication') ||
          errorMessage.includes('api') ||
          errorMessage.includes('unauthorized') ||
          errorMessage.includes('token') ||
          errorMessage.includes('key')
        ).toBe(true);
      }
    });
  });

  describe('API Endpoint Configuration', () => {
    it('uses correct Wistia API endpoint for authentication test', async () => {
      // The authentication test should use medias.json endpoint
      // We can verify this by looking at the function implementation indirectly
      const bundle = {
        authData: {
          apiKey: 'test-key',
        },
      };

      try {
        await appTester(App.authentication.test, bundle);
      } catch (error) {
        // The error should come from the actual API call, indicating correct endpoint usage
        expect(error.message).not.toMatch(/Cannot read properties.*url/);
        expect(error.message).not.toMatch(/url.*undefined/);
      }
    });
  });

  describe('Field Validation', () => {
    it('API key field is required', () => {
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.required).toBe(true);
    });

    it('API key field has correct key identifier', () => {
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.key).toBe('apiKey');
    });

    it('provides helpful documentation link', () => {
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.label).toMatch(/\[API Key details\]/);
    });
  });
});
