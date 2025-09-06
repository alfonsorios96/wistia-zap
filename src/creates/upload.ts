import {
  defineInputFields,
  defineCreate,
  type CreatePerform,
  type InferInputData,
} from 'zapier-platform-core';

const inputFields = defineInputFields([
  {
    key: 'name',
    label: 'Project Name',
    type: 'string',
    required: true,
    helpText: 'The name of the project you want to create.',
  },
  {
    key: 'adminEmail',
    label: 'Admin Email',
    type: 'string',
    required: false,
    helpText: 'The email address of the person you want to set as the owner of this project. Defaults to the Wistia Account Owner.',
  },
  {
    key: 'public',
    label: 'Public Project',
    type: 'boolean',
    required: false,
    helpText: 'Set to true to make this project public, false to keep it private. Defaults to false.',
  },
]);

// Create a new project in Wistia
const perform = (async (z, bundle) => {
  const { name, adminEmail, public: isPublic } = bundle.inputData as {
    name: string;
    adminEmail?: string;
    public?: boolean;
  };

  // Validate required parameters
  if (!name || name.trim() === '') {
    throw new Error('Project name is required and cannot be empty');
  }

  // Prepare request body
  const requestBody: Record<string, any> = {
    name: name.trim(),
  };

  // Add optional parameters if provided
  if (adminEmail && adminEmail.trim() !== '') {
    requestBody.adminEmail = adminEmail.trim();
  }

  if (typeof isPublic === 'boolean') {
    requestBody.public = isPublic;
  }

  z.console.log('Project creation request:', { 
    name: requestBody.name,
    adminEmail: requestBody.adminEmail || 'default (account owner)',
    public: requestBody.public || false
  });

  // Perform the project creation request
  try {
    z.console.log('Sending project creation request to Wistia...');
    const response = await z.request({
      url: 'https://api.wistia.com/v1/projects',
      method: 'POST',
      body: requestBody,
      headers: {
        'Content-Type': 'application/json',
        // Authorization header is added by the beforeRequest hook
      },
    });

    z.console.log('Wistia project creation response:', {
      status: response.status,
      contentType: response.headers['content-type'],
      hasData: !!response.data,
      content: response.content?.substring?.(0, 200)
    });

    // Handle non-2xx responses
    if (response.status < 200 || response.status >= 300) {
      let errorMessage = `Project creation failed with status ${response.status}`;
      
      // Try to parse error details from Wistia response
      try {
        const errorData = typeof response.data === 'object' ? response.data : JSON.parse(response.content || '{}');
        if (errorData?.code) {
          errorMessage += ` (${errorData.code})`;
        }
        if (errorData?.detail && errorData.detail !== '') {
          errorMessage += `: ${errorData.detail}`;
        }
        if (errorData?.error) {
          errorMessage += `: ${errorData.error}`;
        }
        if (errorData?.message) {
          errorMessage += `: ${errorData.message}`;
        }
      } catch (parseError) {
        // If we can't parse the error, include the raw response
        errorMessage += `. Raw response: ${response.content || JSON.stringify(response.data)}`;
      }
      
      throw new Error(`Project creation failed: ${errorMessage}`);
    }

    // Return the created project object
    const createdProject = response.data;
    
    z.console.log('Project created successfully:', {
      id: createdProject.id,
      name: createdProject.name,
      hashedId: createdProject.hashedId
    });
    
    return {
      id: createdProject.id,
      hashedId: createdProject.hashedId,
      name: createdProject.name,
      description: createdProject.description,
      mediaCount: createdProject.mediaCount || 0,
      created: createdProject.created,
      updated: createdProject.updated,
      public: createdProject.public || false,
      anonymousCanUpload: createdProject.anonymousCanUpload || false,
      anonymousCanDownload: createdProject.anonymousCanDownload || false,
      adminEmail: createdProject.adminEmail,
    };
  } catch (error: any) {
    // Enhanced error handling
    if (error?.message?.includes('Project creation failed:')) {
      throw error; // Re-throw our custom errors
    }
    throw new Error(`Project creation failed: ${error?.message || 'Unknown error occurred'}`);
  }
}) satisfies CreatePerform<InferInputData<typeof inputFields>>;

export default defineCreate({
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#createschema
  key: 'upload',
  noun: 'Project',

  display: {
    label: 'Create New Project',
    description: 'Create a new project in Wistia for organizing your videos.',
  },

  operation: {
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    // End-users will map data into these fields. In general, they should have any fields that the API can accept. Be sure to accurately mark which fields are required!
    inputFields,

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      id: 123456,
      hashedId: 'abc123xyz789',
      name: 'My New Project',
      description: '',
      mediaCount: 0,
      created: '2024-01-15T14:20:00Z',
      updated: '2024-01-15T14:20:00Z',
      public: false,
      anonymousCanUpload: false,
      anonymousCanDownload: false,
      adminEmail: 'admin@example.com',
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      { key: 'id', label: 'Project ID', type: 'integer' },
      { key: 'hashedId', label: 'Hashed ID', type: 'string' },
      { key: 'name', label: 'Project Name', type: 'string' },
      { key: 'description', label: 'Description', type: 'string' },
      { key: 'mediaCount', label: 'Media Count', type: 'integer' },
      { key: 'created', label: 'Created Date', type: 'datetime' },
      { key: 'updated', label: 'Updated Date', type: 'datetime' },
      { key: 'public', label: 'Public Project', type: 'boolean' },
      { key: 'anonymousCanUpload', label: 'Anonymous Can Upload', type: 'boolean' },
      { key: 'anonymousCanDownload', label: 'Anonymous Can Download', type: 'boolean' },
      { key: 'adminEmail', label: 'Admin Email', type: 'string' },
    ],
  },
});
