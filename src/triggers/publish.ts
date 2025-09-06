import {
  defineTrigger,
  type PollingTriggerPerform,
} from 'zapier-platform-core';

// triggers on a new video is publish.
const perform = (async (z, bundle) => {
  const response = await z.request({
    url: 'https://api.wistia.com/v1/medias',
    params: {
      tag: bundle.inputData.project_id,
      per_page: 10,
      sort_by: 'created',
      sort_direction: 'desc',
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
    label: 'New Video in Project',
    description: 'Triggers when a new video publish is added to a Wistia project.',
  },

  operation: {
    type: 'polling',
    perform,

    // `inputFields` defines the fields a user could provide
    // Zapier will pass them in as `bundle.inputData` later. They're optional.
    inputFields: [
      {
        key: 'project_id',
        label: 'Project ID',
        type: 'string' as const,
        required: true,
        helpText: `Select the Wistia project to monitor for new videos.`,
        dynamic: 'projects.id',
      }
    ],

    // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
    // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
    // returned records, and have obvious placeholder values that we can show to any user.
    sample: {
      "id": 138085539,
      "hashed_id": "lj5p4p3yzw",
      "progress": 1,
      "type": "Video",
      "archived": false,
      "name": "Clip 1 (Camera)",
      "duration": 2.73333,
      "created": "2025-09-05T13:11:20+00:00",
      "updated": "2025-09-05T13:11:44+00:00",
      "description": "",
      "status": "ready",
      "thumbnail": {
          "url": "https://embed-ssl.wistia.com/deliveries/14fe023bbafa428d4de73481c37e34fa05aeeb79.jpg?image_crop_resized=200x120",
          "width": 200,
          "height": 120
      },
      "assets": [
          {
              "width": 1280,
              "height": 720,
              "type": "OriginalFile",
              "fileSize": 1250834,
              "contentType": "video/webm",
              "url": "http://embed.wistia.com/deliveries/395ec90f8a7f9ecfb855b2985d603254.bin"
          },
          {
              "width": 1280,
              "height": 720,
              "type": "HdMp4VideoFile",
              "fileSize": 1438112,
              "contentType": "video/mp4",
              "url": "http://embed.wistia.com/deliveries/8dbad18401f6be8b6bf24c4f201920d823c54435.bin"
          },
          {
              "width": 960,
              "height": 540,
              "type": "MdMp4VideoFile",
              "fileSize": 674410,
              "contentType": "video/mp4",
              "url": "http://embed.wistia.com/deliveries/20e99dcf192cd92ae64ff587facdaf3e06811965.bin"
          },
          {
              "width": 1280,
              "height": 720,
              "type": "HdMp4VideoFile",
              "fileSize": 1433337,
              "contentType": "video/mp4",
              "url": "http://embed.wistia.com/deliveries/e09f601f1381f1e89ebd820dffc3641efe62cc2d.bin"
          },
          {
              "width": 1280,
              "height": 720,
              "type": "StillImageFile",
              "fileSize": 1291238,
              "contentType": "image/jpg",
              "url": "http://embed.wistia.com/deliveries/14fe023bbafa428d4de73481c37e34fa05aeeb79.bin"
          },
          {
              "width": 2000,
              "height": 112,
              "type": "StoryboardFile",
              "fileSize": 27774,
              "contentType": "image/jpg",
              "url": "http://embed.wistia.com/deliveries/c1a8c30c0ea5f61f425ff54b8d9b0400c413d01c.bin"
          }
      ]
  },

    // If fields are custom to each user (like spreadsheet columns), `outputFields` can create human labels
    // For a more complete example of using dynamic fields see
    // https://github.com/zapier/zapier-platform/tree/main/packages/cli#customdynamic-fields
    // Alternatively, a static field definition can be provided, to specify labels for the fields
    outputFields: [
      // these are placeholders to match the example `perform` above
      // {key: 'id', label: 'Person ID'},
      // {key: 'name', label: 'Person Name'}
      { key: 'id', label: 'Video ID', type: 'number' },
      { key: 'name', label: 'Video Name', type: 'string' },
      { key: 'duration', label: 'Duration (seconds)', type: 'number' },
      { key: 'description', label: 'Description', type: 'string' },
    ],
  },
});
