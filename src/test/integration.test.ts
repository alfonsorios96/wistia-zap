import { describe, expect, it } from 'vitest';
import zapier from 'zapier-platform-core';

import App from '../index.js';

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Wistia Integration Tests', () => {
  describe('App Configuration', () => {
    it('has correct app structure', () => {
      expect(App).toBeDefined();
      expect(App.version).toBeDefined();
      expect(App.platformVersion).toBeDefined();
    });

    it('has custom authentication configured', () => {
      expect(App.authentication).toBeDefined();
      expect(App.authentication.type).toBe('custom');
      expect(App.authentication.fields).toBeDefined();
      expect(App.authentication.fields).toHaveLength(1);
      expect(App.authentication.fields[0].key).toBe('apiKey');
    });

    it('has authentication test function', () => {
      expect(App.authentication.test).toBeDefined();
      expect(typeof App.authentication.test).toBe('function');
    });

    it('has connection label configured', () => {
      expect(App.authentication.connectionLabel).toBeDefined();
      expect(App.authentication.connectionLabel).toBe('{{name}}');
    });
  });

  describe('Triggers', () => {
    it('has both triggers configured', () => {
      expect(App.triggers).toBeDefined();
      expect(App.triggers.publish).toBeDefined();
      expect(App.triggers.projects).toBeDefined();
    });

    it('publish trigger has correct structure', () => {
      const trigger = App.triggers.publish;
      expect(trigger.key).toBe('publish');
      expect(trigger.noun).toBe('Publish');
      expect(trigger.display).toBeDefined();
      expect(trigger.display.label).toBe('New Video in Project');
      expect(trigger.operation).toBeDefined();
      expect(trigger.operation.perform).toBeDefined();
    });

    it('projects trigger has correct structure', () => {
      const trigger = App.triggers.projects;
      expect(trigger.key).toBe('projects');
      expect(trigger.noun).toBe('Projects');
      expect(trigger.display).toBeDefined();
      expect(trigger.display.label).toBe('List Projects');
      expect(trigger.operation).toBeDefined();
      expect(trigger.operation.perform).toBeDefined();
    });

    it('triggers have correct operation types', () => {
      expect(App.triggers.publish.operation.type).toBe('polling');
      expect(App.triggers.projects.operation.type).toBe('polling');
    });
  });

  describe('Creates', () => {
    it('has upload create configured', () => {
      expect(App.creates).toBeDefined();
      expect(App.creates.upload).toBeDefined();
    });

    it('upload create has correct structure', () => {
      const upload = App.creates.upload;
      expect(upload.key).toBe('upload');
      expect(upload.noun).toBe('Project');
      expect(upload.display).toBeDefined();
      expect(upload.display.label).toBe('Create New Project');
      expect(upload.operation).toBeDefined();
      expect(upload.operation.perform).toBeDefined();
    });

    it('upload input fields are correctly configured', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      expect(inputFields).toHaveLength(3);
      
      const nameField = inputFields.find(f => f.key === 'name');
      expect(nameField).toBeDefined();
      expect(nameField.required).toBe(true);
      expect(nameField.type).toBe('string');
      
      const emailField = inputFields.find(f => f.key === 'adminEmail');
      expect(emailField).toBeDefined();
      expect(emailField.required).toBe(false);
      expect(emailField.type).toBe('string');
      
      const publicField = inputFields.find(f => f.key === 'public');
      expect(publicField).toBeDefined();
      expect(publicField.required).toBe(false);
      expect(publicField.type).toBe('boolean');
    });
  });

  describe('Dynamic Dropdown Integration', () => {
    it('publish trigger uses projects trigger for dropdown', () => {
      const publishInputFields = App.triggers.publish.operation.inputFields;
      const projectField = publishInputFields.find(f => f.key === 'project_id');
      
      expect(projectField).toBeDefined();
      expect(projectField.dynamic).toBe('projects.id');
      expect(projectField.required).toBe(true);
    });

    it('projects trigger is configured for dropdown use', () => {
      const projectsInputFields = App.triggers.projects.operation.inputFields;
      expect(projectsInputFields).toHaveLength(0); // No input fields for internal use
    });
  });

  describe('Output Fields', () => {
    it('publish trigger has proper output fields', () => {
      const outputFields = App.triggers.publish.operation.outputFields;
      expect(outputFields).toBeDefined();
      expect(Array.isArray(outputFields)).toBe(true);
      expect(outputFields.length).toBeGreaterThan(0);
      
      const expectedFields = ['id', 'name', 'duration', 'description'];
      expectedFields.forEach(fieldKey => {
        const field = outputFields.find(f => f.key === fieldKey);
        expect(field).toBeDefined();
        expect(field.label).toBeDefined();
      });
    });

    it('projects trigger has proper output fields', () => {
      const outputFields = App.triggers.projects.operation.outputFields;
      expect(outputFields).toBeDefined();
      expect(Array.isArray(outputFields)).toBe(true);
      expect(outputFields.length).toBeGreaterThan(0);
      
      const expectedFields = ['id', 'name'];
      expectedFields.forEach(fieldKey => {
        const field = outputFields.find(f => f.key === fieldKey);
        expect(field).toBeDefined();
        expect(field.label).toBeDefined();
      });
    });

    it('upload create has proper output fields', () => {
      const outputFields = App.creates.upload.operation.outputFields;
      expect(outputFields).toBeDefined();
      expect(Array.isArray(outputFields)).toBe(true);
      
      const expectedFields = ['id', 'hashedId', 'name', 'created', 'updated'];
      expectedFields.forEach(fieldKey => {
        const field = outputFields.find(f => f.key === fieldKey);
        expect(field).toBeDefined();
        expect(field.label).toBeDefined();
      });
    });
  });

  describe('Sample Data', () => {
    it('publish trigger has valid sample', () => {
      const sample = App.triggers.publish.operation.sample;
      expect(sample).toBeDefined();
      expect(sample.id).toBeDefined();
      expect(sample.hashed_id).toBeDefined();
      expect(sample.name).toBeDefined();
      expect(typeof sample.duration).toBe('number');
      expect(typeof sample.id).toBe('number');
      expect(sample.status).toBe('ready');
    });

    it('projects trigger has valid sample', () => {
      const sample = App.triggers.projects.operation.sample;
      expect(sample).toBeDefined();
      expect(sample.id).toBeDefined();
      expect(sample.name).toBeDefined();
      expect(typeof sample.public).toBe('boolean');
      expect(typeof sample.mediaCount).toBe('number');
    });

    it('upload create has valid sample', () => {
      const sample = App.creates.upload.operation.sample;
      expect(sample).toBeDefined();
      expect(sample.id).toBeDefined();
      expect(sample.hashedId).toBeDefined();
      expect(sample.name).toBeDefined();
      expect(typeof sample.public).toBe('boolean');
      expect(sample.mediaCount).toBe(0); // New project should have 0 media
    });
  });

  describe('Middleware', () => {
    it('has beforeRequest middleware configured', () => {
      expect(App.beforeRequest).toBeDefined();
      expect(Array.isArray(App.beforeRequest)).toBe(true);
      expect(App.beforeRequest.length).toBeGreaterThan(0);
    });

    it('has afterResponse middleware configured', () => {
      expect(App.afterResponse).toBeDefined();
      expect(Array.isArray(App.afterResponse)).toBe(true);
    });
  });

  describe('Authentication Configuration', () => {
    it('API key field has helpful instructions', () => {
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.label).toContain('API Key');
      expect(apiKeyField.label).toContain('wistia.com');
      expect(apiKeyField.label).toContain('account/api');
    });

    it('provides guidance about subdomain usage', () => {
      const apiKeyField = App.authentication.fields[0];
      expect(apiKeyField.label).toContain('subdomain instead of tenant');
    });
  });

  describe('Field Types and Validation', () => {
    it('all triggers have correct field types', () => {
      // Publish trigger
      const publishOutputFields = App.triggers.publish.operation.outputFields;
      const idField = publishOutputFields.find(f => f.key === 'id');
      const nameField = publishOutputFields.find(f => f.key === 'name');
      const durationField = publishOutputFields.find(f => f.key === 'duration');
      
      expect(idField.type).toBe('number');
      expect(nameField.type).toBe('string');
      expect(durationField.type).toBe('number');
    });

    it('all creates have correct field types', () => {
      // Upload create
      const uploadOutputFields = App.creates.upload.operation.outputFields;
      const idField = uploadOutputFields.find(f => f.key === 'id');
      const nameField = uploadOutputFields.find(f => f.key === 'name');
      const publicField = uploadOutputFields.find(f => f.key === 'public');
      
      expect(idField.type).toBe('integer');
      expect(nameField.type).toBe('string');
      expect(publicField.type).toBe('boolean');
    });

    it('required fields are properly marked', () => {
      // Upload create input fields
      const uploadInputFields = App.creates.upload.operation.inputFields;
      const requiredFields = uploadInputFields.filter(f => f.required);
      const optionalFields = uploadInputFields.filter(f => !f.required);
      
      expect(requiredFields).toHaveLength(1);
      expect(requiredFields[0].key).toBe('name');
      expect(optionalFields).toHaveLength(2);
    });
  });

  describe('Wistia-Specific Features', () => {
    it('uses correct Wistia API structure', () => {
      // Sample data should reflect Wistia API response structure
      const videoSample = App.triggers.publish.operation.sample;
      expect(videoSample.hashed_id).toBeDefined(); // Wistia-specific field
      expect(videoSample.assets).toBeDefined(); // Wistia-specific field
      expect(videoSample.type).toBe('Video'); // Wistia-specific field
      
      const projectSample = App.triggers.projects.operation.sample;
      expect(projectSample.hashedId).toBeDefined(); // Wistia-specific field
      expect(projectSample.anonymousCanUpload).toBeDefined(); // Wistia-specific field
    });

    it('handles Wistia project creation parameters', () => {
      const uploadInputFields = App.creates.upload.operation.inputFields;
      const publicField = uploadInputFields.find(f => f.key === 'public');
      const emailField = uploadInputFields.find(f => f.key === 'adminEmail');
      
      expect(publicField.helpText).toContain('public');
      expect(publicField.helpText).toContain('private');
      expect(emailField.helpText).toContain('owner');
      expect(emailField.helpText).toContain('Wistia Account Owner');
    });
  });

  describe('Function Signatures', () => {
    it('all operations have correct function signatures', () => {
      // All perform functions should take (z, bundle) parameters
      expect(App.triggers.publish.operation.perform.length).toBe(2);
      expect(App.triggers.projects.operation.perform.length).toBe(2);
      expect(App.creates.upload.operation.perform.length).toBe(2);
      expect(App.authentication.test.length).toBe(2);
    });

    it('all perform functions are async', () => {
      expect(App.triggers.publish.operation.perform.constructor.name).toBe('AsyncFunction');
      expect(App.triggers.projects.operation.perform.constructor.name).toBe('AsyncFunction');
      expect(App.creates.upload.operation.perform.constructor.name).toBe('AsyncFunction');
      expect(App.authentication.test.constructor.name).toBe('AsyncFunction');
    });
  });
});
