import {
  defineTrigger,
  type PollingTriggerPerform,
} from 'zapier-platform-core';

// triggers on a new projects with a certain tag
const perform = (async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.wistia.com/v1/projects',
    params: {
      per_page: 100
    },
  });
  if (response.status !== 200) {
    throw new Error('Failed to fetch projects from Wistia');
  }

  const projects = response.data || [];
  return projects.map((project: any) => ({
    id: project.id,
    label: project.name || `Project ${project.id}`,
  }));
}) satisfies PollingTriggerPerform;

export default defineTrigger({
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#triggerschema
  key: 'projects' as const,
  noun: 'Projects',

  display: {
    label: 'List Projects',
    description: 'Triggers when we nedd a list of Wistia projects (used internally for dropdowns).',
  },

  operation: {
    type: 'polling',
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      "id": 10092556,
      "public": true,
      "description": "Get started by adding a video to your folder - you can always delete it later!",
      "name": "Malforime's first folder",
      "mediaCount": 2,
      "created": "2025-09-05T11:13:03+00:00",
      "updated": "2025-09-05T13:22:15+00:00",
      "hashedId": "so2dkxq9i6",
      "anonymousCanUpload": false,
      "anonymousCanDownload": false,
      "publicId": "so2dkxq9i6"
  },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      {key: 'id', label: 'Project ID', type: 'number'},
      {key: 'name', label: 'Project Name', type: 'string'},
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ],
  },
});
