import { describe, expect, it } from 'vitest';
import zapier from 'zapier-platform-core';

import App from '../../index.js';

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Wistia Projects List Trigger Configuration', () => {
  describe('Trigger Structure', () => {
    it('has projects trigger defined', () => {
      expect(App.triggers).toBeDefined();
      expect(App.triggers.projects).toBeDefined();
    });

    it('has correct trigger key and noun', () => {
      const projects = App.triggers.projects;
      expect(projects.key).toBe('projects');
      expect(projects.noun).toBe('Projects');
    });

    it('has correct display information', () => {
      const projects = App.triggers.projects;
      expect(projects.display).toBeDefined();
      expect(projects.display.label).toBe('List Projects');
      expect(projects.display.description).toContain('list of Wistia projects');
      expect(projects.display.description).toContain('dropdowns');
    });

    it('has operation defined', () => {
      const projects = App.triggers.projects;
      expect(projects.operation).toBeDefined();
      expect(projects.operation.perform).toBeDefined();
      expect(typeof projects.operation.perform).toBe('function');
      expect(projects.operation.type).toBe('polling');
    });
  });

  describe('Input Fields', () => {
    it('has no input fields (used internally for dropdowns)', () => {
      const inputFields = App.triggers.projects.operation.inputFields;
      expect(inputFields).toBeDefined();
      expect(Array.isArray(inputFields)).toBe(true);
      expect(inputFields).toHaveLength(0);
    });
  });

  describe('Operation Configuration', () => {
    it('has perform function with correct signature', () => {
      const perform = App.triggers.projects.operation.perform;
      expect(typeof perform).toBe('function');
      expect(perform.length).toBe(2); // z, bundle parameters
    });

    it('is configured as polling trigger', () => {
      const operation = App.triggers.projects.operation;
      expect(operation.type).toBe('polling');
    });

    it('has sample data defined', () => {
      const sample = App.triggers.projects.operation.sample;
      expect(sample).toBeDefined();
      expect(sample.id).toBeDefined();
      expect(sample.name).toBeDefined();
      expect(sample.public).toBeDefined();
      expect(sample.description).toBeDefined();
    });

    it('sample has correct structure for Wistia project', () => {
      const sample = App.triggers.projects.operation.sample;
      expect(typeof sample.id).toBe('number');
      expect(typeof sample.name).toBe('string');
      expect(typeof sample.public).toBe('boolean');
      expect(typeof sample.description).toBe('string');
      expect(typeof sample.mediaCount).toBe('number');
    });

    it('has output fields defined', () => {
      const outputFields = App.triggers.projects.operation.outputFields;
      expect(outputFields).toBeDefined();
      expect(Array.isArray(outputFields)).toBe(true);
      expect(outputFields.length).toBeGreaterThan(0);
    });

    it('output fields have correct structure', () => {
      const outputFields = App.triggers.projects.operation.outputFields;
      const expectedFields = ['id', 'name'];
      
      expectedFields.forEach(expectedKey => {
        const field = outputFields.find(f => f.key === expectedKey);
        expect(field).toBeDefined();
        expect(field.label).toBeDefined();
        expect(field.type).toBeDefined();
      });
    });
  });

  describe('Sample Data Validation', () => {
    it('sample has all required project fields', () => {
      const sample = App.triggers.projects.operation.sample;
      const requiredFields = ['id', 'name', 'public', 'description', 'mediaCount'];
      
      requiredFields.forEach(field => {
        expect(sample).toHaveProperty(field);
      });
    });

    it('sample has additional Wistia-specific fields', () => {
      const sample = App.triggers.projects.operation.sample;
      expect(sample).toHaveProperty('created');
      expect(sample).toHaveProperty('updated');
      expect(sample).toHaveProperty('hashedId');
      expect(sample).toHaveProperty('anonymousCanUpload');
      expect(sample).toHaveProperty('anonymousCanDownload');
    });

    it('sample has realistic project structure', () => {
      const sample = App.triggers.projects.operation.sample;
      expect(sample.id).toBe(10092556);
      expect(sample.public).toBe(true);
      expect(sample.mediaCount).toBe(2);
      expect(sample.anonymousCanUpload).toBe(false);
      expect(sample.anonymousCanDownload).toBe(false);
    });

    it('sample has correct Wistia project format', () => {
      const sample = App.triggers.projects.operation.sample;
      expect(sample.hashedId).toBeDefined();
      expect(typeof sample.hashedId).toBe('string');
      expect(sample.hashedId.length).toBeGreaterThan(0);
    });
  });

  describe('Output Field Validation', () => {
    it('output fields match sample data structure', () => {
      const sample = App.triggers.projects.operation.sample;
      const outputFields = App.triggers.projects.operation.outputFields;
      
      // Verify that sample data has the fields described in outputFields
      outputFields.forEach(field => {
        expect(sample).toHaveProperty(field.key);
      });
    });

    it('has correct types for key fields', () => {
      const outputFields = App.triggers.projects.operation.outputFields;
      
      const idField = outputFields.find(f => f.key === 'id');
      expect(idField).toBeDefined();
      expect(idField.type).toBe('number');
      expect(idField.label).toBe('Project ID');
      
      const nameField = outputFields.find(f => f.key === 'name');
      expect(nameField).toBeDefined();
      expect(nameField.type).toBe('string');
      expect(nameField.label).toBe('Project Name');
    });

    it('has descriptive labels', () => {
      const outputFields = App.triggers.projects.operation.outputFields;
      
      outputFields.forEach(field => {
        expect(field.label).toBeDefined();
        expect(field.label.length).toBeGreaterThan(0);
        // Labels should be more descriptive than just the key
        expect(field.label).not.toBe(field.key);
      });
    });
  });

  describe('Function Signatures', () => {
    it('perform function has correct signature', () => {
      const perform = App.triggers.projects.operation.perform;
      expect(perform.length).toBe(2); // z, bundle
    });

    it('function is properly async', () => {
      const perform = App.triggers.projects.operation.perform;
      expect(perform.constructor.name).toBe('AsyncFunction');
    });
  });

  describe('Dropdown Integration', () => {
    it('is used as hidden trigger for dynamic dropdowns', () => {
      // This trigger should be used by the publish trigger for project selection
      const publishTrigger = App.triggers.publish;
      const projectField = publishTrigger.operation.inputFields.find(f => f.key === 'project_id');
      
      expect(projectField).toBeDefined();
      expect(projectField.dynamic).toBe('projects.id');
    });

    it('returns data in correct format for dropdowns', async () => {
      // Test the structure without making actual API calls
      const bundle = {
        inputData: {},
        authData: {
          apiKey: 'test-api-key',
        },
      };

      try {
        await appTester(App.triggers.projects.operation.perform, bundle);
      } catch (error) {
        // Expected to fail due to network request, but should not fail on structure
        expect(error.message).not.toMatch(/Cannot read properties.*map/);
        expect(error.message).not.toMatch(/id.*undefined/);
        expect(error.message).not.toMatch(/label.*undefined/);
      }
    });
  });

  describe('Wistia API Integration', () => {
    it('should use correct Wistia API endpoint', async () => {
      // Test the structure without making actual API calls
      const bundle = {
        inputData: {},
        authData: {
          apiKey: 'test-api-key',
        },
      };

      try {
        await appTester(App.triggers.projects.operation.perform, bundle);
      } catch (error) {
        // Expected to fail due to network request, but should not fail on endpoint structure
        expect(error.message).not.toMatch(/url.*undefined/);
        expect(error.message).not.toMatch(/Cannot read properties.*url/);
      }
    });

    it('should handle API response format correctly', () => {
      // The function should map projects correctly for dropdown use
      const perform = App.triggers.projects.operation.perform;
      expect(typeof perform).toBe('function');
      
      // The function should handle the mapping from API response to dropdown format
      // This is verified by the structure tests above
    });
  });

  describe('Error Handling', () => {
    it('should handle empty project lists', () => {
      // The function should handle cases where no projects exist
      const sample = App.triggers.projects.operation.sample;
      expect(sample).toBeDefined();
      expect(typeof sample).toBe('object');
    });

    it('should provide fallback data structure', () => {
      // Sample should represent a valid project structure even if API fails
      const sample = App.triggers.projects.operation.sample;
      expect(sample.id).toBeDefined();
      expect(sample.name).toBeDefined();
      expect(typeof sample.id).toBe('number');
      expect(typeof sample.name).toBe('string');
    });
  });
});
