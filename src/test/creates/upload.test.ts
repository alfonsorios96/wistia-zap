import { describe, expect, it } from 'vitest';
import zapier from 'zapier-platform-core';

import App from '../../index.js';

const appTester = zapier.createAppTester(App);
zapier.tools.env.inject();

describe('Wistia Create New Project Configuration', () => {
  describe('Create Structure', () => {
    it('has upload create defined', () => {
      expect(App.creates).toBeDefined();
      expect(App.creates.upload).toBeDefined();
    });

    it('has correct create key and noun', () => {
      const upload = App.creates.upload;
      expect(upload.key).toBe('upload');
      expect(upload.noun).toBe('Project');
    });

    it('has correct display information', () => {
      const upload = App.creates.upload;
      expect(upload.display).toBeDefined();
      expect(upload.display.label).toBe('Create New Project');
      expect(upload.display.description).toBe('Create a new project in Wistia for organizing your videos.');
    });

    it('has operation defined', () => {
      const upload = App.creates.upload;
      expect(upload.operation).toBeDefined();
      expect(upload.operation.perform).toBeDefined();
      expect(typeof upload.operation.perform).toBe('function');
    });
  });

  describe('Input Fields', () => {
    it('has correct number of input fields', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      expect(inputFields).toBeDefined();
      expect(Array.isArray(inputFields)).toBe(true);
      expect(inputFields).toHaveLength(3);
    });

    it('has name field with correct configuration', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      const nameField = inputFields.find(field => field.key === 'name');
      
      expect(nameField).toBeDefined();
      expect(nameField.key).toBe('name');
      expect(nameField.label).toBe('Project Name');
      expect(nameField.type).toBe('string');
      expect(nameField.required).toBe(true);
      expect(nameField.helpText).toBe('The name of the project you want to create.');
    });

    it('has adminEmail field with correct configuration', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      const emailField = inputFields.find(field => field.key === 'adminEmail');
      
      expect(emailField).toBeDefined();
      expect(emailField.key).toBe('adminEmail');
      expect(emailField.label).toBe('Admin Email');
      expect(emailField.type).toBe('string');
      expect(emailField.required).toBe(false);
      expect(emailField.helpText).toContain('owner of this project');
      expect(emailField.helpText).toContain('Defaults to the Wistia Account Owner');
    });

    it('has public field with correct configuration', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      const publicField = inputFields.find(field => field.key === 'public');
      
      expect(publicField).toBeDefined();
      expect(publicField.key).toBe('public');
      expect(publicField.label).toBe('Public Project');
      expect(publicField.type).toBe('boolean');
      expect(publicField.required).toBe(false);
      expect(publicField.helpText).toContain('public');
      expect(publicField.helpText).toContain('private');
      expect(publicField.helpText).toContain('Defaults to false');
    });
  });

  describe('Operation Configuration', () => {
    it('has perform function with correct signature', () => {
      const perform = App.creates.upload.operation.perform;
      expect(typeof perform).toBe('function');
      expect(perform.length).toBe(2); // z, bundle parameters
    });

    it('has sample data defined', () => {
      const sample = App.creates.upload.operation.sample;
      expect(sample).toBeDefined();
      expect(sample.id).toBeDefined();
      expect(sample.hashedId).toBeDefined();
      expect(sample.name).toBeDefined();
      expect(sample.created).toBeDefined();
      expect(sample.updated).toBeDefined();
    });

    it('sample has correct structure for Wistia project', () => {
      const sample = App.creates.upload.operation.sample;
      expect(typeof sample.id).toBe('number');
      expect(typeof sample.hashedId).toBe('string');
      expect(typeof sample.name).toBe('string');
      expect(typeof sample.public).toBe('boolean');
      expect(typeof sample.mediaCount).toBe('number');
      expect(sample.name).toBe('My New Project');
    });

    it('has output fields defined', () => {
      const outputFields = App.creates.upload.operation.outputFields;
      expect(outputFields).toBeDefined();
      expect(Array.isArray(outputFields)).toBe(true);
      expect(outputFields.length).toBeGreaterThan(0);
    });

    it('output fields have correct structure', () => {
      const outputFields = App.creates.upload.operation.outputFields;
      const expectedFields = ['id', 'hashedId', 'name', 'created', 'updated', 'public'];
      
      expectedFields.forEach(expectedKey => {
        const field = outputFields.find(f => f.key === expectedKey);
        expect(field).toBeDefined();
        expect(field.label).toBeDefined();
        expect(field.type).toBeDefined();
      });
    });
  });

  describe('Sample Data Validation', () => {
    it('sample has all required Wistia project fields', () => {
      const sample = App.creates.upload.operation.sample;
      const requiredFields = ['id', 'hashedId', 'name', 'created', 'updated', 'public'];
      
      requiredFields.forEach(field => {
        expect(sample).toHaveProperty(field);
      });
    });

    it('sample has additional Wistia-specific fields', () => {
      const sample = App.creates.upload.operation.sample;
      expect(sample).toHaveProperty('mediaCount');
      expect(sample).toHaveProperty('description');
      expect(sample).toHaveProperty('anonymousCanUpload');
      expect(sample).toHaveProperty('anonymousCanDownload');
    });

    it('sample has realistic Wistia project structure', () => {
      const sample = App.creates.upload.operation.sample;
      expect(sample.mediaCount).toBe(0); // New project should have 0 media
      expect(sample.anonymousCanUpload).toBe(false);
      expect(sample.anonymousCanDownload).toBe(false);
    });
  });

  describe('Field Validation', () => {
    it('all required fields are marked as required', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      const requiredFields = inputFields.filter(field => field.required);
      
      expect(requiredFields).toHaveLength(1);
      expect(requiredFields[0].key).toBe('name');
    });

    it('optional fields are correctly marked', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      const optionalFields = inputFields.filter(field => !field.required);
      
      expect(optionalFields).toHaveLength(2);
      expect(optionalFields.map(f => f.key)).toContain('adminEmail');
      expect(optionalFields.map(f => f.key)).toContain('public');
    });

    it('boolean field has correct type', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      const publicField = inputFields.find(field => field.key === 'public');
      
      expect(publicField.type).toBe('boolean');
    });

    it('string fields have correct type', () => {
      const inputFields = App.creates.upload.operation.inputFields;
      const stringFields = inputFields.filter(field => field.type === 'string');
      
      expect(stringFields).toHaveLength(2);
      expect(stringFields.map(f => f.key)).toContain('name');
      expect(stringFields.map(f => f.key)).toContain('adminEmail');
    });
  });

  describe('Output Field Validation', () => {
    it('output fields match sample data structure', () => {
      const sample = App.creates.upload.operation.sample;
      const outputFields = App.creates.upload.operation.outputFields;
      
      // Verify that sample data has the fields described in outputFields
      outputFields.forEach(field => {
        expect(sample).toHaveProperty(field.key);
      });
    });

    it('has correct types for key fields', () => {
      const outputFields = App.creates.upload.operation.outputFields;
      
      const idField = outputFields.find(f => f.key === 'id');
      expect(idField).toBeDefined();
      expect(idField.type).toBe('integer');
      
      const nameField = outputFields.find(f => f.key === 'name');
      expect(nameField).toBeDefined();
      expect(nameField.type).toBe('string');
      
      const publicField = outputFields.find(f => f.key === 'public');
      expect(publicField).toBeDefined();
      expect(publicField.type).toBe('boolean');
    });

    it('has descriptive labels', () => {
      const outputFields = App.creates.upload.operation.outputFields;
      
      outputFields.forEach(field => {
        expect(field.label).toBeDefined();
        expect(field.label.length).toBeGreaterThan(0);
        expect(field.label).not.toBe(field.key); // Label should be more descriptive than key
      });
    });
  });

  describe('Function Signatures', () => {
    it('perform function has correct signature', () => {
      const perform = App.creates.upload.operation.perform;
      expect(perform.length).toBe(2); // z, bundle
    });

    it('function is properly async', () => {
      const perform = App.creates.upload.operation.perform;
      expect(perform.constructor.name).toBe('AsyncFunction');
    });
  });
});
