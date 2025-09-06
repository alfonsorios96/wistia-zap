import {
  defineTrigger,
  type PollingTriggerPerform,
} from 'zapier-platform-core';

// triggers on a new publish with a certain tag
const perform = (async (z, bundle) => {
  const response = await z.request({
    url: 'https://jsonplaceholder.typicode.com/posts',
    params: {
      tag: bundle.inputData.tagName,
    },
  });
  // this should return an array of objects
  return response.data;
}) satisfies PollingTriggerPerform;

export default defineTrigger({
  // see here for a full list of available properties:
  // https://github.com/zapier/zapier-platform/blob/main/packages/schema/docs/build/schema.md#triggerschema
  key: 'publish' as const,
  noun: 'Publish',

  display: {
    label: 'New Publish',
    description: 'Triggers when a new publish is created.',
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
      id: 1,
      name: 'Test',
    },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
    ],
  },
});
