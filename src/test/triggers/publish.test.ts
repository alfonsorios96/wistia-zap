import { describe, expect, it } from 'vitest';
import zapier from 'zapier-platform-core';

import App from '../../index.js';

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Wistia New Video in Project Trigger Configuration', () => {
  describe('Trigger Structure', () => {
    it('has publish trigger defined', () => {
      expect(App.triggers).toBeDefined();
      expect(App.triggers.publish).toBeDefined();
    });

    it('has correct trigger key and noun', () => {
      const publish = App.triggers.publish;
      expect(publish.key).toBe('publish');
      expect(publish.noun).toBe('Publish');
    });

    it('has correct display information', () => {
      const publish = App.triggers.publish;
      expect(publish.display).toBeDefined();
      expect(publish.display.label).toBe('New Video in Project');
      expect(publish.display.description).toBe('Triggers when a new video publish is added to a Wistia project.');
    });

    it('has operation defined', () => {
      const publish = App.triggers.publish;
      expect(publish.operation).toBeDefined();
      expect(publish.operation.perform).toBeDefined();
      expect(typeof publish.operation.perform).toBe('function');
      expect(publish.operation.type).toBe('polling');
    });
  });

  describe('Input Fields', () => {
    it('has correct number of input fields', () => {
      const inputFields = App.triggers.publish.operation.inputFields;
      expect(inputFields).toBeDefined();
      expect(Array.isArray(inputFields)).toBe(true);
      expect(inputFields).toHaveLength(1);
    });

    it('has project_id field with correct configuration', () => {
      const inputFields = App.triggers.publish.operation.inputFields;
      const projectField = inputFields.find(field => field.key === 'project_id');
      
      expect(projectField).toBeDefined();
      expect(projectField.key).toBe('project_id');
      expect(projectField.label).toBe('Project ID');
      expect(projectField.type).toBe('string');
      expect(projectField.required).toBe(true);
      expect(projectField.helpText).toContain('Select the Wistia project to monitor');
      expect(projectField.dynamic).toBe('projects.id');
    });

    it('project field uses dynamic dropdown', () => {
      const inputFields = App.triggers.publish.operation.inputFields;
      const projectField = inputFields.find(field => field.key === 'project_id');
      
      expect(projectField.dynamic).toBe('projects.id');
    });
  });

  describe('Operation Configuration', () => {
    it('has perform function with correct signature', () => {
      const perform = App.triggers.publish.operation.perform;
      expect(typeof perform).toBe('function');
      expect(perform.length).toBe(2); // z, bundle parameters
    });

    it('is configured as polling trigger', () => {
      const operation = App.triggers.publish.operation;
      expect(operation.type).toBe('polling');
    });

    it('has sample data defined', () => {
      const sample = App.triggers.publish.operation.sample;
      expect(sample).toBeDefined();
      expect(sample.id).toBeDefined();
      expect(sample.hashed_id).toBeDefined();
      expect(sample.name).toBeDefined();
      expect(sample.duration).toBeDefined();
      expect(sample.created).toBeDefined();
    });

    it('sample has correct structure for Wistia video', () => {
      const sample = App.triggers.publish.operation.sample;
      expect(typeof sample.id).toBe('number');
      expect(typeof sample.hashed_id).toBe('string');
      expect(typeof sample.name).toBe('string');
      expect(typeof sample.duration).toBe('number');
      expect(typeof sample.status).toBe('string');
      expect(sample.name).toBe('Clip 1 (Camera)');
      expect(sample.status).toBe('ready');
    });

    it('has output fields defined', () => {
      const outputFields = App.triggers.publish.operation.outputFields;
      expect(outputFields).toBeDefined();
      expect(Array.isArray(outputFields)).toBe(true);
      expect(outputFields.length).toBeGreaterThan(0);
    });

    it('output fields have correct structure', () => {
      const outputFields = App.triggers.publish.operation.outputFields;
      const expectedFields = ['id', 'name', 'duration', 'description'];
      
      expectedFields.forEach(expectedKey => {
        const field = outputFields.find(f => f.key === expectedKey);
        expect(field).toBeDefined();
        expect(field.label).toBeDefined();
        expect(field.type).toBeDefined();
      });
    });
  });

  describe('Sample Data Validation', () => {
    it('sample has all required video fields', () => {
      const sample = App.triggers.publish.operation.sample;
      const requiredFields = ['id', 'hashed_id', 'name', 'duration', 'created', 'updated', 'status'];
      
      requiredFields.forEach(field => {
        expect(sample).toHaveProperty(field);
      });
    });

    it('sample has additional Wistia-specific fields', () => {
      const sample = App.triggers.publish.operation.sample;
      expect(sample).toHaveProperty('thumbnail');
      expect(sample).toHaveProperty('description');
      expect(sample).toHaveProperty('assets');
      expect(sample).toHaveProperty('type');
    });

    it('sample has realistic video structure', () => {
      const sample = App.triggers.publish.operation.sample;
      expect(sample.duration).toBeGreaterThan(0);
      expect(sample.type).toBe('Video');
      expect(sample.assets).toBeDefined();
      expect(Array.isArray(sample.assets)).toBe(true);
      expect(sample.assets.length).toBeGreaterThan(0);
    });

    it('sample hashed_id has correct format', () => {
      const sample = App.triggers.publish.operation.sample;
      expect(sample.hashed_id).toMatch(/^[a-zA-Z0-9]+$/);
      expect(sample.hashed_id.length).toBeGreaterThan(5);
    });
  });

  describe('Field Validation', () => {
    it('all required fields are marked as required', () => {
      const inputFields = App.triggers.publish.operation.inputFields;
      const requiredFields = inputFields.filter(field => field.required);
      
      expect(requiredFields).toHaveLength(1);
      expect(requiredFields[0].key).toBe('project_id');
    });

    it('project_id field is properly configured for dynamic dropdown', () => {
      const inputFields = App.triggers.publish.operation.inputFields;
      const projectField = inputFields.find(field => field.key === 'project_id');
      
      expect(projectField.type).toBe('string');
      expect(projectField.dynamic).toBe('projects.id');
      expect(projectField.required).toBe(true);
    });
  });

  describe('Output Field Validation', () => {
    it('output fields match sample data structure', () => {
      const sample = App.triggers.publish.operation.sample;
      const outputFields = App.triggers.publish.operation.outputFields;
      
      // Verify that sample data has the fields described in outputFields
      outputFields.forEach(field => {
        if (field.key.includes('.')) {
          // Nested field like 'project.id'
          const [parent, child] = field.key.split('.');
          expect(sample[parent]).toBeDefined();
          expect(sample[parent][child]).toBeDefined();
        } else {
          // Top-level field
          expect(sample).toHaveProperty(field.key);
        }
      });
    });

    it('has correct types for key fields', () => {
      const outputFields = App.triggers.publish.operation.outputFields;
      
      const idField = outputFields.find(f => f.key === 'id');
      expect(idField).toBeDefined();
      expect(idField.type).toBe('number');
      
      const nameField = outputFields.find(f => f.key === 'name');
      expect(nameField).toBeDefined();
      expect(nameField.type).toBe('string');
      
      const durationField = outputFields.find(f => f.key === 'duration');
      expect(durationField).toBeDefined();
      expect(durationField.type).toBe('number');
    });

    it('has descriptive labels', () => {
      const outputFields = App.triggers.publish.operation.outputFields;
      
      outputFields.forEach(field => {
        expect(field.label).toBeDefined();
        expect(field.label.length).toBeGreaterThan(0);
        // Labels should be more descriptive than just the key
        if (!field.key.includes('.')) {
          expect(field.label).not.toBe(field.key);
        }
      });
    });
  });

  describe('Function Signatures', () => {
    it('perform function has correct signature', () => {
      const perform = App.triggers.publish.operation.perform;
      expect(perform.length).toBe(2); // z, bundle
    });

    it('function is properly async', () => {
      const perform = App.triggers.publish.operation.perform;
      expect(perform.constructor.name).toBe('AsyncFunction');
    });
  });

  describe('Wistia API Integration', () => {
    it('should use correct Wistia API endpoint parameters', async () => {
      // Test the structure without making actual API calls
      const bundle = {
        inputData: {
          project_id: 'test-project-123',
        },
        authData: {
          apiKey: 'test-api-key',
        },
      };

      try {
        await appTester(App.triggers.publish.operation.perform, bundle);
      } catch (error) {
        // Expected to fail due to network request, but should not fail on parameter structure
        expect(error.message).not.toMatch(/project_id.*undefined/);
        expect(error.message).not.toMatch(/Cannot read properties.*tag/);
      }
    });
  });
});
